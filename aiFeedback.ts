// aiFeedback.ts
import { Campaign } from "@shared/schema";

import { MarketingAI } from './server/services/marketingAI';
import { Campaign, UserProfile } from '@shared/schema';

interface FeedbackResponse {
  analysis: string;
  suggestions: string[];
  skillProgress: {
    currentLevel: string;
    strengthAreas: string[];
    improvementAreas: string[];
    nextMilestone: string;
  };
  collaborationSuggestions: string[];
}

async function getAIFeedback(campaign: Campaign, userProfile: UserProfile): Promise<FeedbackResponse> {
  const marketingAI = new MarketingAI();
  
  const analysis = await marketingAI.evaluateUserSkills(
    userProfile.id,
    [campaign],
    userProfile.collaborations,
    userProfile.discussions
  );

  return {
    analysis: analysis.evaluation,
    suggestions: analysis.recommendations,
    skillProgress: {
      currentLevel: analysis.currentLevel,
      strengthAreas: analysis.strengths,
      improvementAreas: analysis.areasForImprovement,
      nextMilestone: analysis.nextLevelRequirements
    },
    collaborationSuggestions: analysis.peerLearningOpportunities
  };
}

export { getAIFeedback, FeedbackResponse };