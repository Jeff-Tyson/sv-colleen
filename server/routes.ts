import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { readFileSync } from "fs";
import { join } from "path";

// Load survey data
const surveyDataPath = join(process.cwd(), "survey-data.json");
const surveyData = JSON.parse(readFileSync(surveyDataPath, "utf-8"));

// Simple session tracking (in-memory)
const sessions = new Map<string, { userId: string; username: string; role: string }>();

function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getSession(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  return sessions.get(token) || null;
}

// Seed survey items from survey-data.json
async function seedSurveyItems() {
  const existing = await storage.getSurveyItems();
  if (existing.length > 0) return;

  const { recommendations, otherItems } = surveyData.surveyFindings;

  for (const item of recommendations) {
    await storage.createSurveyItem({
      id: item.id,
      surveyId: item.id,
      category: item.category,
      priority: item.priority,
      description: item.description,
      status: "pending",
      task: null,
      materials: null,
      estimatedCompletion: null,
      actualCompletion: null,
      notes: null,
    });
  }

  for (const item of otherItems) {
    await storage.createSurveyItem({
      id: item.id,
      surveyId: item.id,
      category: item.category,
      priority: item.priority,
      description: item.description,
      status: "pending",
      task: null,
      materials: null,
      estimatedCompletion: null,
      actualCompletion: null,
      notes: null,
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  await seedSurveyItems();

  // Vessel Info
  app.get("/api/vessel", (_req: Request, res: Response) => {
    res.json({
      vessel: surveyData.vessel,
      description: surveyData.description,
      highlights: surveyData.highlights,
    });
  });

  // Auth
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ message: "Access code required" });
      }

      const codeEntry = await storage.getAccessCodeByCode(code);
      if (!codeEntry) {
        return res.status(401).json({ message: "Invalid access code" });
      }

      if (codeEntry.expiresAt && new Date(codeEntry.expiresAt) < new Date()) {
        return res.status(401).json({ message: "Access code has expired" });
      }

      const sessionId = generateSessionId();
      const username = codeEntry.role === "admin" ? "Admin" : "Viewer";
      sessions.set(sessionId, { userId: sessionId, username, role: codeEntry.role });

      return res.json({
        token: sessionId,
        user: { id: sessionId, username, role: codeEntry.role },
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", (req: Request, res: Response) => {
    const session = getSession(req);
    if (!session) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    return res.json({ user: session });
  });

  // Survey Items
  app.get("/api/survey-items", async (_req: Request, res: Response) => {
    const items = await storage.getSurveyItems();
    return res.json(items);
  });

  app.post("/api/survey-items", async (req: Request, res: Response) => {
    const session = getSession(req);
    if (!session || session.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const item = await storage.createSurveyItem(req.body);
      return res.json(item);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/survey-items/:id", async (req: Request, res: Response) => {
    const session = getSession(req);
    if (!session || session.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const item = await storage.updateSurveyItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      return res.json(item);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/survey-items/:id", async (req: Request, res: Response) => {
    const session = getSession(req);
    if (!session || session.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const deleted = await storage.deleteSurveyItem(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.json({ success: true });
  });

  return httpServer;
}
