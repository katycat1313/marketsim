import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertPersonaSchema, insertCampaignSchema, insertSimulationDataSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Persona routes
  app.post("/api/personas", async (req, res) => {
    try {
      const data = insertPersonaSchema.parse(req.body);
      const persona = await storage.createPersona(data);
      res.json(persona);
    } catch (error) {
      res.status(400).json({ error: "Invalid persona data" });
    }
  });

  app.get("/api/personas", async (req, res) => {
    const personas = await storage.listPersonas();
    res.json(personas);
  });

  app.get("/api/personas/:id", async (req, res) => {
    const persona = await storage.getPersona(parseInt(req.params.id));
    if (!persona) {
      res.status(404).json({ error: "Persona not found" });
      return;
    }
    res.json(persona);
  });

  // Campaign routes
  app.post("/api/campaigns", async (req, res) => {
    try {
      const data = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(data);
      res.json(campaign);
    } catch (error) {
      res.status(400).json({ error: "Invalid campaign data" });
    }
  });

  app.get("/api/campaigns", async (req, res) => {
    const campaigns = await storage.listCampaigns();
    res.json(campaigns);
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    const campaign = await storage.getCampaign(parseInt(req.params.id));
    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }
    res.json(campaign);
  });

  // Simulation routes
  app.post("/api/simulation-data", async (req, res) => {
    try {
      const data = insertSimulationDataSchema.parse(req.body);
      const simData = await storage.addSimulationData(data);
      res.json(simData);
    } catch (error) {
      res.status(400).json({ error: "Invalid simulation data" });
    }
  });

  app.get("/api/campaigns/:id/simulation", async (req, res) => {
    const data = await storage.getSimulationData(parseInt(req.params.id));
    res.json(data);
  });

  return httpServer;
}
