import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emailService } from "./email-service";
import { hashPassword, comparePassword, generateToken, authenticateToken, type AuthRequest } from "./auth";
import { 
  insertApplicantSchema, 
  insertEducationEntrySchema, 
  insertEmploymentEntrySchema,
  insertEmploymentGapSchema,
  insertDbsCheckSchema,
  insertReferenceSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const newUser = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'applicant',
      });

      // Generate token
      const token = generateToken({
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName || '',
        lastName: newUser.lastName || '',
        role: newUser.role,
      });

      res.json({
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role,
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/auth/user", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const user = await storage.getUserById(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user information" });
    }
  });
  // API routes for applicant data
  app.post("/api/applicants", async (req: Request, res: Response) => {
    try {
      const validatedData = insertApplicantSchema.parse(req.body);
      
      // Check if applicant with email already exists
      const existingApplicant = await storage.getApplicantByEmail(validatedData.email);
      if (existingApplicant) {
        return res.status(409).json({ 
          message: "An applicant with this email already exists" 
        });
      }
      
      const applicant = await storage.createApplicant(validatedData);
      return res.status(201).json(applicant);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message 
        });
      }
      return res.status(500).json({ 
        message: "Failed to create applicant" 
      });
    }
  });

  app.get("/api/applicants/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      const applicant = await storage.getApplicant(id);
      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      
      return res.json(applicant);
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to retrieve applicant" 
      });
    }
  });

  app.patch("/api/applicants/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      const applicant = await storage.getApplicant(id);
      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      
      console.log("Updating applicant with data:", req.body);
      
      // Convert date strings to Date objects
      const updateData = { ...req.body };
      if (updateData.dataProtectionSignedDate) {
        updateData.dataProtectionSignedDate = new Date(updateData.dataProtectionSignedDate);
      }
      if (updateData.privacyNoticeSignedDate) {
        updateData.privacyNoticeSignedDate = new Date(updateData.privacyNoticeSignedDate);
      }
      if (updateData.dateOfBirth) {
        updateData.dateOfBirth = new Date(updateData.dateOfBirth);
      }
      
      const updatedApplicant = await storage.updateApplicant(id, updateData);
      return res.json(updatedApplicant);
    } catch (error) {
      console.error("Failed to update applicant:", error);
      return res.status(500).json({ 
        message: "Failed to update applicant",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // API routes for education entries
  app.post("/api/applicants/:id/education", async (req: Request, res: Response) => {
    try {
      const applicantId = parseInt(req.params.id);
      if (isNaN(applicantId)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      const applicant = await storage.getApplicant(applicantId);
      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      
      const data = insertEducationEntrySchema.parse({
        ...req.body,
        applicantId
      });
      
      const educationEntry = await storage.createEducationEntry(data);
      return res.status(201).json(educationEntry);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message 
        });
      }
      return res.status(500).json({ 
        message: "Failed to create education entry" 
      });
    }
  });

  app.get("/api/applicants/:id/education", async (req: Request, res: Response) => {
    try {
      const applicantId = parseInt(req.params.id);
      if (isNaN(applicantId)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      const entries = await storage.getEducationEntries(applicantId);
      return res.json(entries);
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to retrieve education entries" 
      });
    }
  });

  app.patch("/api/education/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid education entry ID" });
      }
      
      const updatedEntry = await storage.updateEducationEntry(id, req.body);
      if (!updatedEntry) {
        return res.status(404).json({ message: "Education entry not found" });
      }
      
      return res.json(updatedEntry);
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to update education entry" 
      });
    }
  });

  app.delete("/api/education/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid education entry ID" });
      }
      
      const success = await storage.deleteEducationEntry(id);
      if (!success) {
        return res.status(404).json({ message: "Education entry not found" });
      }
      
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to delete education entry" 
      });
    }
  });

  // API routes for employment entries
  app.post("/api/applicants/:id/employment", async (req: Request, res: Response) => {
    try {
      const applicantId = parseInt(req.params.id);
      if (isNaN(applicantId)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      const applicant = await storage.getApplicant(applicantId);
      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      
      const data = insertEmploymentEntrySchema.parse({
        ...req.body,
        applicantId
      });
      
      const employmentEntry = await storage.createEmploymentEntry(data);
      return res.status(201).json(employmentEntry);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message 
        });
      }
      return res.status(500).json({ 
        message: "Failed to create employment entry" 
      });
    }
  });

  app.get("/api/applicants/:id/employment", async (req: Request, res: Response) => {
    try {
      const applicantId = parseInt(req.params.id);
      if (isNaN(applicantId)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      const entries = await storage.getEmploymentEntries(applicantId);
      return res.json(entries);
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to retrieve employment entries" 
      });
    }
  });

  app.patch("/api/employment/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid employment entry ID" });
      }
      
      const updatedEntry = await storage.updateEmploymentEntry(id, req.body);
      if (!updatedEntry) {
        return res.status(404).json({ message: "Employment entry not found" });
      }
      
      return res.json(updatedEntry);
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to update employment entry" 
      });
    }
  });

  app.delete("/api/employment/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid employment entry ID" });
      }
      
      const success = await storage.deleteEmploymentEntry(id);
      if (!success) {
        return res.status(404).json({ message: "Employment entry not found" });
      }
      
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to delete employment entry" 
      });
    }
  });

  // API routes for employment gaps
  app.post("/api/applicants/:id/gaps", async (req: Request, res: Response) => {
    try {
      const applicantId = parseInt(req.params.id);
      if (isNaN(applicantId)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      const applicant = await storage.getApplicant(applicantId);
      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      
      const data = insertEmploymentGapSchema.parse({
        ...req.body,
        applicantId
      });
      
      const gap = await storage.createEmploymentGap(data);
      return res.status(201).json(gap);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message 
        });
      }
      return res.status(500).json({ 
        message: "Failed to create employment gap" 
      });
    }
  });

  app.get("/api/applicants/:id/gaps", async (req: Request, res: Response) => {
    try {
      const applicantId = parseInt(req.params.id);
      if (isNaN(applicantId)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      const gaps = await storage.getEmploymentGaps(applicantId);
      return res.json(gaps);
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to retrieve employment gaps" 
      });
    }
  });

  app.patch("/api/gaps/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid gap ID" });
      }
      
      const updatedGap = await storage.updateEmploymentGap(id, req.body);
      if (!updatedGap) {
        return res.status(404).json({ message: "Employment gap not found" });
      }
      
      return res.json(updatedGap);
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to update employment gap" 
      });
    }
  });

  app.delete("/api/gaps/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid gap ID" });
      }
      
      const success = await storage.deleteEmploymentGap(id);
      if (!success) {
        return res.status(404).json({ message: "Employment gap not found" });
      }
      
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to delete employment gap" 
      });
    }
  });

  // API routes for DBS checks
  app.post("/api/applicants/:id/dbs", async (req: Request, res: Response) => {
    try {
      const applicantId = parseInt(req.params.id);
      if (isNaN(applicantId)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      const applicant = await storage.getApplicant(applicantId);
      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      
      // Check if DBS check already exists
      const existingCheck = await storage.getDbsCheck(applicantId);
      if (existingCheck) {
        return res.status(409).json({ 
          message: "A DBS check already exists for this applicant" 
        });
      }
      
      const data = insertDbsCheckSchema.parse({
        ...req.body,
        applicantId
      });
      
      const dbsCheck = await storage.createDbsCheck(data);
      
      // Send email notification for DBS check
      await emailService.sendDbsCheckNotification(
        applicant.email, 
        `${applicant.firstName} ${applicant.lastName}`
      );
      
      return res.status(201).json(dbsCheck);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message 
        });
      }
      return res.status(500).json({ 
        message: "Failed to create DBS check" 
      });
    }
  });

  app.get("/api/applicants/:id/dbs", async (req: Request, res: Response) => {
    try {
      const applicantId = parseInt(req.params.id);
      if (isNaN(applicantId)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      const dbsCheck = await storage.getDbsCheck(applicantId);
      if (!dbsCheck) {
        return res.status(404).json({ message: "DBS check not found" });
      }
      
      return res.json(dbsCheck);
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to retrieve DBS check" 
      });
    }
  });

  app.patch("/api/dbs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid DBS check ID" });
      }
      
      const updatedCheck = await storage.updateDbsCheck(id, req.body);
      if (!updatedCheck) {
        return res.status(404).json({ message: "DBS check not found" });
      }
      
      return res.json(updatedCheck);
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to update DBS check" 
      });
    }
  });
  
  // API routes for references
  app.post("/api/applicants/:id/references", async (req: Request, res: Response) => {
    try {
      const applicantId = parseInt(req.params.id);
      if (isNaN(applicantId)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      const applicant = await storage.getApplicant(applicantId);
      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      
      // Make sure to capture employer address data properly
      const data = insertReferenceSchema.parse({
        ...req.body,
        applicantId,
        employerAddress: req.body.employerAddress || ''
      });
      
      // Verify the employment entry exists
      const employmentEntry = await storage.getEmploymentEntries(applicantId)
        .then(entries => entries.find(e => e.id === data.employmentEntryId));
        
      if (!employmentEntry) {
        return res.status(404).json({ 
          message: "Employment entry not found" 
        });
      }
      
      const reference = await storage.createReference(data);
      
      // Send reference request email
      await emailService.sendReferenceRequest(employmentEntry, applicantId);
      
      // Update the employment entry to mark reference as requested
      await storage.updateEmploymentEntry(employmentEntry.id, {
        referenceRequested: true
      });
      
      return res.status(201).json(reference);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message 
        });
      }
      return res.status(500).json({ 
        message: "Failed to create reference" 
      });
    }
  });

  app.get("/api/applicants/:id/references", async (req: Request, res: Response) => {
    try {
      const applicantId = parseInt(req.params.id);
      if (isNaN(applicantId)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      const references = await storage.getReferences(applicantId);
      return res.json(references);
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to retrieve references" 
      });
    }
  });

  app.patch("/api/references/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid reference ID" });
      }
      
      const updatedReference = await storage.updateReference(id, req.body);
      if (!updatedReference) {
        return res.status(404).json({ message: "Reference not found" });
      }
      
      // If reference is marked as received, update the employment entry
      if (req.body.receivedAt && updatedReference.employmentEntryId) {
        await storage.updateEmploymentEntry(updatedReference.employmentEntryId, {
          referenceReceived: true
        });
      }
      
      // If reference is marked as verified, update the employment entry
      if (req.body.verifiedAt && updatedReference.employmentEntryId) {
        await storage.updateEmploymentEntry(updatedReference.employmentEntryId, {
          referenceVerified: true
        });
      }
      
      return res.json(updatedReference);
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to update reference" 
      });
    }
  });

  // API route for equal opportunities data
  app.post("/api/applicants/:id/equal-opportunities", async (req: Request, res: Response) => {
    try {
      const applicantId = parseInt(req.params.id);
      if (isNaN(applicantId)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      const applicant = await storage.getApplicant(applicantId);
      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      
      // Update the applicant with equal opportunities info
      const updatedApplicant = await storage.updateApplicant(applicantId, {
        equalOpportunitiesCompleted: true,
        equalOpportunitiesDate: new Date()
      });
      
      return res.status(201).json(updatedApplicant);
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to save equal opportunities data" 
      });
    }
  });

  // API route for privacy notice acknowledgment
  app.post("/api/applicants/:id/privacy-notice", async (req: Request, res: Response) => {
    try {
      const applicantId = parseInt(req.params.id);
      if (isNaN(applicantId)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      const applicant = await storage.getApplicant(applicantId);
      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      
      // Update the applicant with privacy notice acknowledgment
      const updatedApplicant = await storage.updateApplicant(applicantId, {
        privacyNoticeAcknowledged: true,
        privacyNoticeDate: new Date()
      });
      
      return res.status(201).json(updatedApplicant);
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to save privacy notice acknowledgment" 
      });
    }
  });

  // Submit complete application
  app.post("/api/applicants/:id/submit", async (req: Request, res: Response) => {
    try {
      const applicantId = parseInt(req.params.id);
      if (isNaN(applicantId)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      const applicant = await storage.getApplicant(applicantId);
      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      
      // Update application status and completion date
      const completedApplicant = await storage.updateApplicant(applicantId, {
        status: "submitted",
        completedAt: new Date()
      });
      
      // Send confirmation email
      await emailService.sendApplicationConfirmation(
        applicant.email,
        `${applicant.firstName} ${applicant.lastName}`
      );
      
      return res.json({
        success: true,
        applicant: completedApplicant
      });
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to submit application" 
      });
    }
  });

  // PDF generation endpoint
  app.get("/api/applicants/:id/pdf", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid applicant ID" });
      }
      
      const applicant = await storage.getApplicant(id);
      if (!applicant) {
        return res.status(404).json({ message: "Applicant not found" });
      }
      
      const education = await storage.getEducationEntries(id);
      const employment = await storage.getEmploymentEntries(id);
      const references = await storage.getReferences(id);
      const verification = await storage.getDbsCheck(id);
      
      const data = {
        applicant,
        education,
        employment,
        references,
        verification
      };
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=application-${id}.pdf`);
      
      const React = require('react');
      const { ApplicationPDF } = require('../client/src/components/application-pdf');
      const { renderToStream } = require('@react-pdf/renderer');
      
      const stream = await renderToStream(React.createElement(ApplicationPDF, data));
      stream.pipe(res);
    } catch (error) {
      console.error('PDF generation error:', error);
      return res.status(500).json({ 
        message: "Failed to generate PDF" 
      });
    }
  });

  // Complete application submission endpoint
  app.post("/api/applications/submit", async (req: Request, res: Response) => {
    try {
      // Create the applicant record
      const applicantData = {
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phoneNumber || req.body.mobileNumber,
        address: req.body.address,
        city: req.body.city || 'Not provided',
        postcode: req.body.postcode,
        nationality: req.body.nationality || 'Not provided',
        rightToWork: req.body.rightToWork === 'yes',
        workDocumentType: req.body.workDocumentType,
        skillsAndExperience: req.body.skills,
        hasCriminalRecord: req.body.criminalConvictions,
        hasPoliceInvestigation: req.body.disciplinaryAction,
        hasDismissedForMisconduct: req.body.safeguardingConcerns,
        criminalDetails: req.body.criminalConvictionsDetails || req.body.disciplinaryActionDetails || req.body.safeguardingConcernsDetails,
        dataProtectionAgreed: req.body.declaration,
        dataProtectionSignedDate: req.body.signatureDate ? new Date(req.body.signatureDate) : new Date(),
        status: "submitted",
        completedAt: new Date()
      };

      const applicant = await storage.createApplicant(applicantData);

      // Add education entries if provided
      if (req.body.education && Array.isArray(req.body.education)) {
        for (const edu of req.body.education) {
          await storage.createEducationEntry({
            applicantId: applicant.id,
            institution: edu.institution,
            qualification: edu.qualification,
            startDate: edu.startDate,
            endDate: edu.endDate,
            details: edu.details
          });
        }
      }

      // Add employment entries if provided
      if (req.body.employment && Array.isArray(req.body.employment)) {
        for (const emp of req.body.employment) {
          await storage.createEmploymentEntry({
            applicantId: applicant.id,
            employer: emp.employer,
            employerAddress: emp.employerAddress,
            employerPostcode: emp.employerPostcode,
            employerPhone: emp.employerPhone,
            position: emp.jobTitle || emp.position,
            startDate: emp.startDate,
            duties: emp.responsibilities || emp.duties,
            referenceName: emp.refereeName,
            referenceEmail: emp.refereeEmail,
            referencePhone: emp.refereePhone
          });
        }
      }

      return res.status(201).json({
        success: true,
        id: applicant.id,
        message: "Application submitted successfully"
      });
    } catch (error) {
      console.error('Application submission error:', error);
      return res.status(500).json({ 
        message: "Failed to submit application" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
