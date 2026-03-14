import {
  type User,
  type InsertUser,
  type SurveyItem,
  type InsertSurveyItem,
  type AccessCode,
  type InsertAccessCode,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getSurveyItems(): Promise<SurveyItem[]>;
  getSurveyItem(id: string): Promise<SurveyItem | undefined>;
  createSurveyItem(item: InsertSurveyItem): Promise<SurveyItem>;
  updateSurveyItem(id: string, updates: Partial<InsertSurveyItem>): Promise<SurveyItem | undefined>;
  deleteSurveyItem(id: string): Promise<boolean>;
  getAccessCodes(): Promise<AccessCode[]>;
  getAccessCodeByCode(code: string): Promise<AccessCode | undefined>;
  createAccessCode(accessCode: InsertAccessCode): Promise<AccessCode>;
  deleteAccessCode(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private surveyItemsMap: Map<string, SurveyItem>;
  private accessCodesMap: Map<string, AccessCode>;

  constructor() {
    this.users = new Map();
    this.surveyItemsMap = new Map();
    this.accessCodesMap = new Map();

    const adminCodeId = randomUUID();
    this.accessCodesMap.set(adminCodeId, {
      id: adminCodeId,
      code: "COLLEEN-ADMIN-2026",
      role: "admin",
      createdBy: "system",
      expiresAt: null,
      createdAt: new Date(),
    });

    const viewerCodeId = randomUUID();
    this.accessCodesMap.set(viewerCodeId, {
      id: viewerCodeId,
      code: "COLLEEN-VIEW-2026",
      role: "viewer",
      createdBy: "system",
      expiresAt: null,
      createdAt: new Date(),
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      role: insertUser.role || "viewer",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getSurveyItems(): Promise<SurveyItem[]> {
    return Array.from(this.surveyItemsMap.values());
  }

  async getSurveyItem(id: string): Promise<SurveyItem | undefined> {
    return this.surveyItemsMap.get(id);
  }

  async createSurveyItem(item: InsertSurveyItem): Promise<SurveyItem> {
    const surveyItem: SurveyItem = {
      id: item.id || randomUUID(),
      surveyId: item.surveyId,
      category: item.category,
      priority: item.priority,
      description: item.description,
      task: item.task || null,
      materials: item.materials || null,
      estimatedCompletion: item.estimatedCompletion || null,
      actualCompletion: item.actualCompletion || null,
      status: item.status || "pending",
      notes: item.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.surveyItemsMap.set(surveyItem.id, surveyItem);
    return surveyItem;
  }

  async updateSurveyItem(id: string, updates: Partial<InsertSurveyItem>): Promise<SurveyItem | undefined> {
    const existing = this.surveyItemsMap.get(id);
    if (!existing) return undefined;
    const updated: SurveyItem = { ...existing, ...updates, id: existing.id, updatedAt: new Date() };
    this.surveyItemsMap.set(id, updated);
    return updated;
  }

  async deleteSurveyItem(id: string): Promise<boolean> {
    return this.surveyItemsMap.delete(id);
  }

  async getAccessCodes(): Promise<AccessCode[]> {
    return Array.from(this.accessCodesMap.values());
  }

  async getAccessCodeByCode(code: string): Promise<AccessCode | undefined> {
    return Array.from(this.accessCodesMap.values()).find((ac) => ac.code === code);
  }

  async createAccessCode(insertCode: InsertAccessCode): Promise<AccessCode> {
    const id = randomUUID();
    const accessCode: AccessCode = {
      id,
      code: insertCode.code,
      role: insertCode.role || "viewer",
      createdBy: insertCode.createdBy || null,
      expiresAt: insertCode.expiresAt || null,
      createdAt: new Date(),
    };
    this.accessCodesMap.set(id, accessCode);
    return accessCode;
  }

  async deleteAccessCode(id: string): Promise<boolean> {
    return this.accessCodesMap.delete(id);
  }
}

export const storage = new MemStorage();
