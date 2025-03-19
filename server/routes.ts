import type { Express, Request } from "express";

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: number;
      };
    }
  }
}
import { createServer } from "http";
import { storage } from "./storage";
import { 
  insertPersonaSchema, 
  insertCampaignSchema, 
  insertSimulationDataSchema,
  insertUserProfileSchema,
  insertConnectionSchema,
  insertPostSchema,
  insertCommentSchema,
  insertAchievementSchema
} from "@shared/schema";
import { simulationEngine } from "./services/simulationEngine";
import { freeMarketingAI, premiumMarketingAI, enterpriseMarketingAI } from "./services/marketingAI";

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

  // New Campaign Preview & Suggestions Routes
  app.post("/api/campaigns/preview", async (req, res) => {
    try {
      const campaignData = req.body;
      const [user] = await storage.getUserSubscription(req.user?.id);

      // Generate preview simulation data
      const previewData = await simulationEngine.simulateDay({
        ...campaignData,
        id: 0, // Temporary ID for preview
      }, 1); // Simulate first day

      res.json({
        impressions: previewData.impressions,
        clicks: previewData.clicks,
        conversions: previewData.conversions,
        ctr: previewData.ctr,
        cpc: previewData.cpc,
        costPerConversion: previewData.cpa,
        qualityScore: previewData.qualityScore
      });
    } catch (error) {
      res.status(400).json({ error: "Failed to generate campaign preview" });
    }
  });

  app.post("/api/campaigns/suggestions", async (req, res) => {
    try {
      const campaignData = req.body;
      const [user] = await storage.getUserSubscription(req.user?.id);

      // Get appropriate AI service based on subscription
      const marketingAI = user?.subscription?.tier === 'enterprise'
        ? enterpriseMarketingAI
        : user?.subscription?.tier === 'premium'
          ? premiumMarketingAI
          : freeMarketingAI;

      // Check minimum required information
      if (!campaignData.productDescription) {
        return res.json([
          "Please describe what you're promoting to get tailored suggestions"
        ]);
      }

      if (!campaignData.goal) {
        return res.json([
          "Select a campaign goal to receive targeted recommendations"
        ]);
      }

      // Get personalized or general advice based on subscription
      const suggestions = await marketingAI.getMarketingAdvice(
        campaignData,
        user,
        {
          // Only pass the properties expected by the AI service
          brandName: campaignData.brandName || '',
          industry: campaignData.industry || ''
        }
      );

      res.json(suggestions);
    } catch (error) {
      res.status(400).json({ error: "Failed to generate suggestions" });
    }
  });

  // User Profile Routes
  app.post("/api/user-profiles", async (req, res) => {
    try {
      const data = insertUserProfileSchema.parse(req.body);
      const profile = await storage.createUserProfile(data);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: "Invalid user profile data" });
    }
  });

  app.get("/api/user-profiles/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profile = await storage.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ error: "User profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve user profile" });
    }
  });

  // Connection Routes
  app.post("/api/connections", async (req, res) => {
    try {
      const data = insertConnectionSchema.parse(req.body);
      const connection = await storage.createConnection(data);
      res.json(connection);
    } catch (error) {
      res.status(400).json({ error: "Invalid connection data" });
    }
  });

  app.get("/api/users/:userId/connections", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const connections = await storage.getConnectionsByUserId(userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve connections" });
    }
  });

  app.patch("/api/connections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const connection = await storage.updateConnectionStatus(id, status);
      if (!connection) {
        return res.status(404).json({ error: "Connection not found" });
      }
      
      res.json(connection);
    } catch (error) {
      res.status(500).json({ error: "Failed to update connection" });
    }
  });

  // Post Routes
  app.post("/api/posts", async (req, res) => {
    try {
      const data = insertPostSchema.parse(req.body);
      const post = await storage.createPost(data);
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: "Invalid post data" });
    }
  });

  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.listPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve posts" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getPostById(id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve post" });
    }
  });

  // Comment Routes
  app.post("/api/comments", async (req, res) => {
    try {
      const data = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(data);
      res.json(comment);
    } catch (error) {
      res.status(400).json({ error: "Invalid comment data" });
    }
  });

  app.get("/api/posts/:postId/comments", async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const comments = await storage.getCommentsByPostId(postId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve comments" });
    }
  });

  // Achievement Routes
  app.post("/api/achievements", async (req, res) => {
    try {
      const data = insertAchievementSchema.parse(req.body);
      const achievement = await storage.createAchievement(data);
      res.json(achievement);
    } catch (error) {
      res.status(400).json({ error: "Invalid achievement data" });
    }
  });

  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.listAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve achievements" });
    }
  });

  app.get("/api/achievements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const achievement = await storage.getAchievementById(id);
      if (!achievement) {
        return res.status(404).json({ error: "Achievement not found" });
      }
      res.json(achievement);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve achievement" });
    }
  });

  return httpServer;
}