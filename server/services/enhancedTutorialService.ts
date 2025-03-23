import { db } from '../db';
import { 
  tutorialModules, 
  tutorialSections,
  userTutorialProgress,
  userQuizResults,
  userSimulationResults,
  userExperienceLog,
  userProfiles,
  levelRequirements,
  TutorialModule,
  TutorialSection,
  UserTutorialProgress,
  UserQuizResult,
  UserSimulationResult
} from '@shared/schema';
import { eq, and, inArray } from 'drizzle-orm';

export interface ModuleWithSections extends TutorialModule {
  sections: TutorialSection[];
}

export class EnhancedTutorialService {
  /**
   * Get all available tutorial modules for a user based on their level
   */
  async getTutorialModules(userId: number): Promise<ModuleWithSections[]> {
    try {
      // Get user's current level
      const userProfile = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, userId)
      });
      
      if (!userProfile) {
        throw new Error(`User profile not found for user ID: ${userId}`);
      }
      
      // Get all modules available for user's level
      const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
      const userLevelIndex = levels.indexOf(userProfile.level);
      
      if (userLevelIndex === -1) {
        throw new Error(`Invalid user level: ${userProfile.level}`);
      }
      
      const availableLevels = levels.slice(0, userLevelIndex + 1);
      
      // Get modules and their sections
      const modules = await db.query.tutorialModules.findMany({
        where: inArray(tutorialModules.level, availableLevels),
        orderBy: tutorialModules.moduleNumber
      });
      
      // For each module, get its sections
      const modulesWithSections: ModuleWithSections[] = [];
      
      for (const module of modules) {
        const sections = await db.query.tutorialSections.findMany({
          where: eq(tutorialSections.moduleId, module.id),
          orderBy: tutorialSections.sectionNumber
        });
        
        modulesWithSections.push({
          ...module,
          sections
        });
      }
      
      return modulesWithSections;
    } catch (error) {
      console.error('Error getting tutorial modules:', error);
      throw error;
    }
  }
  
  /**
   * Get detailed progress for a specific module
   */
  async getModuleProgress(userId: number, moduleId: number): Promise<UserTutorialProgress | null> {
    try {
      const progress = await db.query.userTutorialProgress.findFirst({
        where: and(
          eq(userTutorialProgress.userId, userId),
          eq(userTutorialProgress.moduleId, moduleId)
        )
      });
      
      return progress;
    } catch (error) {
      console.error('Error getting module progress:', error);
      throw error;
    }
  }
  
  /**
   * Start a tutorial module for a user
   */
  async startModule(userId: number, moduleId: number): Promise<UserTutorialProgress> {
    try {
      // Check if module exists
      const module = await db.query.tutorialModules.findFirst({
        where: eq(tutorialModules.id, moduleId)
      });
      
      if (!module) {
        throw new Error(`Module not found with ID: ${moduleId}`);
      }
      
      // Check if user has already started this module
      const existingProgress = await this.getModuleProgress(userId, moduleId);
      
      if (existingProgress) {
        // If already started but not completed, just return the existing progress
        if (!existingProgress.completed) {
          return existingProgress;
        }
        
        // If already completed, throw an error
        throw new Error(`Module ${moduleId} is already completed by user ${userId}`);
      }
      
      // If module has prerequisites, check if they are completed
      if (module.prerequisiteModuleIds && module.prerequisiteModuleIds.length > 0) {
        const prerequisites = module.prerequisiteModuleIds;
        
        // Get all progress records for prerequisites
        const prerequisiteProgress = await db.query.userTutorialProgress.findMany({
          where: and(
            eq(userTutorialProgress.userId, userId),
            inArray(userTutorialProgress.moduleId, prerequisites)
          )
        });
        
        // Check if all prerequisites are completed
        const allCompleted = prerequisites.every(prerequisiteId => 
          prerequisiteProgress.some(progress => 
            progress.moduleId === prerequisiteId && progress.completed
          )
        );
        
        if (!allCompleted) {
          throw new Error(`Prerequisites not completed for module ${moduleId}`);
        }
      }
      
      // Create new progress record
      const newProgress = await db.insert(userTutorialProgress).values({
        userId,
        moduleId,
        started: true,
        startedAt: new Date(),
        completedSections: [],
        earnedXp: 0,
        timeSpentMinutes: 0
      }).returning();
      
      return newProgress[0];
    } catch (error) {
      console.error('Error starting module:', error);
      throw error;
    }
  }
  
  /**
   * Complete a section of a tutorial module
   */
  async completeSection(userId: number, moduleId: number, sectionId: number, timeSpentMinutes: number): Promise<UserTutorialProgress> {
    try {
      // Check if section exists and belongs to the module
      const section = await db.query.tutorialSections.findFirst({
        where: and(
          eq(tutorialSections.id, sectionId),
          eq(tutorialSections.moduleId, moduleId)
        )
      });
      
      if (!section) {
        throw new Error(`Section ${sectionId} not found in module ${moduleId}`);
      }
      
      // Get module progress
      const moduleProgress = await this.getModuleProgress(userId, moduleId);
      
      if (!moduleProgress) {
        throw new Error(`User ${userId} has not started module ${moduleId}`);
      }
      
      if (moduleProgress.completed) {
        throw new Error(`Module ${moduleId} is already completed by user ${userId}`);
      }
      
      // Update completed sections
      const completedSections = moduleProgress.completedSections || [];
      
      if (!completedSections.includes(sectionId)) {
        completedSections.push(sectionId);
        
        // Award XP for completing the section
        await this.awardExperiencePoints(userId, section.xpReward, 'tutorial', sectionId, `Completed section "${section.title}"`);
        
        // Update module progress
        const updatedProgress = await db.update(userTutorialProgress)
          .set({
            completedSections,
            earnedXp: moduleProgress.earnedXp + section.xpReward,
            timeSpentMinutes: moduleProgress.timeSpentMinutes + timeSpentMinutes
          })
          .where(and(
            eq(userTutorialProgress.userId, userId),
            eq(userTutorialProgress.moduleId, moduleId)
          ))
          .returning();
        
        return updatedProgress[0];
      }
      
      return moduleProgress;
    } catch (error) {
      console.error('Error completing section:', error);
      throw error;
    }
  }
  
  /**
   * Complete a tutorial module
   */
  async completeModule(userId: number, moduleId: number): Promise<UserTutorialProgress> {
    try {
      // Check if module exists
      const module = await db.query.tutorialModules.findFirst({
        where: eq(tutorialModules.id, moduleId)
      });
      
      if (!module) {
        throw new Error(`Module not found with ID: ${moduleId}`);
      }
      
      // Get all sections for the module
      const sections = await db.query.tutorialSections.findMany({
        where: eq(tutorialSections.moduleId, moduleId)
      });
      
      // Get module progress
      const moduleProgress = await this.getModuleProgress(userId, moduleId);
      
      if (!moduleProgress) {
        throw new Error(`User ${userId} has not started module ${moduleId}`);
      }
      
      if (moduleProgress.completed) {
        return moduleProgress; // Already completed
      }
      
      // Check if all sections are completed
      const allSectionsCompleted = sections.every(section => 
        moduleProgress.completedSections.includes(section.id)
      );
      
      if (!allSectionsCompleted) {
        throw new Error(`Not all sections of module ${moduleId} are completed by user ${userId}`);
      }
      
      // Award module completion XP
      await this.awardExperiencePoints(userId, module.xpReward, 'tutorial-module', moduleId, `Completed module "${module.title}"`);
      
      // Update module progress to mark as completed
      const updatedProgress = await db.update(userTutorialProgress)
        .set({
          completed: true,
          completedAt: new Date(),
          earnedXp: moduleProgress.earnedXp + module.xpReward
        })
        .where(and(
          eq(userTutorialProgress.userId, userId),
          eq(userTutorialProgress.moduleId, moduleId)
        ))
        .returning();
      
      // Check for level up
      await this.checkForLevelUp(userId);
      
      return updatedProgress[0];
    } catch (error) {
      console.error('Error completing module:', error);
      throw error;
    }
  }
  
  /**
   * Submit a quiz result for a section
   */
  async submitQuizResult(
    userId: number, 
    sectionId: number, 
    answers: {questionId: number, answer: string, correct: boolean}[],
    score: number,
    maxScore: number
  ): Promise<UserQuizResult> {
    try {
      // Check if section exists and has a quiz
      const section = await db.query.tutorialSections.findFirst({
        where: and(
          eq(tutorialSections.id, sectionId),
          eq(tutorialSections.hasQuiz, true)
        )
      });
      
      if (!section) {
        throw new Error(`Section ${sectionId} not found or does not have a quiz`);
      }
      
      // Check if user has already attempted this quiz
      const existingResult = await db.query.userQuizResults.findFirst({
        where: and(
          eq(userQuizResults.userId, userId),
          eq(userQuizResults.sectionId, sectionId)
        )
      });
      
      const passed = score >= 70; // Pass threshold of 70%
      
      if (existingResult) {
        // If previous attempt exists, increment attempts counter
        const updatedResult = await db.update(userQuizResults)
          .set({
            score,
            maxScore,
            passed,
            answers,
            attempts: existingResult.attempts + 1,
            lastAttemptAt: new Date()
          })
          .where(and(
            eq(userQuizResults.userId, userId),
            eq(userQuizResults.sectionId, sectionId)
          ))
          .returning();
        
        // If passed for the first time, award XP
        if (passed && !existingResult.passed) {
          const xpAmount = Math.ceil(section.xpReward * 0.5); // 50% of section XP for quiz
          await this.awardExperiencePoints(userId, xpAmount, 'quiz', sectionId, `Passed quiz for "${section.title}"`);
        }
        
        return updatedResult[0];
      } else {
        // Create new quiz result
        const newResult = await db.insert(userQuizResults)
          .values({
            userId,
            sectionId,
            score,
            maxScore,
            passed,
            attempts: 1,
            answers
          })
          .returning();
        
        // If passed, award XP
        if (passed) {
          const xpAmount = Math.ceil(section.xpReward * 0.5); // 50% of section XP for quiz
          await this.awardExperiencePoints(userId, xpAmount, 'quiz', sectionId, `Passed quiz for "${section.title}"`);
        }
        
        return newResult[0];
      }
    } catch (error) {
      console.error('Error submitting quiz result:', error);
      throw error;
    }
  }
  
  /**
   * Submit a simulation result for a section
   */
  async submitSimulationResult(
    userId: number,
    sectionId: number,
    challengeId: number,
    campaignId: number,
    score: number,
    passed: boolean,
    feedback: string[],
    metrics: Record<string, number>,
    timeSpentMinutes: number
  ): Promise<UserSimulationResult> {
    try {
      // Check if section exists and has a simulation
      const section = await db.query.tutorialSections.findFirst({
        where: and(
          eq(tutorialSections.id, sectionId),
          eq(tutorialSections.hasSimulation, true)
        )
      });
      
      if (!section) {
        throw new Error(`Section ${sectionId} not found or does not have a simulation`);
      }
      
      // Check if user has already attempted this simulation
      const existingResult = await db.query.userSimulationResults.findFirst({
        where: and(
          eq(userSimulationResults.userId, userId),
          eq(userSimulationResults.sectionId, sectionId)
        )
      });
      
      // Determine completion status based on passed flag
      const completedAt = passed ? new Date() : null;
      
      if (existingResult) {
        // If previous attempt exists, increment attempts counter
        const updatedResult = await db.update(userSimulationResults)
          .set({
            score,
            passed,
            feedback,
            metrics,
            attempts: existingResult.attempts + 1,
            completedAt,
            timeSpentMinutes: existingResult.timeSpentMinutes + timeSpentMinutes
          })
          .where(and(
            eq(userSimulationResults.userId, userId),
            eq(userSimulationResults.sectionId, sectionId)
          ))
          .returning();
        
        // If passed for the first time, award XP
        if (passed && !existingResult.passed) {
          const xpAmount = Math.ceil(section.xpReward * 0.75); // 75% of section XP for simulation
          await this.awardExperiencePoints(userId, xpAmount, 'simulation', sectionId, `Completed simulation for "${section.title}"`);
        }
        
        return updatedResult[0];
      } else {
        // Create new simulation result
        const newResult = await db.insert(userSimulationResults)
          .values({
            userId,
            sectionId,
            challengeId,
            campaignId,
            score,
            passed,
            feedback,
            metrics,
            attempts: 1,
            completedAt,
            timeSpentMinutes
          })
          .returning();
        
        // If passed, award XP
        if (passed) {
          const xpAmount = Math.ceil(section.xpReward * 0.75); // 75% of section XP for simulation
          await this.awardExperiencePoints(userId, xpAmount, 'simulation', sectionId, `Completed simulation for "${section.title}"`);
        }
        
        return newResult[0];
      }
    } catch (error) {
      console.error('Error submitting simulation result:', error);
      throw error;
    }
  }
  
  /**
   * Award experience points to a user
   */
  async awardExperiencePoints(
    userId: number, 
    amount: number, 
    source: string, 
    entityId: number, 
    reason: string
  ): Promise<void> {
    try {
      // Check daily XP limit
      const userProfile = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, userId)
      });
      
      if (!userProfile) {
        throw new Error(`User profile not found for user ID: ${userId}`);
      }
      
      // Check if lastXpReset is from a different day
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastResetDate = new Date(userProfile.lastXpReset);
      const lastResetDay = new Date(lastResetDate.getFullYear(), lastResetDate.getMonth(), lastResetDate.getDate());
      
      let dailyXpEarned = userProfile.dailyXpEarned;
      
      // If it's a new day, reset daily XP counter
      if (today.getTime() > lastResetDay.getTime()) {
        dailyXpEarned = 0;
        await db.update(userProfiles)
          .set({
            dailyXpEarned: 0,
            lastXpReset: now
          })
          .where(eq(userProfiles.userId, userId));
      }
      
      // Check if awarding this XP would exceed daily limit (500 XP)
      const dailyXpLimit = 500;
      
      if (dailyXpEarned >= dailyXpLimit) {
        console.log(`User ${userId} has reached daily XP limit of ${dailyXpLimit}`);
        return; // Don't award XP if limit reached
      }
      
      // If adding this XP would exceed the limit, cap it
      const adjustedAmount = Math.min(amount, dailyXpLimit - dailyXpEarned);
      
      if (adjustedAmount <= 0) {
        return; // No XP to award after adjustment
      }
      
      // Log XP gain
      await db.insert(userExperienceLog).values({
        userId,
        amount: adjustedAmount,
        source,
        entityId,
        reason
      });
      
      // Update user's total XP and daily XP
      await db.update(userProfiles)
        .set({
          experiencePoints: userProfile.experiencePoints + adjustedAmount,
          dailyXpEarned: dailyXpEarned + adjustedAmount,
          lastActivityDate: now
        })
        .where(eq(userProfiles.userId, userId));
      
      // Update last activity date to prevent XP decay
      await this.updateLastActivity(userId);
    } catch (error) {
      console.error('Error awarding experience points:', error);
      throw error;
    }
  }
  
  /**
   * Apply XP decay for inactive users
   */
  async applyInactivityDecay(userId: number): Promise<void> {
    try {
      const userProfile = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, userId)
      });
      
      if (!userProfile) {
        throw new Error(`User profile not found for user ID: ${userId}`);
      }
      
      const now = new Date();
      const lastActivity = new Date(userProfile.lastActivityDate);
      const daysSinceActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
      
      // Apply decay after 7 days of inactivity
      if (daysSinceActivity > 7) {
        // Calculate decay amount (1% per day after 7 days, maximum 30%)
        const decayDays = Math.min(daysSinceActivity - 7, 30); // Cap at 30 days
        const decayRate = 0.01 * decayDays; // 1% per day
        const decayAmount = Math.floor(userProfile.experiencePoints * decayRate);
        
        if (decayAmount > 0) {
          // Log XP decay
          await db.insert(userExperienceLog).values({
            userId,
            amount: -decayAmount,
            source: 'inactivity-decay',
            reason: `${decayDays} days of inactivity (${(decayRate * 100).toFixed(0)}% decay)`
          });
          
          // Update user's XP
          await db.update(userProfiles)
            .set({
              experiencePoints: userProfile.experiencePoints - decayAmount
            })
            .where(eq(userProfiles.userId, userId));
          
          // Check if user should drop a level
          await this.checkForLevelDown(userId);
        }
      }
    } catch (error) {
      console.error('Error applying inactivity decay:', error);
      throw error;
    }
  }
  
  /**
   * Update user's last activity date
   */
  async updateLastActivity(userId: number): Promise<void> {
    try {
      await db.update(userProfiles)
        .set({
          lastActivityDate: new Date()
        })
        .where(eq(userProfiles.userId, userId));
    } catch (error) {
      console.error('Error updating last activity:', error);
      throw error;
    }
  }
  
  /**
   * Check if user meets requirements for level up
   */
  async checkForLevelUp(userId: number): Promise<boolean> {
    try {
      const userProfile = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, userId)
      });
      
      if (!userProfile) {
        throw new Error(`User profile not found for user ID: ${userId}`);
      }
      
      // Get current level info
      const currentLevel = userProfile.level;
      
      // Define level progression
      const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
      const currentLevelIndex = levels.indexOf(currentLevel);
      
      // If already at max level, no need to check
      if (currentLevelIndex >= levels.length - 1) {
        return false;
      }
      
      // Get next level
      const nextLevel = levels[currentLevelIndex + 1];
      
      // Get requirements for next level
      const levelReq = await db.query.levelRequirements.findFirst({
        where: eq(levelRequirements.level, nextLevel)
      });
      
      if (!levelReq) {
        console.error(`Level requirements not found for level: ${nextLevel}`);
        return false;
      }
      
      // Check XP requirement
      if (userProfile.experiencePoints < levelReq.xpRequired) {
        return false;
      }
      
      // Check required modules
      if (levelReq.requiredModuleIds && levelReq.requiredModuleIds.length > 0) {
        const completedModules = await db.query.userTutorialProgress.findMany({
          where: and(
            eq(userTutorialProgress.userId, userId),
            eq(userTutorialProgress.completed, true)
          )
        });
        
        const completedModuleIds = completedModules.map(module => module.moduleId);
        
        const allRequiredModulesCompleted = levelReq.requiredModuleIds.every(
          moduleId => completedModuleIds.includes(moduleId)
        );
        
        if (!allRequiredModulesCompleted) {
          return false;
        }
      }
      
      // Check achievement count if required
      if (levelReq.requiredAchievementCount > 0) {
        // Note: This assumes achievements are stored in the achievements array in userProfile
        const achievementCount = userProfile.achievements ? userProfile.achievements.length : 0;
        
        if (achievementCount < levelReq.requiredAchievementCount) {
          return false;
        }
      }
      
      // Check minimum time at current level
      // This would require tracking when the user reached their current level
      // For simplicity, we're skipping this check for now
      
      // All requirements met, level up the user
      await db.update(userProfiles)
        .set({
          level: nextLevel
        })
        .where(eq(userProfiles.userId, userId));
      
      // Log the level up event
      await db.insert(userExperienceLog).values({
        userId,
        amount: 0, // No XP for leveling up itself
        source: 'level-up',
        reason: `Advanced to ${nextLevel} level`
      });
      
      return true;
    } catch (error) {
      console.error('Error checking for level up:', error);
      throw error;
    }
  }
  
  /**
   * Check if user should be moved down a level
   */
  async checkForLevelDown(userId: number): Promise<boolean> {
    try {
      const userProfile = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, userId)
      });
      
      if (!userProfile) {
        throw new Error(`User profile not found for user ID: ${userId}`);
      }
      
      // Get current level requirements
      const currentLevel = userProfile.level;
      
      // Define level progression
      const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
      const currentLevelIndex = levels.indexOf(currentLevel);
      
      // If at the lowest level, no need to check
      if (currentLevelIndex <= 0) {
        return false;
      }
      
      // Get requirements for current level
      const levelReq = await db.query.levelRequirements.findFirst({
        where: eq(levelRequirements.level, currentLevel)
      });
      
      if (!levelReq) {
        console.error(`Level requirements not found for level: ${currentLevel}`);
        return false;
      }
      
      // Check if user's XP is below the requirement for their current level
      if (userProfile.experiencePoints < levelReq.xpRequired) {
        // Move user down to previous level
        const previousLevel = levels[currentLevelIndex - 1];
        
        await db.update(userProfiles)
          .set({
            level: previousLevel
          })
          .where(eq(userProfiles.userId, userId));
        
        // Log the level down event
        await db.insert(userExperienceLog).values({
          userId,
          amount: 0, // No XP change for leveling down itself
          source: 'level-down',
          reason: `Moved back to ${previousLevel} level due to XP decay`
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking for level down:', error);
      throw error;
    }
  }
  
  /**
   * Get user's progress summary across all modules
   */
  async getUserProgressSummary(userId: number): Promise<{ 
    totalModules: number;
    completedModules: number;
    inProgressModules: number;
    totalSections: number;
    completedSections: number;
    totalXpEarned: number;
    currentLevel: string;
    nextLevelProgress: number; // 0-100 percentage to next level
  }> {
    try {
      // Get user profile
      const userProfile = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, userId)
      });
      
      if (!userProfile) {
        throw new Error(`User profile not found for user ID: ${userId}`);
      }
      
      // Get all modules
      const allModules = await db.query.tutorialModules.findMany();
      const totalModules = allModules.length;
      
      // Get all sections
      const allSections = await db.query.tutorialSections.findMany();
      const totalSections = allSections.length;
      
      // Get user progress records
      const progressRecords = await db.query.userTutorialProgress.findMany({
        where: eq(userTutorialProgress.userId, userId)
      });
      
      const completedModules = progressRecords.filter(record => record.completed).length;
      const inProgressModules = progressRecords.filter(record => record.started && !record.completed).length;
      
      // Count completed sections
      const completedSections = progressRecords.reduce((total, record) => 
        total + (record.completedSections?.length || 0), 0);
      
      // Get current level and calculate progress to next level
      const currentLevel = userProfile.level;
      const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
      const currentLevelIndex = levels.indexOf(currentLevel);
      
      let nextLevelProgress = 100; // Default to 100% if at max level
      
      if (currentLevelIndex < levels.length - 1) {
        const nextLevel = levels[currentLevelIndex + 1];
        
        // Get XP requirements for current and next level
        const currentLevelReq = await db.query.levelRequirements.findFirst({
          where: eq(levelRequirements.level, currentLevel)
        });
        
        const nextLevelReq = await db.query.levelRequirements.findFirst({
          where: eq(levelRequirements.level, nextLevel)
        });
        
        if (currentLevelReq && nextLevelReq) {
          const currentLevelXp = currentLevelReq.xpRequired;
          const nextLevelXp = nextLevelReq.xpRequired;
          const userXp = userProfile.experiencePoints;
          
          // Calculate progress percentage
          const xpRange = nextLevelXp - currentLevelXp;
          const userXpInRange = userXp - currentLevelXp;
          
          nextLevelProgress = Math.min(Math.max(Math.round((userXpInRange / xpRange) * 100), 0), 100);
        }
      }
      
      return {
        totalModules,
        completedModules,
        inProgressModules,
        totalSections,
        completedSections,
        totalXpEarned: userProfile.experiencePoints,
        currentLevel,
        nextLevelProgress
      };
    } catch (error) {
      console.error('Error getting user progress summary:', error);
      throw error;
    }
  }
}

export const enhancedTutorialService = new EnhancedTutorialService();