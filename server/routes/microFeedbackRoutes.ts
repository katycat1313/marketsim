import { Express, Request, Response } from 'express';
import { storage } from '../storage';
import { insertMicroFeedbackSchema } from '../../shared/schema';
import { z } from 'zod';

// Submit micro-feedback
const submitMicroFeedback = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    // Validate the feedback data
    const validatedData = insertMicroFeedbackSchema.parse(req.body);
    
    const feedback = await storage.createMicroFeedback(validatedData);
    res.status(201).json(feedback);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid feedback data", details: error.errors });
    } else {
      console.error("Error submitting micro-feedback:", error);
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  }
};

// Get feedback by content ID and type
const getFeedbackByContent = async (req: Request, res: Response) => {
  try {
    const contentType = req.params.contentType;
    const contentId = parseInt(req.params.contentId);
    
    if (isNaN(contentId)) {
      return res.status(400).json({ error: "Content ID must be a number" });
    }
    
    const feedback = await storage.getMicroFeedbackByContentId(contentType, contentId);
    res.json(feedback);
  } catch (error) {
    console.error("Error retrieving micro-feedback:", error);
    res.status(500).json({ error: "Failed to retrieve feedback" });
  }
};

// Get feedback by user ID
const getFeedbackByUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: "User ID must be a number" });
    }
    
    const feedback = await storage.getMicroFeedbackByUserId(userId);
    res.json(feedback);
  } catch (error) {
    console.error("Error retrieving micro-feedback:", error);
    res.status(500).json({ error: "Failed to retrieve feedback" });
  }
};

// Get feedback stats by content type (optional content ID)
const getFeedbackStats = async (req: Request, res: Response) => {
  try {
    const { contentType } = req.params;
    const contentId = req.query.contentId ? parseInt(req.query.contentId as string) : undefined;
    
    if (contentId !== undefined && isNaN(contentId)) {
      return res.status(400).json({ error: "Content ID must be a number if provided" });
    }
    
    const stats = await storage.getMicroFeedbackStats(contentType, contentId);
    res.json(stats);
  } catch (error) {
    console.error("Error retrieving micro-feedback stats:", error);
    res.status(500).json({ error: "Failed to retrieve feedback stats" });
  }
};

export const registerMicroFeedbackRoutes = (app: Express) => {
  app.post("/api/micro-feedback", submitMicroFeedback);
  app.get("/api/micro-feedback/content/:contentType/:contentId", getFeedbackByContent);
  app.get("/api/micro-feedback/user/:userId", getFeedbackByUser);
  app.get("/api/micro-feedback/stats/:contentType", getFeedbackStats);
};