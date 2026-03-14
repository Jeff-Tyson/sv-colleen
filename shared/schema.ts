import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("viewer"), // admin | viewer
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const surveyItems = pgTable("survey_items", {
  id: varchar("id").primaryKey(),
  surveyId: text("survey_id").notNull(), // e.g. "R1", "A"
  category: text("category").notNull(),
  priority: text("priority").notNull(), // High | Medium | Low
  description: text("description").notNull(),
  task: text("task"),
  materials: text("materials"),
  estimatedCompletion: text("estimated_completion"),
  actualCompletion: text("actual_completion"),
  status: text("status").notNull().default("pending"), // pending | in-progress | completed
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSurveyItemSchema = createInsertSchema(surveyItems).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertSurveyItem = z.infer<typeof insertSurveyItemSchema>;
export type SurveyItem = typeof surveyItems.$inferSelect;

export const accessCodes = pgTable("access_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  role: text("role").notNull().default("viewer"), // admin | viewer
  createdBy: text("created_by"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAccessCodeSchema = createInsertSchema(accessCodes).pick({
  code: true,
  role: true,
  createdBy: true,
  expiresAt: true,
});

export type InsertAccessCode = z.infer<typeof insertAccessCodeSchema>;
export type AccessCode = typeof accessCodes.$inferSelect;
