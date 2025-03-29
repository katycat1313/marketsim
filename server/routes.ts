import type { Express, Request, Response } from "express";

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
import { TutorialService } from './services/tutorialService';
import { enhancedTutorialService } from './services/enhancedTutorialService';
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

import { tutorialSimulationService } from "./services/tutorialSimulationService";
import { seoSimulationService } from "./services/seoSimulationService";
import stripeRoutes from "./routes/stripeRoutes";
import { registerAdSimulationRoutes } from "./routes/adSimulationRoutes";
import { registerDataVisualizationRoutes } from "./routes/dataVisualizationRoutes";
import { authService } from "./services/authService";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);
  
  // Authentication routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, marketingExperience } = req.body;
      
      if (!email || !password || !firstName || !lastName || !marketingExperience) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      const user = await authService.registerUser(
        email, 
        password, 
        firstName, 
        lastName, 
        marketingExperience
      );
      
      // Return user without password
      res.status(201).json(user);
    } catch (error) {
      console.error("Registration error:", error);
      const message = error instanceof Error ? error.message : "Registration failed";
      res.status(400).json({ message });
    }
  });
  
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const user = await authService.loginUser(email, password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // In a production app, you would set up a session here
      // using the express-session and connect-pg-simple packages
      // For now, we'll rely on localStorage in the client
      
      res.json(user);
    } catch (error) {
      console.error("Login error:", error);
      const message = error instanceof Error ? error.message : "Login failed";
      res.status(500).json({ message });
    }
  });
  
  app.get("/api/auth/user", async (req: Request, res: Response) => {
    try {
      // In a real app with proper session management, you'd get the user ID from req.user
      // For now, we'll use query parameters for testing
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const user = await authService.getUserById(parseInt(userId));
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error getting user:", error);
      const message = error instanceof Error ? error.message : "Failed to retrieve user data";
      res.status(500).json({ message });
    }
  });

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

  // Connections Routes
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
      
      if (!status || !['accepted', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ error: "Invalid connection status" });
      }
      
      const updatedConnection = await storage.updateConnectionStatus(id, status);
      if (!updatedConnection) {
        return res.status(404).json({ error: "Connection not found" });
      }
      
      res.json(updatedConnection);
    } catch (error) {
      res.status(500).json({ error: "Failed to update connection" });
    }
  });

  // Tutorial Routes
  app.get("/api/tutorials", async (req, res) => {
    try {
      // For backward compatibility, we'll switch to using the original TutorialService for now
      const tutorialService = new TutorialService();
      
      // Check user level if user is logged in, otherwise use query parameter or default to Beginner
      let userLevel = 'Beginner';
      let hasPremiumAccess = false;
      
      if (req.user?.id) {
        try {
          // Get user profile for level
          const userProfile = await storage.getUserProfile(req.user.id);
          if (userProfile) {
            userLevel = userProfile.level;
          }
          
          // Check subscription status
          const [userWithSubscription] = await storage.getUserSubscription(req.user.id);
          if (userWithSubscription?.subscription) {
            // Premium or Enterprise subscribers get premium content access
            hasPremiumAccess = ['premium', 'enterprise'].includes(userWithSubscription.subscription.tier);
            console.log(`User has ${userWithSubscription.subscription.tier} subscription, premium access: ${hasPremiumAccess}`);
          } else {
            console.log('User has no active subscription, no premium access');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Continue with default access if user data can't be fetched
        }
      } 
      
      // Use query parameter if provided
      if (req.query.level) {
        userLevel = req.query.level as string;
      }
      
      // Get all tutorials - not filtering by level to ensure all chapters have content
      const tutorials = await tutorialService.getTutorials(userLevel);
      
      // Process tutorials based on user's subscription status
      let processedTutorials = tutorials;
      
      if (!hasPremiumAccess) {
        // For non-premium users, modify premium content to show locked status
        processedTutorials = tutorials.map(tutorial => {
          if (tutorial.isPremium) {
            // Keep the tutorial visible but mark content as locked
            return {
              ...tutorial,
              content: `# Premium Content (Subscription Required)\n\nThis advanced tutorial is available exclusively to premium subscribers. Upgrade your subscription to access this content and unlock all premium features.`,
              isLocked: true,
            };
          }
          return tutorial;
        });
      }
      
      // Add debug logging to see what we're returning
      if (processedTutorials && Array.isArray(processedTutorials)) {
        console.log(`Sending ${processedTutorials.length} tutorials back to client (${processedTutorials.filter(t => t.isPremium).length} premium)`);
        const chapterCounts: Record<string, number> = {};
        processedTutorials.forEach(t => {
          const chapter = t.chapterNumber || 1;
          const chapterKey = chapter.toString();
          chapterCounts[chapterKey] = (chapterCounts[chapterKey] || 0) + 1;
        });
        console.log('Tutorial distribution by chapter in API response:', chapterCounts);
      }
      
      res.json(processedTutorials);
    } catch (error) {
      console.error("Error retrieving tutorials:", error);
      res.status(500).json({ error: "Failed to retrieve tutorials" });
    }
  });

  app.get("/api/tutorials/:id", async (req, res) => {
    try {
      const tutorialId = parseInt(req.params.id);
      
      if (isNaN(tutorialId)) {
        return res.status(400).json({ error: "Invalid tutorial ID format" });
      }
      
      // Check user subscription status
      let hasPremiumAccess = false;
      
      if (req.user?.id) {
        try {
          // Check subscription status
          const [userWithSubscription] = await storage.getUserSubscription(req.user.id);
          if (userWithSubscription?.subscription) {
            // Premium or Enterprise subscribers get premium access
            hasPremiumAccess = ['premium', 'enterprise'].includes(userWithSubscription.subscription.tier);
            console.log(`User has ${userWithSubscription.subscription.tier} subscription, premium access: ${hasPremiumAccess}`);
          } else {
            console.log('User has no active subscription, no premium access');
          }
        } catch (error) {
          console.error("Error fetching user subscription:", error);
        }
      }
      
      // Get tutorial
      const tutorialService = new TutorialService();
      const tutorials = await tutorialService.getTutorials('all'); // Get all tutorials
      
      // Find specific tutorial
      const tutorial = tutorials.find(t => t.id === tutorialId);
      
      if (!tutorial) {
        return res.status(404).json({ error: "Tutorial not found" });
      }
      
      // Check if tutorial is premium and user doesn't have premium access
      if (tutorial.isPremium && !hasPremiumAccess) {
        // Return tutorial with locked content
        return res.json({
          ...tutorial,
          content: `# Premium Content (Subscription Required)\n\nThis advanced tutorial is available exclusively to premium subscribers. Upgrade your subscription to access this content and unlock all premium features.`,
          isLocked: true,
        });
      }
      
      // Return full tutorial content
      res.json(tutorial);
    } catch (error) {
      console.error("Error retrieving tutorial:", error);
      res.status(500).json({ error: "Failed to retrieve tutorial" });
    }
  });

  app.get("/api/tutorials/progress", async (req, res) => {
    try {
      // Require authentication
      if (!req.user?.id) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const userId = req.user.id;
      console.log(`API request to get tutorial progress for user ${userId}`);
      
      // For backward compatibility, we'll use the original TutorialService for now
      const tutorialService = new TutorialService();
      const progress = await tutorialService.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error retrieving tutorial progress:", error);
      res.status(500).json({ error: "Failed to retrieve tutorial progress" });
    }
  });

  app.post("/api/tutorials/complete", async (req, res) => {
    try {
      const { tutorialId } = req.body;
      
      if (!tutorialId) {
        return res.status(400).json({ error: "Tutorial ID is required" });
      }
      
      // Require authentication
      if (!req.user?.id) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const userId = req.user.id;
      console.log(`API request to complete tutorial ${tutorialId} for user ${userId}`);
      
      // For backward compatibility, we'll use the original TutorialService for now
      const tutorialService = new TutorialService();
      await tutorialService.markTutorialComplete(userId, tutorialId);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking tutorial as complete:", error);
      res.status(500).json({ error: "Failed to mark tutorial as complete", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // SEO Simulation Routes
  app.get("/api/seo-simulations", async (req, res) => {
    try {
      // Get all simulations
      console.log("Getting SEO simulations...");
      const simulations = await seoSimulationService.getSimulations();
      console.log("SEO simulations retrieved:", simulations.length);
      
      // Only seed if no simulations exist
      if (simulations.length === 0) {
        console.log("No simulations found, seeding SEO simulations...");
        await seoSimulationService.seedSimulations();
        // Get the simulations again after seeding
        const seededSimulations = await seoSimulationService.getSimulations();
        console.log("SEO simulations retrieved after seeding:", seededSimulations.length);
        return res.json(seededSimulations);
      }
      
      res.json(simulations);
    } catch (error) {
      console.error("Error retrieving SEO simulations:", error);
      res.status(500).json({ error: "Failed to retrieve SEO simulations" });
    }
  });

  app.get("/api/seo-simulations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid simulation ID format" });
      }
      
      console.log(`API request to get SEO simulation ID: ${id}`);
      const simulation = await seoSimulationService.getSimulation(id);
      
      if (!simulation) {
        return res.status(404).json({ error: "SEO simulation not found" });
      }
      
      res.json(simulation);
    } catch (error) {
      console.error(`Error retrieving SEO simulation ID ${req.params.id}:`, error);
      res.status(500).json({ 
        error: "Failed to retrieve SEO simulation", 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  app.post("/api/seo-simulations/:id/attempts", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const simulationId = parseInt(req.params.id);
      
      if (isNaN(simulationId)) {
        return res.status(400).json({ error: "Invalid simulation ID format" });
      }
      
      const { modifiedContent } = req.body;
      
      if (!modifiedContent) {
        return res.status(400).json({ error: "Modified content is required" });
      }
      
      console.log(`API request to submit SEO simulation attempt for simulation ID ${simulationId} by user ID ${req.user.id}`);
      
      try {
        const attempt = await seoSimulationService.submitAttempt({
          simulationId,
          userId: req.user.id,
          modifiedContent,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        res.json(attempt);
      } catch (serviceError) {
        console.error(`Error in SEO simulation service while submitting attempt:`, serviceError);
        return res.status(500).json({ 
          error: "Failed to process simulation attempt", 
          details: serviceError instanceof Error ? serviceError.message : String(serviceError) 
        });
      }
    } catch (error) {
      console.error('SEO simulation attempt submission error:', error);
      res.status(500).json({ 
        error: "Failed to submit SEO simulation attempt",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.get("/api/seo-simulations/:id/attempts", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const simulationId = parseInt(req.params.id);
      
      if (isNaN(simulationId)) {
        return res.status(400).json({ error: "Invalid simulation ID format" });
      }
      
      console.log(`API request to get SEO simulation attempts for simulation ID ${simulationId} by user ID ${req.user.id}`);
      
      try {
        const attempts = await seoSimulationService.getUserAttempts(req.user.id, simulationId);
        res.json(attempts);
      } catch (serviceError) {
        console.error(`Error retrieving SEO simulation attempts:`, serviceError);
        return res.status(500).json({ 
          error: "Failed to retrieve SEO simulation attempts from service", 
          details: serviceError instanceof Error ? serviceError.message : String(serviceError) 
        });
      }
    } catch (error) {
      console.error(`Error handling SEO simulation attempts request:`, error);
      res.status(500).json({ 
        error: "Failed to retrieve SEO simulation attempts", 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  app.get("/api/seo-simulations/:id/analytics", async (req, res) => {
    try {
      const simulationId = parseInt(req.params.id);
      const analytics = await seoSimulationService.getSimulationAnalytics(simulationId);
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve SEO simulation analytics" });
    }
  });

  // SEO Quiz Routes
  app.get("/api/quiz/progress", async (req, res) => {
    try {
      if (!req.user?.id) {
        // For demo purposes, return mock data for unauthenticated users
        return res.json({
          completedQuizzes: 1,
          totalQuizzes: 3,
          score: 85,
          badges: [
            { id: 1, name: "SEO Beginner", achieved: true },
            { id: 2, name: "SEO Intermediate", achieved: false },
            { id: 3, name: "SEO Expert", achieved: false }
          ]
        });
      }
      
      // In a real implementation, we would fetch this from the database
      // based on the user's actual quiz history and achievements
      // This would need to be implemented in the storage layer
      
      // For now, return mock data for demo purposes
      res.json({
        completedQuizzes: 1,
        totalQuizzes: 3,
        score: 85,
        badges: [
          { id: 1, name: "SEO Beginner", achieved: true },
          { id: 2, name: "SEO Intermediate", achieved: false },
          { id: 3, name: "SEO Expert", achieved: false }
        ]
      });
    } catch (error) {
      console.error('Failed to retrieve quiz progress:', error);
      res.status(500).json({ error: "Failed to retrieve quiz progress" });
    }
  });

  app.post("/api/quiz/complete", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { quizId, score, answers, maxScore } = req.body;
      
      if (!quizId || score === undefined || !maxScore) {
        return res.status(400).json({ error: "Quiz ID, score, and maxScore are required" });
      }
      
      // User ID is already validated at this point
      const userId = req.user.id;
      console.log(`API request to complete quiz ${quizId} for user ${userId} with score ${score}/${maxScore}`);
      
      // Calculate if the user passed based on a threshold (e.g., 70%)
      const passThreshold = 0.7;
      const passed = (score / maxScore) >= passThreshold;
      
      try {
        // 1. Save the user's quiz results to the database
        const quizResult = await storage.createQuizResult({
          userId,
          quizId,
          score,
          maxScore,
          passed,
          answers: answers || [],
          lastAttemptAt: new Date()
        });
        
        // 2. Get updated completion stats
        const quizCompletion = await storage.getQuizCompletion(userId);
        
        // 3. Return the updated progress
        res.json({ 
          success: true,
          message: "Quiz completed successfully",
          result: quizResult,
          completion: quizCompletion
        });
      } catch (storageError) {
        console.error('Database error when saving quiz result:', storageError);
        return res.status(500).json({ 
          error: "Failed to save quiz result to database", 
          details: storageError instanceof Error ? storageError.message : String(storageError) 
        });
      }
    } catch (error) {
      console.error('Failed to complete quiz:', error);
      res.status(500).json({ 
        error: "Failed to complete quiz", 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // API Provider Settings Routes
  app.post("/api/user/api-settings", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { provider, apiKey } = req.body;
      
      if (!provider || !apiKey) {
        return res.status(400).json({ error: "Provider and API key are required" });
      }
      
      if (!['anthropic', 'openai', 'gemini'].includes(provider)) {
        return res.status(400).json({ error: "Invalid provider. Must be 'anthropic', 'openai', or 'gemini'" });
      }
      
      // Get user profile to retrieve username
      const userProfile = await storage.getUserProfile(req.user.id);
      
      if (!userProfile) {
        return res.status(404).json({ error: "User profile not found" });
      }
      
      // Check if user already has API settings
      const existingSettings = await storage.getUserApiSettings(userProfile.username);
      
      if (existingSettings) {
        // Update existing settings
        const updatedSettings = await storage.updateUserApiSettings(
          userProfile.username,
          provider,
          apiKey
        );
        
        return res.json({
          provider: updatedSettings.activeProvider,
          success: true
        });
      } else {
        // Create new settings
        const newSettings = await storage.createUserApiSettings({
          username: userProfile.username,
          activeProvider: provider,
          anthropicApiKey: provider === 'anthropic' ? apiKey : null,
          openaiApiKey: provider === 'openai' ? apiKey : null,
          geminiApiKey: provider === 'gemini' ? apiKey : null,
        });
        
        return res.json({
          provider: newSettings.activeProvider,
          success: true
        });
      }
    } catch (error) {
      console.error("Error saving API settings:", error);
      res.status(500).json({ error: "Failed to save API settings" });
    }
  });
  
  app.get("/api/user/api-settings", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      // Get user profile to retrieve username
      const userProfile = await storage.getUserProfile(req.user.id);
      
      if (!userProfile) {
        return res.status(404).json({ error: "User profile not found" });
      }
      
      // Get user API settings
      const apiSettings = await storage.getUserApiSettings(userProfile.username);
      
      if (!apiSettings) {
        return res.json({
          hasSettings: false,
          providers: []
        });
      }
      
      // Return available providers (don't return actual API keys)
      const providers = [];
      
      if (apiSettings.anthropicApiKey) providers.push('anthropic');
      if (apiSettings.openaiApiKey) providers.push('openai');
      if (apiSettings.geminiApiKey) providers.push('gemini');
      
      res.json({
        hasSettings: providers.length > 0,
        activeProvider: apiSettings.activeProvider,
        providers
      });
    } catch (error) {
      console.error("Error retrieving API settings:", error);
      res.status(500).json({ error: "Failed to retrieve API settings" });
    }
  });
  
  // Test AI provider
  app.post("/api/ai/test-provider", async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { provider, apiKey } = req.body;
      
      if (!provider) {
        return res.status(400).json({ error: "Provider is required" });
      }
      
      // Create a temporary instance to test the API key
      const { MarketingAI, SubscriptionTier } = require('./services/marketingAI');
      const tempAI = new MarketingAI(
        SubscriptionTier.FREE,
        provider === 'anthropic' ? apiKey : null,
        provider === 'openai' ? apiKey : null, 
        provider === 'gemini' ? apiKey : null
      );
      
      // Test the provider with a simple prompt
      const testResult = await tempAI.testProvider(provider);
      
      res.json({
        success: true,
        provider,
        working: testResult.working,
        message: testResult.message
      });
    } catch (error) {
      console.error("Error testing AI provider:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ 
        success: false,
        error: message,
        working: false
      });
    }
  });

  // Mount Stripe routes
  app.use('/api/stripe', stripeRoutes);
  console.log('API Settings routes registered');
  console.log('Stripe routes registered');

  // Register Ad Simulation routes
  registerAdSimulationRoutes(app);
  console.log('Ad Simulation routes registered');

  // Register Data Visualization routes
  registerDataVisualizationRoutes(app);
  console.log('Data Visualization routes registered');

  return httpServer;
}