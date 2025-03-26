import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Define the Tutorial interface directly in the component to avoid import issues
interface Tutorial {
  id: number;
  title: string;
  level: string;
  content: string;
  tasks: {
    id: number;
    description: string;
    type: 'quiz' | 'practical' | 'simulation';
    requirements: string[];
    verificationCriteria: string[];
  }[];
  estimatedTime: number;
  skillsLearned: string[];
  hasSimulation?: boolean;
}

interface LessonPlanViewProps {
  lessonTitle: string;
  tutorials: Tutorial[];
  onSelectTutorial: (tutorial: Tutorial) => void;
  onBack: () => void;
}

export default function LessonPlanView({
  lessonTitle,
  tutorials,
  onSelectTutorial,
  onBack
}: LessonPlanViewProps) {
  // Format lesson number for display (e.g., 1-1, 1-2, etc.)
  const formatSubchapterNumber = (index: number, lessonNumber: number) => {
    return `${lessonNumber}-${index + 1}`;
  };

  // Extract the lesson number from the title (e.g., "Lesson 1: ..." -> 1)
  const lessonNumber = parseInt(lessonTitle.split(':')[0].replace('Lesson', '').trim());

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={onBack} variant="outline" size="sm">
          ← Back to Lessons
        </Button>
      </div>

      <Card className="mb-8 border border-[#ffd700]/30 shadow-lg">
        <CardHeader className="border-b border-[#ffd700]/30 bg-[#111]/80">
          <h2 className="text-2xl font-bold text-[#ffd700]">{lessonTitle}</h2>
          <p className="text-[#f5f5f5]/70 mt-2">
            Select a subchapter below to begin your learning journey
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {tutorials.map((tutorial, index) => (
              <div key={tutorial.id} className="group">
                <div 
                  className="p-4 border border-[#ffd700]/20 rounded-lg transition-all duration-300 
                            hover:border-[#ffd700] hover:bg-[#111]/40 cursor-pointer"
                  onClick={() => onSelectTutorial(tutorial)}
                >
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-[#222] rounded-full flex items-center justify-center text-[#ffd700] font-bold mr-4 border border-[#ffd700]/30 group-hover:bg-[#ffd700]/20">
                      {formatSubchapterNumber(index, lessonNumber)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#ffd700] group-hover:text-white transition-colors">
                        {tutorial.title}
                      </h3>
                      <p className="text-[#f5f5f5]/70 text-sm mt-1">{tutorial.estimatedTime} minutes • {tutorial.level} level</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tutorial.skillsLearned && tutorial.skillsLearned.map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-[#333] text-[#f5f5f5] rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4 self-center text-[#ffd700] opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </div>
                </div>
                {index < tutorials.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="w-0.5 h-4 bg-[#ffd700]/20"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="bg-[#111]/40 border-t border-[#ffd700]/30 p-4">
          <div className="w-full flex justify-between items-center">
            <p className="text-sm text-[#f5f5f5]/70">
              <span className="text-[#ffd700]">Pro Tip:</span> Complete tutorials in order for the best learning experience
            </p>
            <Button 
              onClick={() => tutorials.length > 0 && onSelectTutorial(tutorials[0])}
              className="bg-[#ffd700] text-black hover:bg-[#e6c200]"
            >
              Start First Lesson
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}