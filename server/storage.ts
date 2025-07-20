import type { ResumeData } from "@shared/schema";

// Simple in-memory storage for resumes
export interface IStorage {
  getResumes(): ResumeData[];
  saveResume(resumeData: ResumeData): void;
  deleteResume(id: string): boolean;
}

export class MemStorage implements IStorage {
  private resumes: Map<string, ResumeData> = new Map();

  getResumes(): ResumeData[] {
    return Array.from(this.resumes.values());
  }

  saveResume(resumeData: ResumeData): void {
    const id = Date.now().toString();
    this.resumes.set(id, resumeData);
  }

  deleteResume(id: string): boolean {
    return this.resumes.delete(id);
  }
}

export const storage = new MemStorage();
