import { pgTable, text, serial, integer, boolean, date, timestamp, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phoneNumber: text("phone_number"),
  verificationToken: text("verification_token"),
  verificationTokenExpiry: timestamp("verification_token_expiry"),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpiry: timestamp("reset_password_token_expiry"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  phoneNumber: true,
});

export const loginSchema = z.object({
  email: z.string().email({message: "Please enter a valid email address"}),
  password: z.string().min(8, {message: "Password must be at least 8 characters"}),
});

export const registerSchema = z.object({
  email: z.string().email({message: "Please enter a valid email address"}),
  password: z.string().min(8, {message: "Password must be at least 8 characters"}),
  confirmPassword: z.string(),
  firstName: z.string().min(1, {message: "First name is required"}),
  lastName: z.string().min(1, {message: "Last name is required"}),
  phoneNumber: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Session storage for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: text("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => {
    return {
      expireIdx: index("sessions_expire_idx").on(table.expire),
    };
  }
);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Applicant Schema
export const applicants = pgTable("applicants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  firstName: text("first_name").notNull(),
  middleName: text("middle_name"),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postcode: text("postcode").notNull(),
  lastCompletedStep: integer("last_completed_step").default(0),
  saveDate: timestamp("save_date").defaultNow(),
  nationality: text("nationality").notNull(),
  rightToWork: boolean("right_to_work").notNull(),
  workDocumentType: text("work_document_type").notNull(),
  skillsAndExperience: text("skills_and_experience"),
  
  // Disciplinary and criminal record fields
  hasDisciplinary: boolean("has_disciplinary"),
  disciplinaryDetails: text("disciplinary_details"),
  hasPoliceWarning: boolean("has_police_warning"),
  hasUnresolvedCharges: boolean("has_unresolved_charges"),
  hasPoliceInvestigation: boolean("has_police_investigation"),
  hasDismissedForMisconduct: boolean("has_dismissed_for_misconduct"),
  hasProfessionalDisqualification: boolean("has_professional_disqualification"),
  hasOngoingInvestigation: boolean("has_ongoing_investigation"),
  hasProhibition: boolean("has_prohibition"),
  criminalDetails: text("criminal_details"),
  
  // Data protection and declaration fields
  dataProtectionAgreed: boolean("data_protection_agreed"),
  dataProtectionSignedDate: timestamp("data_protection_signed_date"),
  
  // Equal opportunities data
  equalOpportunitiesCompleted: boolean("equal_opportunities_completed"),
  equalOpportunitiesDate: timestamp("equal_opportunities_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  status: text("status").notNull().default("in_progress"),
});

export const insertApplicantSchema = createInsertSchema(applicants).omit({
  id: true,
  createdAt: true,
  completedAt: true,
  status: true,
});

export type InsertApplicant = z.infer<typeof insertApplicantSchema>;
export type Applicant = typeof applicants.$inferSelect;

// Education Entry Schema
export const educationEntries = pgTable("education_entries", {
  id: serial("id").primaryKey(),
  applicantId: integer("applicant_id").notNull(),
  institution: text("institution").notNull(),
  qualification: text("qualification").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  details: text("details"),
});

export const insertEducationEntrySchema = createInsertSchema(educationEntries).omit({
  id: true,
});

export type InsertEducationEntry = z.infer<typeof insertEducationEntrySchema>;
export type EducationEntry = typeof educationEntries.$inferSelect;

// Employment Entry Schema
export const employmentEntries = pgTable("employment_entries", {
  id: serial("id").primaryKey(),
  applicantId: integer("applicant_id").notNull(),
  employer: text("employer").notNull(),
  employerAddress: text("employer_address").notNull(),
  employerPhone: text("employer_phone").notNull(),
  employerMobile: text("employer_mobile"),
  position: text("position").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  isCurrent: boolean("is_current").default(false),
  duties: text("duties").notNull(),
  reasonForLeaving: text("reason_for_leaving"),
  referenceName: text("reference_name").notNull(),
  referenceEmail: text("reference_email").notNull(),
  referencePhone: text("reference_phone").notNull(),
  workedWithVulnerable: boolean("worked_with_vulnerable").default(false),
  referenceRequested: boolean("reference_requested").default(false),
  referenceReceived: boolean("reference_received").default(false),
  referenceVerified: boolean("reference_verified").default(false),
});

export const insertEmploymentEntrySchema = createInsertSchema(employmentEntries).omit({
  id: true,
  referenceRequested: true,
  referenceReceived: true,
  referenceVerified: true,
});

export type InsertEmploymentEntry = z.infer<typeof insertEmploymentEntrySchema>;
export type EmploymentEntry = typeof employmentEntries.$inferSelect;

// Employment Gap Schema
export const employmentGaps = pgTable("employment_gaps", {
  id: serial("id").primaryKey(),
  applicantId: integer("applicant_id").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  explanation: text("explanation").notNull(),
});

export const insertEmploymentGapSchema = createInsertSchema(employmentGaps).omit({
  id: true,
});

export type InsertEmploymentGap = z.infer<typeof insertEmploymentGapSchema>;
export type EmploymentGap = typeof employmentGaps.$inferSelect;

// DBS Check Schema
export const dbsChecks = pgTable("dbs_checks", {
  id: serial("id").primaryKey(),
  applicantId: integer("applicant_id").notNull(),
  existingDbs: boolean("existing_dbs").default(false),
  dbsNumber: text("dbs_number"),
  nationalInsurance: text("national_insurance"),
  birthPlace: text("birth_place"),
  fiveYearAddressHistory: boolean("five_year_address_history").default(true),
  status: text("status").notNull().default("pending"),
});

export const insertDbsCheckSchema = createInsertSchema(dbsChecks).omit({
  id: true,
  status: true,
});

export type InsertDbsCheck = z.infer<typeof insertDbsCheckSchema>;
export type DbsCheck = typeof dbsChecks.$inferSelect;

// Reference Schema
export const references = pgTable("references", {
  id: serial("id").primaryKey(),
  applicantId: integer("applicant_id").notNull(),
  employmentEntryId: integer("employment_entry_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  employer: text("employer").notNull(),
  employerAddress: text("employer_address"),
  position: text("position").notNull(),
  requestedAt: timestamp("requested_at"),
  receivedAt: timestamp("received_at"),
  verifiedAt: timestamp("verified_at"),
  verifiedBy: text("verified_by"),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
});

export const insertReferenceSchema = createInsertSchema(references).omit({
  id: true,
  requestedAt: true,
  receivedAt: true,
  verifiedAt: true,
  verifiedBy: true,
  notes: true,
  status: true,
});

export type InsertReference = z.infer<typeof insertReferenceSchema>;
export type Reference = typeof references.$inferSelect;
