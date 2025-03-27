import { Express, Request, Response } from "express";
import { storage } from "../storage";
import { insertDataVisualizationAttemptSchema } from "../../shared/schema";
import { dataVisualizationService } from "../services/dataVisualizationService";

/**
 * Get all data visualization challenges
 */
const getChallenges = async (req: Request, res: Response) => {
  try {
    // Get all challenges
    const challenges = await storage.listDataVisualizationChallenges();
    console.log(`Retrieved ${challenges.length} data visualization challenges`);
    
    // Only seed if no challenges exist (this should rarely happen)
    if (challenges.length === 0) {
      console.log("No challenges found, seeding data visualization challenges...");
      await dataVisualizationService.seedChallenges();
      // Get the challenges again after seeding
      const seededChallenges = await storage.listDataVisualizationChallenges();
      console.log(`Retrieved ${seededChallenges.length} data visualization challenges after seeding`);
      return res.json(seededChallenges);
    }
    
    res.json(challenges);
  } catch (error) {
    console.error("Error retrieving data visualization challenges:", error);
    res.status(500).json({ error: "Failed to retrieve data visualization challenges" });
  }
};

/**
 * Get a specific data visualization challenge by ID
 */
const getChallengeById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid challenge ID format" });
    }
    
    const challenge = await storage.getDataVisualizationChallenge(id);
    
    if (!challenge) {
      return res.status(404).json({ error: "Data visualization challenge not found" });
    }
    
    res.json(challenge);
  } catch (error) {
    console.error(`Error retrieving data visualization challenge ID ${req.params.id}:`, error);
    res.status(500).json({ 
      error: "Failed to retrieve data visualization challenge", 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
};

/**
 * Get the dataset for a specific challenge
 */
const getDataset = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid challenge ID format" });
    }
    
    const challenge = await storage.getDataVisualizationChallenge(id);
    
    if (!challenge) {
      return res.status(404).json({ error: "Data visualization challenge not found" });
    }
    
    // Return the dataset from the challenge
    if (challenge.dataset) {
      return res.json(challenge.dataset);
    }
    
    res.status(404).json({ error: "Dataset not found for this challenge" });
  } catch (error) {
    console.error(`Error retrieving dataset for challenge ID ${req.params.id}:`, error);
    res.status(500).json({ 
      error: "Failed to retrieve dataset", 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
};

/**
 * Submit an attempt for a data visualization challenge
 */
const submitChallengeAttempt = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const challengeId = parseInt(req.params.id);
    
    if (isNaN(challengeId)) {
      return res.status(400).json({ error: "Invalid challenge ID format" });
    }
    
    const challenge = await storage.getDataVisualizationChallenge(challengeId);
    
    if (!challenge) {
      return res.status(404).json({ error: "Data visualization challenge not found" });
    }
    
    // Parse and validate the submission
    const { chartType, chartOptions, chartData } = req.body;
    
    if (!chartType || !chartOptions || !chartData) {
      return res.status(400).json({ error: "Missing required fields in submission" });
    }
    
    // Process the attempt
    const userId = req.user.id;
    
    // Evaluate the submission
    const score = evaluateVisualizationAttempt(challenge, {
      chartType,
      chartOptions,
      chartData
    });
    
    // Save the attempt
    const attempt = {
      userId,
      challengeId,
      chartType,
      chartOptions,
      chartData,
      score,
      feedback: generateFeedbackForScore(score, challenge),
      submittedAt: new Date()
    };
    
    // Insert the attempt using the schema validation
    const validatedAttempt = insertDataVisualizationAttemptSchema.parse(attempt);
    const savedAttempt = await storage.createDataVisualizationAttempt(validatedAttempt);
    
    res.json({
      success: true,
      attempt: savedAttempt,
      score,
      feedback: savedAttempt.feedback
    });
  } catch (error) {
    console.error(`Error submitting data visualization attempt:`, error);
    res.status(500).json({ 
      error: "Failed to submit data visualization attempt", 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
};

/**
 * Get all attempts for a specific challenge by a user
 */
const getUserAttempts = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const challengeId = parseInt(req.params.id);
    
    if (isNaN(challengeId)) {
      return res.status(400).json({ error: "Invalid challenge ID format" });
    }
    
    const userId = req.user.id;
    
    const attempts = await storage.getDataVisualizationAttempts(userId, challengeId);
    res.json(attempts);
  } catch (error) {
    console.error(`Error retrieving user's data visualization attempts:`, error);
    res.status(500).json({ 
      error: "Failed to retrieve user's data visualization attempts", 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
};

/**
 * Evaluate the submission based on challenge criteria and user's chart configuration
 */
function evaluateVisualizationAttempt(
  challenge: any, 
  submission: {
    chartType: string;
    chartOptions: any;
    chartData: any;
  }
): number {
  // This is a simplified scoring algorithm
  // In a real-world scenario, this would be more complex and detailed
  
  let score = 0;
  const maxScore = 100;
  
  // 1. Check if chart type matches recommended type
  if (submission.chartType === challenge.recommendedChartType) {
    score += 20;
  } else if (submission.chartType && isAppropriateChartType(submission.chartType, challenge)) {
    // Partial points for using an appropriate but not optimal chart type
    score += 10;
  }
  
  // 2. Check chart options for proper configuration
  if (submission.chartOptions) {
    // Check if axes are properly labeled
    if (hasProperAxesLabels(submission.chartOptions, challenge)) {
      score += 15;
    }
    
    // Check if appropriate color scheme is used
    if (hasAppropriateColorScheme(submission.chartOptions)) {
      score += 10;
    }
    
    // Check if chart is properly titled
    if (hasProperTitle(submission.chartOptions)) {
      score += 10;
    }
    
    // Check if legend is properly configured where needed
    if (needsLegend(submission.chartType) && hasProperLegend(submission.chartOptions)) {
      score += 10;
    }
  }
  
  // 3. Check if data is properly transformed/prepared
  if (submission.chartData && isDataProperlyPrepared(submission.chartData, challenge)) {
    score += 20;
  }
  
  // 4. Check for advanced features (tooltips, interactivity)
  if (hasAdvancedFeatures(submission.chartOptions)) {
    score += 15;
  }
  
  // Ensure score doesn't exceed maximum
  return Math.min(score, maxScore);
}

/**
 * Generate feedback based on score and challenge
 */
function generateFeedbackForScore(score: number, challenge: any): string {
  if (score >= 90) {
    return "Excellent visualization! Your chart effectively communicates the data insights and follows best practices.";
  } else if (score >= 70) {
    return "Good job! Your visualization is effective, but there's room for improvement in optimizing the chart configuration.";
  } else if (score >= 50) {
    return "Acceptable visualization. Consider using more appropriate chart types or better configuring your axes and labels.";
  } else {
    return "Your visualization needs improvement. Review data visualization best practices and try a different approach.";
  }
}

// Helper functions for evaluation
function isAppropriateChartType(chartType: string, challenge: any): boolean {
  // In a real implementation, this would check if the chart type is appropriate for the data
  // For now, we'll return true as a placeholder
  return true;
}

function hasProperAxesLabels(chartOptions: any, challenge: any): boolean {
  // Check if x and y axes have labels that make sense for the data
  return (chartOptions.xAxis?.name || chartOptions.xLabel) && 
         (chartOptions.yAxis?.name || chartOptions.yLabel);
}

function hasAppropriateColorScheme(chartOptions: any): boolean {
  // Check if colors are appropriate (not using too many, consistent theme, etc.)
  return chartOptions.colors || chartOptions.colorScheme || chartOptions.theme;
}

function hasProperTitle(chartOptions: any): boolean {
  // Check if chart has a meaningful title
  return !!chartOptions.title;
}

function needsLegend(chartType: string): boolean {
  // Determine if this chart type typically needs a legend
  return ['pie', 'donut', 'line', 'area', 'bar'].includes(chartType.toLowerCase());
}

function hasProperLegend(chartOptions: any): boolean {
  // Check if legend is properly configured
  return chartOptions.legend && (
    chartOptions.legend.show !== false || 
    chartOptions.legend.display !== false
  );
}

function isDataProperlyPrepared(chartData: any, challenge: any): boolean {
  // Check if data is properly prepared for visualization
  // This would validate the data structure matches what's needed for the chart type
  return Array.isArray(chartData) && chartData.length > 0;
}

function hasAdvancedFeatures(chartOptions: any): boolean {
  // Check for advanced features like tooltips, responsiveness, etc.
  return (
    chartOptions.tooltip || 
    chartOptions.responsive === true || 
    chartOptions.interaction || 
    chartOptions.animations
  );
}

export const registerDataVisualizationRoutes = (app: Express) => {
  // Get all data visualization challenges
  app.get('/api/data-visualization', getChallenges);
  
  // Get a specific data visualization challenge
  app.get('/api/data-visualization/:id', getChallengeById);
  
  // Get dataset for a specific challenge
  app.get('/api/data-visualization/:id/dataset', getDataset);
  
  // Submit an attempt for a challenge
  app.post('/api/data-visualization/:id/attempts', submitChallengeAttempt);
  
  // Get all attempts by logged-in user for a specific challenge
  app.get('/api/data-visualization/:id/attempts', getUserAttempts);
};