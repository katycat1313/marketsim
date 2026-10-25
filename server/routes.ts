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
import abTestRoutes from "./routes/abTestRoutes";
import clientAgencyRoutes from "./routes/clientAgencyRoutes";
import { authService } from "./services/authService";
import { registerAICapabilitiesRoutes } from "./services/aiCapabilities";
import { registerMicroFeedbackRoutes } from "./routes/microFeedbackRoutes";
import { dynamicSimulationGenerator } from "./services/dynamicSimulationGenerator";
import { registerCustomBusinessRoutes } from "./routes/customBusinessRoutes";
import { registerWaitlistRoutes } from "./routes/waitlistRoutes";
import { registerDeepgramRoutes } from "./routes/deepgramRoutes";
import { registerGeminiLiveRoutes } from "./routes/geminiLiveRoutes";
import { VIP_CREATORS, getVipCreatorByToken } from "./services/vipCreators";

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
  
  
  // One-Click VIP Pass Login for Creators & Reviewers
  app.get("/api/auth/vip/:token", async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const creator = getVipCreatorByToken(token);
      
      if (!creator) {
        return res.status(404).json({ message: "VIP Pass not found or expired." });
      }

      const vipUser = {
        id: 1000 + VIP_CREATORS.indexOf(creator),
        username: `${creator.token}_vip`,
        email: creator.email,
        firstName: creator.firstName,
        lastName: creator.lastName,
        level: "VIP Reviewer",
        role: "vip_reviewer",
        tier: "premium",
        isVip: true,
        isDeveloper: false,
        xp: 5000,
        specializations: [creator.specialty, "Agency Casework", "Interview Strategy"],
        achievements: ["VIP Reviewer", "Verified Industry Mentor"],
        createdAt: new Date(),
      };

      res.json({
        user: vipUser,
        targetLanding: creator.targetLanding,
        name: creator.name,
        organization: creator.organization
      });
    } catch (error) {
      console.error("VIP token error:", error);
      res.status(500).json({ message: "Failed to authenticate VIP Pass" });
    }
  });

  // VIP Password Set (allows creator to set custom password after 1-click entry)
  app.post("/api/auth/vip-password", async (req: Request, res: Response) => {
    try {
      const { email, newPassword } = req.body;
      if (!email || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: "Valid email and new password (min 6 chars) required" });
      }
      
      const creator = VIP_CREATORS.find(c => c.email.toLowerCase() === email.toLowerCase());
      const firstName = creator ? creator.firstName : "VIP";
      const lastName = creator ? creator.lastName : "Member";
      
      const updatedUser = await authService.registerUser(email, newPassword, firstName, lastName, "expert");
      res.json({ message: "Password updated successfully", user: updatedUser });
    } catch (error) {
      console.error("VIP password update error:", error);
      res.status(500).json({ message: "Failed to set password" });
    }
  });

  // List all VIP Creators (for developer and admin reference)
  app.get("/api/auth/vip-creators-list", (req: Request, res: Response) => {
    res.json(VIP_CREATORS);
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

  const seedCommunityPosts = [
    {
      id: 101,
      userId: 1,
      authorName: "Director Atlas (Lead Performance Director)",
      title: "Week 1 Debrief: The #1 Title Tag Mistake Everyone Makes on Jenny's Coffee",
      content: "Welcome to the Growth Lab cohort! Auditing early student runs on Jenny's Artisan Java: 40% of you are putting the brand name first ('Jenny's Artisan Java | Fresh Coffee') instead of the high-intent commercial keyword ('Organic Coffee Beans Morgantown | Jenny's Artisan Java'). Google ranks left-to-right keyword weight. Test this change in your simulator and watch your GA4 organic clicks surge.",
      type: "Tactical Debrief",
      tags: ["SEO", "Week 1", "Search Intent", "Jenny's Java"],
      likes: 24,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 102,
      userId: 2,
      authorName: "Sarah Jenkins (Senior Growth Director)",
      title: "How to Handle the Emergency Client Dispatch Call Without Giving Away Free Work",
      content: "When Jenny calls in a panic about counter coffee prices, the rookie move is to apologize and offer a 20% discount. That destroys client margin. Look at Option 2 in the modal: anchor your response in commercial foot traffic data from the local campaign. Let me know what reputation score you landed after the call!",
      type: "Client Escalations",
      tags: ["Client Retention", "Emergency Dispatch", "Pricing Strategy"],
      likes: 19,
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
    },
    {
      id: 103,
      userId: 3,
      authorName: "Marcus Vance (Beta Student)",
      title: "Finally got 100% on Dr. Miller Dental PPC match types!",
      content: "Took me three tries to realize that Broad Match 'dentist' was pulling in queries for 'dental hygienist salary' and eating $45 a click. Adding -salary and -jobs as negative keywords immediately cut wasted ad spend by 45%. If anyone is stuck on Ad Group 2, check your exact match phrase brackets.",
      type: "Student Win",
      tags: ["Google Ads", "Negative Keywords", "Quality Score", "Dr. Miller"],
      likes: 31,
      createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
    }
  ];

  app.get("/api/posts", async (req, res) => {
    try {
      let posts = await storage.listPosts();
      if (!posts || posts.length === 0) {
        posts = seedCommunityPosts as any;
      }
      res.json(posts);
    } catch (error) {
      res.json(seedCommunityPosts);
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
      res.json(achievements || []);
    } catch (error) {
      res.json([]);
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
      res.status(404).json({ error: "Failed to retrieve achievement" });
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
      res.json(connections || []);
    } catch (error) {
      res.json([]);
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
      // In local dev/beta testing, default to premium access so all tutorials and simulations can be tested
      let hasPremiumAccess = !process.env.DATABASE_URL || process.env.NODE_ENV !== 'production';
      
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
            hasPremiumAccess = hasPremiumAccess || ['premium', 'enterprise'].includes(userWithSubscription.subscription.tier);
            console.log(`User has ${userWithSubscription.subscription.tier} subscription, premium access: ${hasPremiumAccess}`);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
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
        // For non-premium users, provide structured lock notice with high readability
        processedTutorials = tutorials.map(tutorial => {
          if (tutorial.isPremium) {
            return {
              ...tutorial,
              content: `## 🔒 Pro Track Specialization (Upgrade Required)

This module is part of the **Pro & Agency Track ($199/mo)**.

### What You Unlock in This Module:
* Advanced multi-channel automation architectures.
* Client-ready enterprise SOPs, contract templates, and pitch decks.
* Direct executive audit simulation with lead agency director evaluation.

> [!TIP]
> Are you testing the platform during our Early Beta? Use promo code **BETA7** at checkout to unlock full 7-day Pro access for free!`,
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

  app.post("/api/seo-simulations/generate", async (req, res) => {
    try {
      const { industry, difficulty, niche } = req.body;
      
      const dynamicScenario = await dynamicSimulationGenerator.generateSimulation({
        level: difficulty || "Intermediate",
        platform: "seo_serp",
        targetWeakness: "onPageOptimization"
      });

      const simData = {
        title: dynamicScenario.title || `${niche || industry || 'Custom Business'} - AI Dynamic SEO Simulation`,
        description: dynamicScenario.scenarioDescription || "Optimize on-page architecture and local search authority.",
        difficulty: difficulty || "Intermediate",
        industry: dynamicScenario.industry || industry || "E-Commerce",
        originalContent: {
          title: `Welcome to ${dynamicScenario.clientName || 'Our Business'} | Quality Services`,
          metaDescription: `We offer top-rated services. Contact us today to learn more.`,
          headings: [
            { tag: "h1", content: `Welcome to ${dynamicScenario.clientName || 'Our Business'}` },
            { tag: "h2", content: "Our Products & Services" },
            { tag: "h2", content: "About Us" },
            { tag: "h2", content: "Contact Us" }
          ],
          body: `Welcome to ${dynamicScenario.clientName || 'our business'}. We provide premium services for clients in our local market. Contact us today to get started.`,
          images: [
            { src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&auto=format&fit=crop&q=80", alt: "Business office" },
            { src: "https://images.unsplash.com/photo-1556742049-0a67e55722c3?w=500&auto=format&fit=crop&q=80", alt: "Team meeting" }
          ],
          links: [
            { href: "/services", text: "Services", isInternal: true },
            { href: "/contact", text: "Contact", isInternal: true }
          ]
        },
        clientDossier: {
          clientName: dynamicScenario.clientName || "Dynamic Client Partner",
          founderName: "Alex Morgan (Managing Director)",
          businessModel: `Direct-to-Consumer & Local ${dynamicScenario.industry || 'Specialty Brand'}`,
          location: "Austin, TX (Est. 2020)",
          products: `Custom ${dynamicScenario.industry || 'Specialty'} offerings & dedicated service packages.`,
          valueProps: [
            "Industry certified and sustainably sourced",
            "Rapid fulfillment & dedicated customer support",
            "Over 250+ 5-star verified customer reviews"
          ],
          fieldNotes: `“I met with the founder on-site to inspect their operations. They have built an outstanding physical operation with glowing local reviews, but their website is an unoptimized generic stub with missing target keywords, non-descriptive H1 headings, and zero local schema structured data. Search crawlers are bypassing them completely.”`,
          customerFeedback: [
            "“Your services are fantastic, but your website was impossible to find on Google.” — Local Client",
            "“Where are the service descriptions and pricing options?” — Verified Customer"
          ]
        },
        targetKeywords: dynamicScenario.targetKeywords || [
          `${(dynamicScenario.industry || 'specialty').toLowerCase()} services`,
          `best ${dynamicScenario.industry || 'local'} company`,
          `custom ${dynamicScenario.industry || 'service'} packages`,
          `affordable ${dynamicScenario.industry || 'specialty'} store`
        ],
        seoIssues: [
          {
            type: "title",
            description: "Title is generic and does not include primary target keywords",
            severity: "high",
            location: "title"
          },
          {
            type: "meta",
            description: "Meta description is too short and uninformative",
            severity: "high",
            location: "metaDescription"
          },
          {
            type: "headings",
            description: "Headings lack search keywords and clear hierarchy",
            severity: "medium",
            location: "headings"
          },
          {
            type: "content",
            description: "Thin content lacking specific product and service depth",
            severity: "high",
            location: "body"
          },
          {
            type: "images",
            description: "Image alt tags are generic or missing target keywords",
            severity: "medium",
            location: "images"
          }
        ],
        bestPractices: [
          {
            category: "title",
            description: "Include primary search keywords at the start of the title tag (50-60 chars).",
            example: "Formula: [Primary Keyword] | [Secondary USP / Location] (50-60 chars)"
          },
          {
            category: "meta",
            description: "Write an action-driven 120-155 character description with a clear call to action.",
            example: "Formula: [Shop/Discover] [Core Offering] + [Key Benefit] + [Call to Action]!"
          },
          {
            category: "headings",
            description: "Use one H1 for main offering and H2s for specific categories.",
            example: "Hierarchy: H1 = Core Keyword Offering | H2 = Features | H2 = Ordering"
          }
        ]
      };

      const savedSim = seoSimulationService.addDynamicSimulation(simData);
      res.status(201).json(savedSim);
    } catch (error: any) {
      console.error("Error generating dynamic SEO simulation:", error);
      res.status(500).json({ error: "Failed to generate dynamic SEO simulation", details: error.message });
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
      const userId = (req.user as any)?.id || 1;
      
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
          userId,
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
      const userId = (req.user as any)?.id || 1;
      
      const simulationId = parseInt(req.params.id);
      
      if (isNaN(simulationId)) {
        return res.status(400).json({ error: "Invalid simulation ID format" });
      }
      
      console.log(`API request to get SEO simulation attempts for simulation ID ${simulationId} by user ID ${req.user.id}`);
      
      try {
        const attempts = await seoSimulationService.getUserAttempts(userId, simulationId);
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

  app.get("/api/user/seo-simulations/attempts", async (req, res) => {
    try {
      const userId = (req.user as any)?.id || 1;
      const attempts = await seoSimulationService.getAllUserAttempts(userId);
      res.json(attempts);
    } catch (error) {
      console.error("Error retrieving user SEO simulation attempts:", error);
      res.json([]);
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

  // Register A/B Test routes
  app.use('/api/ab-tests', abTestRoutes);
  console.log('A/B Test routes registered');

  // Register Connected Client Agency Retainer routes
  app.use('/api/client', clientAgencyRoutes);
  console.log('Client Agency Retainer routes registered');

  // Register AI Capabilities routes
  registerAICapabilitiesRoutes(app);
  console.log('AI Capabilities routes registered');

  // Register Micro-Feedback routes
  registerMicroFeedbackRoutes(app);
  console.log('Micro-Feedback routes registered');

  // Register Custom Business Digital Twin routes
  registerCustomBusinessRoutes(app);
  console.log('Custom Business Digital Twin routes registered');

  // Register Early-Bird Pre-Order Waitlist routes
  registerWaitlistRoutes(app);
  console.log('Early-Bird Pre-Order Waitlist routes registered');

  // Register Deepgram Voice Agent & Aura TTS routes
  registerDeepgramRoutes(app);

  // Register Gemini Live Bidirectional WebSocket API routes
  registerGeminiLiveRoutes(app);
  console.log('Gemini Live routes registered');

  return httpServer;
}
