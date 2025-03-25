
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
    try {
      const response = await fetch('/api/tutorials');
      const data = await response.json();
      
      // Check if data is an array before setting it
      if (Array.isArray(data)) {
        setTutorials(data);
      } else {
        console.error('Tutorials API did not return an array:', data);
        // Initialize with empty array if not an array
        setTutorials([]);
      }
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      setTutorials([]);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/tutorials/progress');
      const data = await response.json();
      
      // Check if data is an array before setting it
      if (Array.isArray(data)) {
        console.log('Progress data received:', data);
        setProgress(data);
      } else {
        console.error('Progress API did not return an array:', data);
        // Always initialize with empty array to prevent showing completed tutorials incorrectly
        setProgress([]);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      setProgress([]);
    }
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
              <div className="space-y-6">
                {/* Render the tutorial content */}
                <div className="prose prose-blue max-w-none">
                  {/* Enhanced rendering of content with proper formatting */}
                  {currentTutorial.content ? (
                    <div className="whitespace-pre-wrap p-4 bg-white rounded-lg shadow-sm">
                      {/* Format the content to display nicely */}
                      {currentTutorial.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">
                          {paragraph.split('\n').map((line, lineIdx) => (
                            <React.Fragment key={lineIdx}>
                              {line}
                              {lineIdx < paragraph.split('\n').length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p>Content unavailable. Please try again later.</p>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold mt-6 border-t pt-4">Tutorial Tasks</h3>
                
                {currentTutorial.tasks.map(task => (
                  <div key={task.id} className="border p-4 rounded">
                    <h4 className="font-semibold">{task.description}</h4>
                    <p className="text-sm text-gray-500 mb-2">Type: {task.type}</p>
                    
                    <div className="mt-3">
                      <h5 className="text-sm font-medium">Requirements:</h5>
                      <ul className="list-disc ml-4 mt-1">
                        {task.requirements.map((req, i) => (
                          <li key={i} className="text-sm">{req}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-3">
                      <h5 className="text-sm font-medium">Verification Criteria:</h5>
                      <ul className="list-disc ml-4 mt-1">
                        {task.verificationCriteria.map((criteria, i) => (
                          <li key={i} className="text-sm">{criteria}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
                
                {completionError && (
                  <div className="p-4 mb-4 text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {completionError}
                  </div>
                )}
                
                <Button 
                  onClick={() => completeTutorial(currentTutorial.id)}
                  className="mt-6 w-full"
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
