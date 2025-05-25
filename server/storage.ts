import { 
  type Applicant, 
  type InsertApplicant,
  type EducationEntry,
  type InsertEducationEntry,
  type EmploymentEntry,
  type InsertEmploymentEntry,
  type EmploymentGap,
  type InsertEmploymentGap,
  type DbsCheck,
  type InsertDbsCheck,
  type Reference,
  type InsertReference,
  type User, 
  type UpsertUser,
  users,
  applicants,
  educationEntries,
  employmentEntries,
  employmentGaps,
  dbsChecks,
  references
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods (for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Applicant methods
  getApplicant(id: number): Promise<Applicant | undefined>;
  getApplicantByEmail(email: string): Promise<Applicant | undefined>;
  createApplicant(applicant: InsertApplicant): Promise<Applicant>;
  updateApplicant(id: number, applicant: Partial<Applicant>): Promise<Applicant | undefined>;

  // Education methods
  getEducationEntries(applicantId: number): Promise<EducationEntry[]>;
  createEducationEntry(entry: InsertEducationEntry): Promise<EducationEntry>;
  updateEducationEntry(id: number, entry: Partial<EducationEntry>): Promise<EducationEntry | undefined>;
  deleteEducationEntry(id: number): Promise<boolean>;

  // Employment methods
  getEmploymentEntries(applicantId: number): Promise<EmploymentEntry[]>;
  createEmploymentEntry(entry: InsertEmploymentEntry): Promise<EmploymentEntry>;
  updateEmploymentEntry(id: number, entry: Partial<EmploymentEntry>): Promise<EmploymentEntry | undefined>;
  deleteEmploymentEntry(id: number): Promise<boolean>;

  // Employment Gap methods
  getEmploymentGaps(applicantId: number): Promise<EmploymentGap[]>;
  createEmploymentGap(gap: InsertEmploymentGap): Promise<EmploymentGap>;
  updateEmploymentGap(id: number, gap: Partial<EmploymentGap>): Promise<EmploymentGap | undefined>;
  deleteEmploymentGap(id: number): Promise<boolean>;

  // DBS Check methods
  getDbsCheck(applicantId: number): Promise<DbsCheck | undefined>;
  createDbsCheck(check: InsertDbsCheck): Promise<DbsCheck>;
  updateDbsCheck(id: number, check: Partial<DbsCheck>): Promise<DbsCheck | undefined>;

  // Reference methods
  getReferences(applicantId: number): Promise<Reference[]>;
  getReferencesByEmploymentEntry(employmentEntryId: number): Promise<Reference[]>;
  createReference(reference: InsertReference): Promise<Reference>;
  updateReference(id: number, reference: Partial<Reference>): Promise<Reference | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Applicant methods
  async getApplicant(id: number): Promise<Applicant | undefined> {
    const [applicant] = await db.select().from(applicants).where(eq(applicants.id, id));
    return applicant;
  }

  async getApplicantByEmail(email: string): Promise<Applicant | undefined> {
    const [applicant] = await db.select().from(applicants).where(eq(applicants.email, email));
    return applicant;
  }

  async createApplicant(insertApplicant: InsertApplicant): Promise<Applicant> {
    const [applicant] = await db.insert(applicants).values(insertApplicant).returning();
    return applicant;
  }

  async updateApplicant(id: number, applicantData: Partial<Applicant>): Promise<Applicant | undefined> {
    const [applicant] = await db
      .update(applicants)
      .set(applicantData)
      .where(eq(applicants.id, id))
      .returning();
    return applicant;
  }

  // Education methods
  async getEducationEntries(applicantId: number): Promise<EducationEntry[]> {
    return await db.select().from(educationEntries).where(eq(educationEntries.applicantId, applicantId));
  }

  async createEducationEntry(insertEntry: InsertEducationEntry): Promise<EducationEntry> {
    const [entry] = await db.insert(educationEntries).values(insertEntry).returning();
    return entry;
  }

  async updateEducationEntry(id: number, entryData: Partial<EducationEntry>): Promise<EducationEntry | undefined> {
    const [entry] = await db
      .update(educationEntries)
      .set(entryData)
      .where(eq(educationEntries.id, id))
      .returning();
    return entry;
  }

  async deleteEducationEntry(id: number): Promise<boolean> {
    const result = await db.delete(educationEntries).where(eq(educationEntries.id, id));
    return result.rowCount > 0;
  }

  // Employment methods
  async getEmploymentEntries(applicantId: number): Promise<EmploymentEntry[]> {
    return await db.select().from(employmentEntries).where(eq(employmentEntries.applicantId, applicantId));
  }

  async createEmploymentEntry(insertEntry: InsertEmploymentEntry): Promise<EmploymentEntry> {
    const [entry] = await db.insert(employmentEntries).values(insertEntry).returning();
    return entry;
  }

  async updateEmploymentEntry(id: number, entryData: Partial<EmploymentEntry>): Promise<EmploymentEntry | undefined> {
    const [entry] = await db
      .update(employmentEntries)
      .set(entryData)
      .where(eq(employmentEntries.id, id))
      .returning();
    return entry;
  }

  async deleteEmploymentEntry(id: number): Promise<boolean> {
    const result = await db.delete(employmentEntries).where(eq(employmentEntries.id, id));
    return result.rowCount > 0;
  }

  // Employment Gap methods
  async getEmploymentGaps(applicantId: number): Promise<EmploymentGap[]> {
    return await db.select().from(employmentGaps).where(eq(employmentGaps.applicantId, applicantId));
  }

  async createEmploymentGap(insertGap: InsertEmploymentGap): Promise<EmploymentGap> {
    const [gap] = await db.insert(employmentGaps).values(insertGap).returning();
    return gap;
  }

  async updateEmploymentGap(id: number, gapData: Partial<EmploymentGap>): Promise<EmploymentGap | undefined> {
    const [gap] = await db
      .update(employmentGaps)
      .set(gapData)
      .where(eq(employmentGaps.id, id))
      .returning();
    return gap;
  }

  async deleteEmploymentGap(id: number): Promise<boolean> {
    const result = await db.delete(employmentGaps).where(eq(employmentGaps.id, id));
    return result.rowCount > 0;
  }

  // DBS Check methods
  async getDbsCheck(applicantId: number): Promise<DbsCheck | undefined> {
    const [check] = await db.select().from(dbsChecks).where(eq(dbsChecks.applicantId, applicantId));
    return check;
  }

  async createDbsCheck(insertCheck: InsertDbsCheck): Promise<DbsCheck> {
    const [check] = await db.insert(dbsChecks).values(insertCheck).returning();
    return check;
  }

  async updateDbsCheck(id: number, checkData: Partial<DbsCheck>): Promise<DbsCheck | undefined> {
    const [check] = await db
      .update(dbsChecks)
      .set(checkData)
      .where(eq(dbsChecks.id, id))
      .returning();
    return check;
  }

  // Reference methods
  async getReferences(applicantId: number): Promise<Reference[]> {
    return await db.select().from(references).where(eq(references.applicantId, applicantId));
  }

  async getReferencesByEmploymentEntry(employmentEntryId: number): Promise<Reference[]> {
    return await db.select().from(references).where(eq(references.employmentEntryId, employmentEntryId));
  }

  async createReference(insertReference: InsertReference): Promise<Reference> {
    const [reference] = await db.insert(references).values(insertReference).returning();
    return reference;
  }

  async updateReference(id: number, referenceData: Partial<Reference>): Promise<Reference | undefined> {
    const [reference] = await db
      .update(references)
      .set(referenceData)
      .where(eq(references.id, id))
      .returning();
    return reference;
  }
}

export const storage = new DatabaseStorage();