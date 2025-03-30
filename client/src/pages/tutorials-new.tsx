import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Search, 
  BarChart3, 
  Globe, 
  Megaphone, 
  FileText, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import TutorialContentRenderer from '../components/TutorialContentRenderer';
import { MicroFeedback } from '@/components/ui/micro-feedback';

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

// Chapter interface
interface Chapter {
  number: number;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  tutorials: Tutorial[];
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
      console.log('Fetching tutorials...');
      
      const response = await fetch('/api/tutorials', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Tutorial API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Retrieved ${data.length} tutorials from API`);
      
      if (Array.isArray(data)) {
        // Make sure we have at least some tutorials
        if (data.length === 0) {
          console.warn('No tutorials were returned from the API');
          setError('No tutorials found. Please check back later.');
          setTutorials([]);
          return;
        }
        
        // Sort tutorials by chapter number and subchapter number
        const sortedTutorials = sortTutorialsByChapter(data);
        console.log(`Sorted ${sortedTutorials.length} tutorials by chapter`);
        
        // Log first few tutorials for debugging
        sortedTutorials.slice(0, 3).forEach((t, i) => {
          console.log(`Tutorial ${i + 1}:`, t.id, t.title);
        });
        
        setTutorials(sortedTutorials);
      } else {
        console.error('API response is not an array:', data);
        throw new Error('Tutorials API did not return an array');
      }
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      setError(error instanceof Error ? error.message : 'Failed to load tutorials');
      setTutorials([]); // Set empty array to avoid undefined errors
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

  // Helper function to extract a chapter number from a tutorial
  const extractChapterNumber = (tutorial: Tutorial): number => {
    const titleLower = tutorial.title.toLowerCase();
    const contentLower = tutorial.content.toLowerCase();
    
    // Try to extract chapter numbers from tutorial titles or content
    const titleMatch = titleLower.match(/chapter\s*(\d+)[\-\.]?(\d+)?/i);
    const contentMatch = contentLower.match(/chapter\s*(\d+)[\-\.]?(\d+)?/i);
    
    if (titleMatch) {
      return parseInt(titleMatch[1]);
    }
    
    if (contentMatch) {
      return parseInt(contentMatch[1]);
    }
    
    // If no explicit chapter number, use content-based heuristics to assign chapters
    if (titleLower.includes('seo') || contentLower.includes('search engine optimization')) {
      return 7; // SEO belongs to Chapter 7
    } else if (titleLower.includes('troubleshoot') || contentLower.includes('troubleshoot')) {
      return 8; // Troubleshooting to Chapter 8
    } else if (titleLower.includes('analytics') || 
               titleLower.includes('data') || 
               contentLower.includes('analytics') || 
               contentLower.includes('measurement')) {
      return 5; // Analytics to Chapter 5
    } else if (titleLower.includes('email') || 
               titleLower.includes('social media') || 
               contentLower.includes('email marketing') || 
               contentLower.includes('social media')) {
      return 6; // Marketing Channels to Chapter 6
    } else if (titleLower.includes('advanced') && 
              (titleLower.includes('google ads') || titleLower.includes('campaign'))) {
      return 3; // Advanced Google Ads to Chapter 3
    } else if (titleLower.includes('google ads') || 
               titleLower.includes('campaign') || 
               contentLower.includes('google ads')) {
      return 2; // Google Ads Fundamentals to Chapter 2
    } else if (titleLower.includes('goal') || 
               titleLower.includes('testing') || 
               contentLower.includes('goal setting') || 
               contentLower.includes('testing methodologies')) {
      return 4; // Marketing Objectives to Chapter 4
    }
    
    // Default to Introduction chapter if no specific category is found
    return 1;
  };

  // Function to sort tutorials by chapter and subchapter
  const sortTutorialsByChapter = (tutorials: Tutorial[]): Tutorial[] => {
    return tutorials.sort((a, b) => {
      // First sort by chapter number
      const aChapter = extractChapterNumber(a);
      const bChapter = extractChapterNumber(b);
      
      if (aChapter !== bChapter) {
        return aChapter - bChapter;
      }
      
      // If same chapter, try to extract subchapter numbers
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      
      const aMatch = aTitle.match(/chapter\s*\d+[\-\.](\d+)/i) || 
                     a.content.toLowerCase().match(/chapter\s*\d+[\-\.](\d+)/i);
      const bMatch = bTitle.match(/chapter\s*\d+[\-\.](\d+)/i) ||
                     b.content.toLowerCase().match(/chapter\s*\d+[\-\.](\d+)/i);
      
      // If both have subchapter numbers, compare them
      if (aMatch && bMatch) {
        const aSubChapter = parseInt(aMatch[1]);
        const bSubChapter = parseInt(bMatch[1]);
        return aSubChapter - bSubChapter;
      }
      
      // If one has subchapter number and the other doesn't, prioritize the one with subchapter number
      if (aMatch) return -1;
      if (bMatch) return 1;
      
      // If neither has subchapter number, sort by ID
      return a.id - b.id;
    });
  };

  // Organize tutorials into structured chapters
  const getChapters = (): Chapter[] => {
    console.log('Generating chapters structure...');
    
    // Define chapter structure with consistent images and descriptions
    const chapterStructure: Chapter[] = [
      {
        number: 1,
        title: "Introduction to Digital Marketing",
        description: "Basic concepts and fundamentals of digital marketing for beginners",
        image: "attached_assets/smallbusinessspelled.jpeg",
        icon: <BookOpen className="h-6 w-6 text-blue-500" />,
        tutorials: []
      },
      {
        number: 2,
        title: "Google Ads Fundamentals",
        description: "Core concepts of Google Ads platform and campaign types",
        image: "attached_assets/ad-image.jpeg",
        icon: <Megaphone className="h-6 w-6 text-red-500" />,
        tutorials: []
      },
      {
        number: 3,
        title: "Advanced Google Ads",
        description: "Advanced strategies and optimization techniques for Google Ads",
        image: "attached_assets/womanwork.jpeg",
        icon: <Globe className="h-6 w-6 text-green-500" />,
        tutorials: []
      },
      {
        number: 4,
        title: "Marketing Objectives & Testing",
        description: "Setting goals, testing methodologies, and strategic planning",
        image: "attached_assets/small business.jpeg",
        icon: <FileText className="h-6 w-6 text-purple-500" />,
        tutorials: []
      },
      {
        number: 5,
        title: "Analytics & Measurement",
        description: "Data analytics, performance tracking, and insights interpretation",
        image: "attached_assets/group-thinking.jpeg",
        icon: <BarChart3 className="h-6 w-6 text-yellow-500" />,
        tutorials: []
      },
      {
        number: 6,
        title: "Marketing Channels & Strategies",
        description: "Email marketing, social media, and channel integration",
        image: "attached_assets/wiered-headshot.jpeg",
        icon: <Megaphone className="h-6 w-6 text-indigo-500" />,
        tutorials: []
      },
      {
        number: 7,
        title: "SEO Mastery",
        description: "Search engine optimization from basic to advanced techniques",
        image: "attached_assets/seo-visual.jpeg", 
        icon: <Search className="h-6 w-6 text-teal-500" />,
        tutorials: []
      },
      {
        number: 8,
        title: "Troubleshooting & Best Practices",
        description: "Problem-solving techniques and industry best practices",
        image: "attached_assets/cart-with-packages.jpeg",
        icon: <HelpCircle className="h-6 w-6 text-orange-500" />,
        tutorials: []
      }
    ];
    
    // Log each tutorial for debugging
    tutorials.forEach((tutorial, idx) => {
      console.log(`DEBUG - Tutorial ${idx+1}:`, {
        id: tutorial.id,
        title: tutorial.title,
        chapterNumber: (tutorial as any).chapterNumber,
      });
    });
    
    // Sort all tutorials using their chapter classification from backend
    tutorials.forEach(tutorial => {
      // Try to use the chapterNumber property first (added by backend)
      let chapterNum = (tutorial as any).chapterNumber;
      
      // If no chapterNumber from backend, extract from content
      if (!chapterNum) {
        const titleLower = tutorial.title.toLowerCase();
        const contentLower = tutorial.content.toLowerCase();
        
        // Try to match chapter patterns in title or content
        const chapterMatch = titleLower.match(/chapter\s*(\d+)[\-\.]?(\d+)?/i) || 
                           contentLower.match(/chapter\s*(\d+)[\-\.]?(\d+)?/i);
        
        if (chapterMatch) {
          chapterNum = parseInt(chapterMatch[1]);
        }
      }
      
      // If we have a chapter number, try to place in matching chapter
      if (chapterNum) {
        const chapter = chapterStructure.find(c => c.number === chapterNum);
        if (chapter) {
          chapter.tutorials.push(tutorial);
          return; // Skip further checks after assigning to chapter
        }
      }
      
      // If no chapter number found or matching chapter, use content-based heuristics
      const titleLower = tutorial.title.toLowerCase();
      const contentLower = tutorial.content.toLowerCase();
      
      if (titleLower.includes('seo') || contentLower.includes('search engine optimization')) {
        chapterStructure[6].tutorials.push(tutorial); // SEO - Chapter 7
      } else if (titleLower.includes('troubleshoot') || contentLower.includes('troubleshoot')) {
        chapterStructure[7].tutorials.push(tutorial); // Troubleshooting - Chapter 8
      } else if (titleLower.includes('analytics') || titleLower.includes('data') || 
                 contentLower.includes('analytics') || contentLower.includes('measurement')) {
        chapterStructure[4].tutorials.push(tutorial); // Analytics - Chapter 5
      } else if (titleLower.includes('email') || titleLower.includes('social media') || 
                 contentLower.includes('email marketing') || contentLower.includes('social media')) {
        chapterStructure[5].tutorials.push(tutorial); // Marketing Channels - Chapter 6
      } else if (titleLower.includes('advanced') && 
                (titleLower.includes('google ads') || titleLower.includes('campaign'))) {
        chapterStructure[2].tutorials.push(tutorial); // Advanced Google Ads - Chapter 3
      } else if (titleLower.includes('google ads') || titleLower.includes('campaign') || 
                 contentLower.includes('google ads')) {
        chapterStructure[1].tutorials.push(tutorial); // Google Ads Fundamentals - Chapter 2
      } else if (titleLower.includes('goal') || titleLower.includes('testing') || 
                 contentLower.includes('goal setting') || contentLower.includes('testing methodologies')) {
        chapterStructure[3].tutorials.push(tutorial); // Marketing Objectives - Chapter 4
      } else {
        // Default to Introduction chapter for unmatched content
        chapterStructure[0].tutorials.push(tutorial);
      }
    });
    
    // Add console debug to check tutorial distribution
    console.log('Tutorial distribution by chapter:');
    chapterStructure.forEach(chapter => {
      console.log(`Chapter ${chapter.number}: ${chapter.tutorials.length} tutorials`);
    });
    
    // Return all chapters, even if empty (for debugging purposes)
    return chapterStructure
      .map(chapter => ({
        ...chapter,
        tutorials: sortTutorialsByChapter(chapter.tutorials)
      }));
  };

  // Start tutorial function
  const startTutorial = (tutorial: Tutorial) => {
    setCurrentTutorial(tutorial);
    window.scrollTo(0, 0);
  };

  // Render a tutorial card
  const renderTutorialCard = (tutorial: Tutorial) => {
    const isCompleted = progress.includes(tutorial.id);
    
    return (
      <Card key={tutorial.id} className="flex flex-col h-full border border-[#ffd700]/20 bg-[#111]/80 shadow-md overflow-hidden relative hover:border-[#ffd700]/50 transition-all duration-300">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="w-full">
              <div className="flex justify-between mb-1">
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
                {isCompleted && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-[#ffd700] line-clamp-2">{tutorial.title}</h3>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4 pt-0">
          <div className="text-xs text-gray-400 mb-2">
            Estimated time: {tutorial.estimatedTime || 60} min
          </div>
          
          {tutorial.skillsLearned && tutorial.skillsLearned.length > 0 && (
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-1">Skills:</div>
              <div className="flex flex-wrap gap-1">
                {tutorial.skillsLearned.slice(0, 2).map((skill, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-[#ffd700]/10 text-[#ffd700] rounded">
                    {skill.length > 20 ? skill.substring(0, 20) + '...' : skill}
                  </span>
                ))}
                {tutorial.skillsLearned.length > 2 && (
                  <span className="text-xs px-2 py-1 bg-[#ffd700]/10 text-[#ffd700] rounded">
                    +{tutorial.skillsLearned.length - 2} more
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
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-2">
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

  // Calculate overall progress percentage
  const getOverallProgress = () => {
    if (tutorials.length === 0) return 0;
    return Math.round((progress.length / tutorials.length) * 100);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#ffd700] flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#ffd700] text-black flex items-center justify-center mr-3 text-sm">DZ</span>
              Marketing Academy
            </h1>
            <p className="text-muted-foreground mt-2">
              Follow our structured learning path from fundamentals to mastery
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium">Your Progress:</span>
              <span className="text-[#ffd700] font-semibold">{getOverallProgress()}%</span>
            </div>
            <div className="w-48">
              <Progress value={getOverallProgress()} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {progress.length}/{tutorials.length} tutorials completed
            </p>
          </div>
        </div>

        <Separator className="my-4 border-[#ffd700]/20" />
        
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
                <TutorialContentRenderer 
                  content={currentTutorial.content} 
                  chapterNumber={(currentTutorial as any).chapterNumber}
                  tutorialIndex={(currentTutorial as any).lessonNumber} 
                />
              </div>

              <div className="mt-6 mb-2">
                <MicroFeedback 
                  contentType="tutorial"
                  contentId={currentTutorial.id}
                  context={`Tutorial: ${currentTutorial.title}`}
                  className="justify-end"
                />
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
            <div className="space-y-12">
              {getChapters().map((chapter) => (
                <div key={chapter.number} className="rounded-xl overflow-hidden bg-[#111]/60 shadow-lg border border-[#ffd700]/10 hover:border-[#ffd700]/20 transition-all duration-300">
                  <div className="relative h-48 md:h-60 overflow-hidden">
                    <img 
                      src={chapter.image} 
                      alt={`Chapter ${chapter.number}: ${chapter.title}`} 
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center flex-col p-6 hover:bg-black/40 transition-all duration-300">
                      <div className="mb-2 rounded-full bg-[#ffd700] p-2">
                        {chapter.icon}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                        Chapter {chapter.number}: {chapter.title}
                      </h2>
                      <p className="text-white/80 text-center mt-2 max-w-2xl">
                        {chapter.description}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-[#ffd700]">Lessons in This Chapter</h3>
                      <span className="text-sm text-gray-400">
                        {chapter.tutorials.length} {chapter.tutorials.length === 1 ? 'lesson' : 'lessons'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {chapter.tutorials.length > 0 ? 
                        chapter.tutorials.map(tutorial => renderTutorialCard(tutorial)) : 
                        <div className="col-span-3 p-8 text-center bg-[#222]/50 rounded-lg border border-dashed border-[#ffd700]/20">
                          <h4 className="text-[#ffd700] font-medium mb-2">Coming Soon</h4>
                          <p className="text-gray-400 text-sm">New tutorials for this chapter are being prepared and will be available soon!</p>
                        </div>
                      }
                    </div>
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