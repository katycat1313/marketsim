import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ErrorBoundary from '../components/ErrorBoundary';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Tutorial interface
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

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [progress, setProgress] = useState<number[]>([]);
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTutorials();
    fetchProgress();
  }, []);

  const fetchTutorials = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tutorials', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Sort tutorials by chapter number and subchapter number
        const sortedTutorials = sortTutorialsByChapter(data);
        setTutorials(sortedTutorials);
      } else {
        throw new Error('Tutorials API did not return an array');
      }
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      setError(error instanceof Error ? error.message : 'Failed to load tutorials');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/tutorials/progress', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        console.log('User not authenticated. Can\'t fetch tutorial progress.');
        setProgress([]);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setProgress(data);
      } else {
        console.error('Progress API did not return an array:', data);
        setProgress([]);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      setProgress([]);
    }
  };

  // Function to sort tutorials by chapter and subchapter
  const sortTutorialsByChapter = (tutorials: Tutorial[]): Tutorial[] => {
    return tutorials.sort((a, b) => {
      // Extract chapter numbers from titles
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      
      // Try to extract chapter numbers from tutorial titles
      const aMatch = aTitle.match(/chapter\s*(\d+)[\-\.]?(\d+)?/i);
      const bMatch = bTitle.match(/chapter\s*(\d+)[\-\.]?(\d+)?/i);
      
      // If both have chapter numbers, compare them
      if (aMatch && bMatch) {
        const aChapter = parseInt(aMatch[1]);
        const bChapter = parseInt(bMatch[1]);
        
        if (aChapter !== bChapter) {
          return aChapter - bChapter;
        }
        
        // If same chapter, compare subchapter
        const aSubChapter = aMatch[2] ? parseInt(aMatch[2]) : 0;
        const bSubChapter = bMatch[2] ? parseInt(bMatch[2]) : 0;
        
        return aSubChapter - bSubChapter;
      }
      
      // If one has chapter number and the other doesn't, prioritize the one with chapter number
      if (aMatch) return -1;
      if (bMatch) return 1;
      
      // If neither has chapter number, sort by ID
      return a.id - b.id;
    });
  };

  // Group tutorials by chapter
  const tutorialsByChapter = () => {
    const chapters: Record<string, Tutorial[]> = {};
    
    tutorials.forEach(tutorial => {
      // Try to extract chapter number from title
      const match = tutorial.title.toLowerCase().match(/chapter\s*(\d+)/i) || 
                   tutorial.content.toLowerCase().match(/chapter\s*(\d+)/i);
      
      let chapterKey = 'Other';
      
      if (match) {
        chapterKey = `Chapter ${match[1]}`;
      } else if (tutorial.title.toLowerCase().includes('seo')) {
        chapterKey = 'SEO';
      } else if (tutorial.title.toLowerCase().includes('google ads') || tutorial.title.toLowerCase().includes('campaign')) {
        chapterKey = 'Google Ads';
      } else if (tutorial.title.toLowerCase().includes('analytics') || tutorial.title.toLowerCase().includes('data')) {
        chapterKey = 'Analytics';
      }
      
      if (!chapters[chapterKey]) {
        chapters[chapterKey] = [];
      }
      
      chapters[chapterKey].push(tutorial);
    });
    
    // Sort each chapter's tutorials
    Object.keys(chapters).forEach(key => {
      chapters[key] = sortTutorialsByChapter(chapters[key]);
    });
    
    return chapters;
  };

  // Start tutorial function
  const startTutorial = (tutorial: Tutorial) => {
    setCurrentTutorial(tutorial);
  };

  // Render a tutorial card
  const renderTutorialCard = (tutorial: Tutorial) => {
    const isCompleted = progress.includes(tutorial.id);
    
    return (
      <Card key={tutorial.id} className="flex flex-col h-full border border-[#ffd700]/20 bg-[#111]/80 shadow-md overflow-hidden relative">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-1">
                {tutorial.level && (
                  <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full mb-2 ${
                    tutorial.level.toLowerCase().includes('beginner') ? 'bg-green-100 text-green-800' :
                    tutorial.level.toLowerCase().includes('intermediate') ? 'bg-blue-100 text-blue-800' :
                    tutorial.level.toLowerCase().includes('advanced') ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {tutorial.level}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-[#ffd700]">{tutorial.title}</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="text-xs text-gray-400 mb-2">
            Estimated time: {tutorial.estimatedTime || 60} min
          </div>
          
          {tutorial.skillsLearned && tutorial.skillsLearned.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-1">Skills learned:</div>
              <div className="flex flex-wrap gap-1">
                {tutorial.skillsLearned.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-[#ffd700]/10 text-[#ffd700] rounded">
                    {skill}
                  </span>
                ))}
                {tutorial.skillsLearned.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-[#ffd700]/10 text-[#ffd700] rounded">
                    +{tutorial.skillsLearned.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div className="relative mt-4">
            <Progress 
              value={isCompleted ? 100 : 0} 
              className={isCompleted ? "bg-green-100" : "bg-gray-100"}
            />
            {isCompleted && (
              <span className="absolute right-0 -top-1 text-xs text-green-600">✓ Completed</span>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => startTutorial(tutorial)}
            className="w-full relative overflow-hidden group"
            variant={isCompleted ? "outline" : "default"}
          >
            <span className="absolute inset-0 w-0 bg-[#ffd700]/10 transition-all duration-300 group-hover:w-full"></span>
            <span className="relative">
              {isCompleted ? 'Review Lesson' : 'Start Lesson'}
            </span>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#ffd700] flex items-center">
            <span className="w-8 h-8 rounded-full bg-[#ffd700] text-black flex items-center justify-center mr-3 text-sm">DZ</span>
            DIGITAL ZOOM Marketing Academy
          </h1>
          <p className="text-muted-foreground">
            Master digital marketing with our structured learning path. Complete tutorials to unlock simulations.
          </p>
          <Separator className="my-4 border-[#ffd700]/20" />
        </div>
        
        <ErrorBoundary
          fallback={
            <div className="p-4">
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Tutorial Error</AlertTitle>
                <AlertDescription>
                  There was a problem loading the tutorials. Please try again later.
                </AlertDescription>
              </Alert>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Refresh Page
              </Button>
            </div>
          }
        >
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-pulse flex flex-col w-full max-w-xl">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : currentTutorial ? (
            <div className="bg-[#111]/80 p-6 rounded-lg border border-[#ffd700]/20 mb-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#ffd700]">{currentTutorial.title}</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentTutorial(null)}
                  className="border-[#ffd700]/40 text-[#ffd700] hover:bg-[#ffd700]/10"
                >
                  Back to Tutorials
                </Button>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="text-sm px-3 py-1 bg-[#333] text-[#ffd700] rounded-full">
                  Level: {currentTutorial.level}
                </span>
                <span className="text-sm px-3 py-1 bg-[#333] text-[#ffd700] rounded-full">
                  Estimated Time: {currentTutorial.estimatedTime || 60} minutes
                </span>
              </div>
              <div className="prose prose-invert max-w-none mt-6">
                <div dangerouslySetInnerHTML={{ __html: currentTutorial.content.replace(/\n/g, '<br />') }} />
              </div>
              
              {currentTutorial.tasks && currentTutorial.tasks.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-[#ffd700] mb-4">Tasks & Practice</h3>
                  <div className="space-y-4">
                    {currentTutorial.tasks.map((task, index) => (
                      <div key={task.id} className="bg-[#222] p-4 rounded-lg border border-[#ffd700]/10">
                        <h4 className="text-lg font-semibold text-[#ffd700] mb-2">
                          Task {index + 1}: {task.description}
                        </h4>
                        <p className="text-sm text-gray-400 mb-3">Type: {task.type}</p>
                        
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-300 mb-1">Requirements:</h5>
                          <ul className="list-disc pl-5 text-sm text-gray-400">
                            {task.requirements.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-gray-300 mb-1">Verification Criteria:</h5>
                          <ul className="list-disc pl-5 text-sm text-gray-400">
                            {task.verificationCriteria.map((crit, idx) => (
                              <li key={idx}>{crit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={() => setCurrentTutorial(null)} 
                  className="mr-2"
                  variant="outline"
                >
                  Back to List
                </Button>
                <Button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/tutorials/complete', {
                        method: 'POST',
                        body: JSON.stringify({ tutorialId: currentTutorial.id }),
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include' 
                      });
                      
                      if (!response.ok) {
                        throw new Error('Failed to mark tutorial as complete');
                      }
                      
                      // Update progress
                      await fetchProgress();
                      // Show success message or toast here
                      
                      // Go back to list
                      setCurrentTutorial(null);
                    } catch (error) {
                      console.error('Error completing tutorial:', error);
                      // Show error message or toast here
                    }
                  }}
                  disabled={progress.includes(currentTutorial.id)}
                >
                  {progress.includes(currentTutorial.id) ? 'Completed ✓' : 'Mark as Complete'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(tutorialsByChapter()).map(([chapterName, chapterTutorials]) => (
                <div key={chapterName} className="mb-8 p-2 rounded-lg bg-[#111]/40 shadow-md border border-[#ffd700]/10">
                  <div className="mb-4 pl-2 border-l-4 border-[#ffd700]">
                    <h3 className="text-xl font-bold text-[#ffd700]">
                      {chapterName}
                    </h3>
                    <p className="text-[#f5f5f5]/70 text-sm mb-2">
                      {chapterTutorials.length} {chapterTutorials.length === 1 ? 'lesson' : 'lessons'} available
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                    {chapterTutorials.map(renderTutorialCard)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}