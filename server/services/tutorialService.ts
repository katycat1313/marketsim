
import { db } from '../db';

export interface Tutorial {
  id: number;
  title: string;
  level: string;
  content: string;
  tasks: TutorialTask[];
  estimatedTime: number;
  skillsLearned: string[];
}

interface TutorialTask {
  id: number;
  description: string;
  type: 'quiz' | 'practical' | 'simulation';
  requirements: string[];
  verificationCriteria: string[];
}

export class TutorialService {
  private tutorials: Tutorial[] = [
    {
      id: 1,
      title: "Getting Started with Digital Marketing",
      level: "Beginner",
      content: "Learn the fundamentals of digital marketing and campaign creation",
      estimatedTime: 30,
      skillsLearned: ["Campaign Basics", "Audience Targeting"],
      tasks: [
        {
          id: 1,
          description: "Create your first marketing persona",
          type: "practical",
          requirements: ["Use Persona Builder", "Define target demographics"],
          verificationCriteria: ["Persona saved", "Demographics defined"]
        },
        {
          id: 2,
          description: "Set up a basic campaign",
          type: "simulation",
          requirements: ["Set campaign objective", "Define budget"],
          verificationCriteria: ["Campaign created", "Budget set"]
        }
      ]
    },
    // Add more tutorials here
  ];

  async getTutorials(userLevel: string): Promise<Tutorial[]> {
    return this.tutorials.filter(t => t.level === userLevel);
  }

  async getUserProgress(userId: number): Promise<number[]> {
    const progress = await db.query.userProgress.findMany({
      where: { userId }
    });
    return progress.map(p => p.tutorialId);
  }

  async markTutorialComplete(userId: number, tutorialId: number): Promise<void> {
    await db.insert(userProgress).values({
      userId,
      tutorialId,
      completedAt: new Date()
    });
  }
}
