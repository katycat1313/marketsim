
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tutorial } from '@server/services/tutorialService';

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

  const completeTutorial = async (tutorialId: number) => {
    await fetch('/api/tutorials/complete', {
      method: 'POST',
      body: JSON.stringify({ tutorialId }),
      headers: { 'Content-Type': 'application/json' }
    });
    fetchProgress();
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
                <p>{tutorial.content}</p>
                <div className="mt-4">
                  <Progress value={
                    progress.includes(tutorial.id) ? 100 : 0
                  } />
                </div>
                <Button
                  onClick={() => startTutorial(tutorial)}
                  className="mt-4"
                  disabled={progress.includes(tutorial.id)}
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
                <Button 
                  onClick={() => completeTutorial(currentTutorial.id)}
                  className="mt-4"
                >
                  Complete Tutorial
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
