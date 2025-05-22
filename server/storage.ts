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
  type InsertUser 
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private applicants: Map<number, Applicant>;
  private educationEntries: Map<number, EducationEntry>;
  private employmentEntries: Map<number, EmploymentEntry>;
  private employmentGaps: Map<number, EmploymentGap>;
  private dbsChecks: Map<number, DbsCheck>;
  private references: Map<number, Reference>;
  
  private userId: number;
  private applicantId: number;
  private educationEntryId: number;
  private employmentEntryId: number;
  private employmentGapId: number;
  private dbsCheckId: number;
  private referenceId: number;

  constructor() {
    this.users = new Map();
    this.applicants = new Map();
    this.educationEntries = new Map();
    this.employmentEntries = new Map();
    this.employmentGaps = new Map();
    this.dbsChecks = new Map();
    this.references = new Map();
    
    this.userId = 1;
    this.applicantId = 1;
    this.educationEntryId = 1;
    this.employmentEntryId = 1;
    this.employmentGapId = 1;
    this.dbsCheckId = 1;
    this.referenceId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Applicant methods
  async getApplicant(id: number): Promise<Applicant | undefined> {
    return this.applicants.get(id);
  }

  async getApplicantByEmail(email: string): Promise<Applicant | undefined> {
    return Array.from(this.applicants.values()).find(
      (applicant) => applicant.email === email,
    );
  }

  async createApplicant(insertApplicant: InsertApplicant): Promise<Applicant> {
    const id = this.applicantId++;
    const now = new Date();
    const applicant: Applicant = { 
      ...insertApplicant, 
      id, 
      createdAt: now, 
      completedAt: null,
      status: "in_progress" 
    };
    this.applicants.set(id, applicant);
    return applicant;
  }

  async updateApplicant(id: number, applicantData: Partial<Applicant>): Promise<Applicant | undefined> {
    const applicant = await this.getApplicant(id);
    if (!applicant) return undefined;
    
    const updatedApplicant = { ...applicant, ...applicantData };
    this.applicants.set(id, updatedApplicant);
    return updatedApplicant;
  }

  // Education methods
  async getEducationEntries(applicantId: number): Promise<EducationEntry[]> {
    return Array.from(this.educationEntries.values()).filter(
      (entry) => entry.applicantId === applicantId
    );
  }

  async createEducationEntry(insertEntry: InsertEducationEntry): Promise<EducationEntry> {
    const id = this.educationEntryId++;
    const entry: EducationEntry = { ...insertEntry, id };
    this.educationEntries.set(id, entry);
    return entry;
  }

  async updateEducationEntry(id: number, entryData: Partial<EducationEntry>): Promise<EducationEntry | undefined> {
    const entry = this.educationEntries.get(id);
    if (!entry) return undefined;
    
    const updatedEntry = { ...entry, ...entryData };
    this.educationEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteEducationEntry(id: number): Promise<boolean> {
    return this.educationEntries.delete(id);
  }

  // Employment methods
  async getEmploymentEntries(applicantId: number): Promise<EmploymentEntry[]> {
    return Array.from(this.employmentEntries.values()).filter(
      (entry) => entry.applicantId === applicantId
    );
  }

  async createEmploymentEntry(insertEntry: InsertEmploymentEntry): Promise<EmploymentEntry> {
    const id = this.employmentEntryId++;
    const entry: EmploymentEntry = { 
      ...insertEntry, 
      id,
      referenceRequested: false,
      referenceReceived: false,
      referenceVerified: false
    };
    this.employmentEntries.set(id, entry);
    return entry;
  }

  async updateEmploymentEntry(id: number, entryData: Partial<EmploymentEntry>): Promise<EmploymentEntry | undefined> {
    const entry = this.employmentEntries.get(id);
    if (!entry) return undefined;
    
    const updatedEntry = { ...entry, ...entryData };
    this.employmentEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteEmploymentEntry(id: number): Promise<boolean> {
    // Also delete any references associated with this employment entry
    const references = await this.getReferencesByEmploymentEntry(id);
    references.forEach(ref => this.references.delete(ref.id));
    
    return this.employmentEntries.delete(id);
  }

  // Employment Gap methods
  async getEmploymentGaps(applicantId: number): Promise<EmploymentGap[]> {
    return Array.from(this.employmentGaps.values()).filter(
      (gap) => gap.applicantId === applicantId
    );
  }

  async createEmploymentGap(insertGap: InsertEmploymentGap): Promise<EmploymentGap> {
    const id = this.employmentGapId++;
    const gap: EmploymentGap = { ...insertGap, id };
    this.employmentGaps.set(id, gap);
    return gap;
  }

  async updateEmploymentGap(id: number, gapData: Partial<EmploymentGap>): Promise<EmploymentGap | undefined> {
    const gap = this.employmentGaps.get(id);
    if (!gap) return undefined;
    
    const updatedGap = { ...gap, ...gapData };
    this.employmentGaps.set(id, updatedGap);
    return updatedGap;
  }

  async deleteEmploymentGap(id: number): Promise<boolean> {
    return this.employmentGaps.delete(id);
  }

  // DBS Check methods
  async getDbsCheck(applicantId: number): Promise<DbsCheck | undefined> {
    return Array.from(this.dbsChecks.values()).find(
      (check) => check.applicantId === applicantId
    );
  }

  async createDbsCheck(insertCheck: InsertDbsCheck): Promise<DbsCheck> {
    const id = this.dbsCheckId++;
    const check: DbsCheck = { 
      ...insertCheck, 
      id,
      status: "pending"
    };
    this.dbsChecks.set(id, check);
    return check;
  }

  async updateDbsCheck(id: number, checkData: Partial<DbsCheck>): Promise<DbsCheck | undefined> {
    const check = this.dbsChecks.get(id);
    if (!check) return undefined;
    
    const updatedCheck = { ...check, ...checkData };
    this.dbsChecks.set(id, updatedCheck);
    return updatedCheck;
  }

  // Reference methods
  async getReferences(applicantId: number): Promise<Reference[]> {
    return Array.from(this.references.values()).filter(
      (reference) => reference.applicantId === applicantId
    );
  }

  async getReferencesByEmploymentEntry(employmentEntryId: number): Promise<Reference[]> {
    return Array.from(this.references.values()).filter(
      (reference) => reference.employmentEntryId === employmentEntryId
    );
  }

  async createReference(insertReference: InsertReference): Promise<Reference> {
    const id = this.referenceId++;
    const reference: Reference = { 
      ...insertReference, 
      id,
      requestedAt: null,
      receivedAt: null,
      verifiedAt: null,
      verifiedBy: null,
      notes: null,
      status: "pending"
    };
    this.references.set(id, reference);
    return reference;
  }

  async updateReference(id: number, referenceData: Partial<Reference>): Promise<Reference | undefined> {
    const reference = this.references.get(id);
    if (!reference) return undefined;
    
    const updatedReference = { ...reference, ...referenceData };
    this.references.set(id, updatedReference);
    return updatedReference;
  }
}

export const storage = new MemStorage();
