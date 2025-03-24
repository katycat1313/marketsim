
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

// Define the Tutorial interface directly in the component
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

export function TutorialSystem() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [progress, setProgress] = useState<number[]>([]);

  useEffect(() => {
    fetchTutorials();
    fetchProgress();
  }, []);

  const fetchTutorials = async () => {
    const response = await fetch('/api/tutorials');
    const data = await response.json();
    setTutorials(data);
  };

  const fetchProgress = async () => {
    const response = await fetch('/api/tutorials/progress');
    const data = await response.json();
    setProgress(data);
  };

  const startTutorial = (tutorial: Tutorial) => {
    setCurrentTutorial(tutorial);
  };

  const [isCompleting, setIsCompleting] = useState(false);
  const [completionError, setCompletionError] = useState<string | null>(null);

  const completeTutorial = async (tutorialId: number) => {
    setIsCompleting(true);
    setCompletionError(null);
    
    try {
      const response = await fetch('/api/tutorials/complete', {
        method: 'POST',
        body: JSON.stringify({ tutorialId }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete tutorial');
      }
      
      // Wait a brief moment to show the success state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await fetchProgress();
      setCurrentTutorial(null); // Return to tutorial list after completion
    } catch (error) {
      console.error('Error completing tutorial:', error);
      setCompletionError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Marketing Tutorials</h2>
      {!currentTutorial ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutorials.map(tutorial => (
            <Card key={tutorial.id}>
              <CardHeader>
                <h3 className="text-lg font-semibold">{tutorial.title}</h3>
                <p className="text-sm text-gray-500">Level: {tutorial.level}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-2">
                  {tutorial.skillsLearned && tutorial.skillsLearned.length > 0 ? 
                    `Skills: ${tutorial.skillsLearned.slice(0, 3).join(', ')}${tutorial.skillsLearned.length > 3 ? '...' : ''}` : 
                    'Learn essential marketing skills'
                  }
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Estimated time: {tutorial.estimatedTime || 60} minutes
                </p>
                <div className="mt-4">
                  <Progress value={
                    progress.includes(tutorial.id) ? 100 : 0
                  } />
                </div>
                <Button
                  onClick={() => startTutorial(tutorial)}
                  className="mt-4 w-full"
                  disabled={progress.includes(tutorial.id)}
                  variant={progress.includes(tutorial.id) ? "outline" : "default"}
                >
                  {progress.includes(tutorial.id) ? 'Completed' : 'Start Tutorial'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <Button onClick={() => setCurrentTutorial(null)} className="mb-4">
            Back to Tutorials
          </Button>
          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold">{currentTutorial.title}</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentTutorial.tasks.map(task => (
                  <div key={task.id} className="border p-4 rounded">
                    <h4 className="font-semibold">{task.description}</h4>
                    <ul className="list-disc ml-4 mt-2">
                      {task.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                {completionError && (
                  <div className="p-4 mb-4 text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {completionError}
                  </div>
                )}
                <Button 
                  onClick={() => completeTutorial(currentTutorial.id)}
                  className="mt-4 w-full"
                  disabled={isCompleting}
                >
                  {isCompleting ? 'Completing...' : 'Complete Tutorial'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
