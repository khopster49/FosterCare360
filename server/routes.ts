import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emailService } from "./email-service";
import { setupAuth, isAuthenticated } from "./replitAuth";
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
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
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
      
      const updatedApplicant = await storage.updateApplicant(id, req.body);
      return res.json(updatedApplicant);
    } catch (error) {
      return res.status(500).json({ 
        message: "Failed to update applicant" 
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

  const httpServer = createServer(app);
  return httpServer;
}
