import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Search, 
  BarChart3, 
  Globe, 
  Megaphone, 
  FileText, 
  HelpCircle,
  CheckCircle2,
  Cpu,
  MessageSquare,
  Columns,
  Sparkles,
  Headphones,
  Flame,
  Lock,
  Play,
  Coffee
} from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import TutorialContentRenderer from '../components/TutorialContentRenderer';
import { MicroFeedback } from '@/components/ui/micro-feedback';
import { SocraticChatClassroom } from '@/components/SocraticChatClassroom';
import { CrisisDispatchHub } from '@/components/CrisisDispatchHub';
import { useAuth } from '@/context/AuthContext';
import { CourseLockModal } from '@/components/CourseLockModal';
import { AcademyOrientationTour } from '@/components/AcademyOrientationTour';

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
  chapterNumber?: number;
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
  const [learningMode, setLearningMode] = useState<'study_guide' | 'listen' | 'conversational'>('conversational');
  const [isCrisisHubOpen, setIsCrisisHubOpen] = useState(false);
  const { user, isDeveloper } = useAuth();
  const isDevUser = isDeveloper || 
                    user?.username?.toLowerCase() === 'katycat13' || 
                    user?.email?.toLowerCase().includes('katycat') || 
                    (user as any)?.isDeveloper;
  const [lockModalConfig, setLockModalConfig] = useState<{
    isOpen: boolean;
    requiredTier: "course1" | "course2";
    title: string;
    desc: string;
  }>({
    isOpen: false,
    requiredTier: "course1",
    title: "",
    desc: ""
  });

  const hasCourse1 = user?.level?.toLowerCase()?.includes('agency') || user?.level?.toLowerCase()?.includes('director') || false;
  const hasCourse2 = user?.level?.toLowerCase()?.includes('director') || false;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    const handleStartBriefing = () => {
      if (tutorials.length > 0) {
        setCurrentTutorial(tutorials[0]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener("start-chapter-briefing", handleStartBriefing);
    return () => window.removeEventListener("start-chapter-briefing", handleStartBriefing);
  }, [tutorials]);

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
        
        // Auto-select tutorial if specified in URL query params (?tutorialId=X or ?id=X)
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const targetId = urlParams.get('tutorialId') || urlParams.get('id');
          if (targetId) {
            const match = sortedTutorials.find(t => t.id === parseInt(targetId));
            if (match) {
              setCurrentTutorial(match);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        } catch (e) {
          console.warn("Could not parse tutorialId param", e);
        }
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
    if (typeof tutorial.chapterNumber === 'number' && tutorial.chapterNumber > 0) {
      return tutorial.chapterNumber;
    }

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
    if (titleLower.includes('content marketing') || 
        titleLower.includes('ai-powered') || 
        contentLower.includes('content marketing') ||
        contentLower.includes('ai-powered seo')) {
      return 9; // Content Marketing & AI belongs to Chapter 9
    } else if (titleLower.includes('ai in digital marketing') || 
              titleLower.includes('ai marketing') || 
              titleLower.includes('artificial intelligence') || 
              contentLower.includes('ai revolution') || 
              contentLower.includes('ai shift') || 
              contentLower.includes('democratization of technology') ||
              contentLower.includes('ai benefits') ||
              contentLower.includes('ai in marketing')) {
      return 10; // AI in Digital Marketing belongs to Chapter 10
    } else if (titleLower.includes('advanced analytics') || 
              titleLower.includes('attribution') || 
              contentLower.includes('advanced analytics') ||
              contentLower.includes('attribution model')) {
      return 11; // Advanced Analytics & Attribution belongs to Chapter 11
    } else if (titleLower.includes('seo') || contentLower.includes('search engine optimization')) {
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
  const sortTutorialsByChapter = (tutorialList: Tutorial[]): Tutorial[] => {
    return [...tutorialList].sort((a, b) => {
      // First sort by chapter number
      const aChapter = extractChapterNumber(a);
      const bChapter = extractChapterNumber(b);
      
      if (aChapter !== bChapter) {
        return aChapter - bChapter;
      }
      
      // If same chapter, extract subchapter numbers from title first
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      
      const aTitleMatch = aTitle.match(/chapter\s*\d+[\-\.](\d+)/i);
      const bTitleMatch = bTitle.match(/chapter\s*\d+[\-\.](\d+)/i);

      if (aTitleMatch && bTitleMatch) {
        return parseInt(aTitleMatch[1]) - parseInt(bTitleMatch[1]);
      }
      
      const aMatch = aTitleMatch || a.content.toLowerCase().match(/chapter\s*\d+[\-\.](\d+)/i);
      const bMatch = bTitleMatch || b.content.toLowerCase().match(/chapter\s*\d+[\-\.](\d+)/i);
      
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
        title: "Week 1: Marketing Fundamentals, Unit Economics & The High-Converting Offer",
        description: "Unit economics, AOV/CAC modeling, client discovery with Jenny Miller, headline clarity, and live A/B testing on Jenny's Artisan Java.",
        image: "attached_assets/smallbusinessspelled.jpeg",
        icon: <BookOpen className="h-6 w-6 text-blue-500" />,
        tutorials: []
      },
      {
        number: 2,
        title: "Week 2: Organic Discovery, On-Page SEO & Local Business Presence",
        description: "Search intent, long-tail keyword research, on-page meta tags (Title, H1, Meta Description), Google Business Profile, and ethical AI content creation.",
        image: "attached_assets/womanwork.jpeg",
        icon: <Globe className="h-6 w-6 text-green-500" />,
        tutorials: []
      },
      {
        number: 3,
        title: "Week 3: Paid Search Advertising (Google Search Ads 101)",
        description: "The second-price ad auction, 3-tier account hierarchy, match types, the negative keyword budget shield, RSA copywriting, and Quality Score discounts.",
        image: "attached_assets/ad-image.jpeg",
        icon: <Megaphone className="h-6 w-6 text-red-500" />,
        tutorials: []
      },
      {
        number: 4,
        title: "Week 4: Paid Social & Creative Advertising (Meta / Instagram Ads 101)",
        description: "Active search vs passive interruption, the 3-second hook, visual creative formats, Meta ad copywriting, audience targeting, and identifying ad fatigue.",
        image: "attached_assets/small business.jpeg",
        icon: <Sparkles className="h-6 w-6 text-purple-400" />,
        tutorials: []
      },
      {
        number: 5,
        title: "Week 5: Email Marketing, Customer Retention & Funnel Psychology",
        description: "Owned media vs rented land, email list building, automated 3-part welcome sequences, abandoned cart recovery, copywriting, and CAN-SPAM compliance.",
        image: "attached_assets/group-thinking.jpeg",
        icon: <Cpu className="h-6 w-6 text-amber-400" />,
        tutorials: []
      },
      {
        number: 6,
        title: "Week 6: Analytics, Conversion Optimization, Agency Reporting & Capstone Certification",
        description: "GA4 traffic attribution, UTM tracking, funnel bottleneck drop-off diagnostics, 1-page executive client reporting, and the Level 1 Boardroom Audit.",
        image: "attached_assets/wiered-headshot.jpeg",
        icon: <CheckCircle2 className="h-6 w-6 text-emerald-400" />,
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
      },
      {
        number: 9,
        title: "Content Marketing & AI",
        description: "Content strategy and using AI for SEO content optimization",
        image: "attached_assets/seo-visual.jpeg",
        icon: <FileText className="h-6 w-6 text-blue-500" />,
        tutorials: []
      },
      {
        number: 10,
        title: "AI in Digital Marketing",
        description: "Leveraging artificial intelligence to transform your marketing strategy",
        image: "attached_assets/group-thinking.jpeg",
        icon: <Cpu className="h-6 w-6 text-green-500" />,
        tutorials: []
      },
      {
        number: 11,
        title: "Advanced Analytics & Attribution",
        description: "Master advanced analytics including multi-touch attribution models",
        image: "attached_assets/group-thinking.jpeg",
        icon: <BarChart3 className="h-6 w-6 text-purple-500" />,
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
      
      if (titleLower.includes('content marketing') || 
          titleLower.includes('ai-powered') || 
          contentLower.includes('content marketing') ||
          contentLower.includes('ai-powered seo')) {
        chapterStructure[8].tutorials.push(tutorial); // Content Marketing & AI - Chapter 9
      } else if (titleLower.includes('ai in digital marketing') || 
                titleLower.includes('ai marketing') || 
                titleLower.includes('artificial intelligence') || 
                contentLower.includes('ai revolution') || 
                contentLower.includes('ai shift') || 
                contentLower.includes('democratization of technology') ||
                contentLower.includes('ai benefits') ||
                contentLower.includes('ai in marketing')) {
        chapterStructure[9].tutorials.push(tutorial); // AI in Digital Marketing - Chapter 10
      } else if (titleLower.includes('advanced analytics') || 
                titleLower.includes('attribution') || 
                contentLower.includes('advanced analytics') ||
                contentLower.includes('attribution model')) {
        chapterStructure[10].tutorials.push(tutorial); // Advanced Analytics - Chapter 11
      } else if (titleLower.includes('seo') || contentLower.includes('search engine optimization')) {
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

  // Render a tutorial card with sequential locking
  const renderTutorialCard = (
    tutorial: Tutorial,
    index: number = 0,
    chapterTutorials: Tutorial[] = [],
    chapterNumber: number = 1,
    allChapters: Chapter[] = [],
    chapterIndex: number = 0
  ) => {
    const isCompleted = progress.includes(tutorial.id);
    
    // Sequential locking logic:
    // 1. If completed, student can always re-open to review notes.
    // 2. Week 1, Lesson 1 (index 0 of Chapter 1) is unlocked by default for all students.
    // 3. For any subsequent lesson in the chapter, the prior lesson in this chapter must be completed.
    // 4. For subsequent chapters (Week 2+), the prior chapter must have all its lessons completed.
    let isLocked = false;
    let lockReason = "";

    if (!isCompleted) {
      if (chapterIndex > 0 && allChapters.length > 0) {
        const prevChapter = allChapters[chapterIndex - 1];
        const isPrevChapterComplete = prevChapter && prevChapter.tutorials.length > 0 &&
          prevChapter.tutorials.every(t => progress.includes(t.id));
        if (!isPrevChapterComplete) {
          isLocked = true;
          lockReason = `Complete Week ${prevChapter.number} first`;
        }
      }

      if (!isLocked && index > 0 && chapterTutorials.length > 0) {
        const priorLesson = chapterTutorials[index - 1];
        if (!progress.includes(priorLesson.id)) {
          isLocked = true;
          const priorNumMatch = priorLesson.title.match(/Chapter\s*(\d+[\-\.]\d+)/i);
          lockReason = priorNumMatch ? `Complete Lesson ${priorNumMatch[1]} first` : `Complete previous lesson first`;
        }
      }
    }
    
    return (
      <Card key={tutorial.id} className={`flex flex-col h-full border ${isLocked ? 'border-border/30 bg-[#111]/40 opacity-75' : 'border-[#ffd700]/20 bg-[#111]/80 hover:border-[#ffd700]/50'} shadow-md overflow-hidden relative transition-all duration-300`}>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="w-full">
              <div className="flex justify-between items-center mb-1">
                {tutorial.level && (
                  <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full mb-2 ${
                    isLocked ? 'bg-secondary/40 text-muted-foreground' :
                    tutorial.level.toLowerCase().includes('beginner') ? 'bg-green-100 text-green-800' :
                    tutorial.level.toLowerCase().includes('intermediate') ? 'bg-blue-100 text-blue-800' :
                    tutorial.level.toLowerCase().includes('advanced') ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {tutorial.level}
                  </span>
                )}
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : isLocked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-secondary/80 text-muted-foreground border border-border/40 mb-2">
                    <Lock className="h-3 w-3" /> Locked
                  </span>
                ) : null}
              </div>
              <h3 className={`text-lg font-semibold ${isLocked ? 'text-gray-400' : 'text-[#ffd700]'} line-clamp-2`}>{tutorial.title}</h3>
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
          {isLocked ? (
            <Button
              disabled
              className="w-full bg-secondary/40 text-muted-foreground border border-border/40 cursor-not-allowed opacity-80 text-xs font-semibold"
            >
              <Lock className="h-3.5 w-3.5 mr-1.5" />
              <span>{lockReason || 'Locked - Complete Prior Lesson'}</span>
            </Button>
          ) : (
            <Button
              onClick={() => startTutorial(tutorial)}
              className="w-full relative overflow-hidden group"
              variant={isCompleted ? "outline" : "default"}
            >
              <span className="absolute inset-0 w-0 bg-[#ffd700]/10 transition-all duration-300 group-hover:w-full"></span>
              <span className="relative flex items-center justify-center gap-1.5">
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Review Lesson</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Start Lesson</span>
                  </>
                )}
              </span>
            </Button>
          )}
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-amber-500 text-primary-foreground flex items-center justify-center mr-3 text-xs font-bold shadow-md shadow-primary/20">KA</span>
              <span>Krechet Academy</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Follow our structured learning path from fundamentals to mastery
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Button
              onClick={() => setIsCrisisHubOpen(true)}
              className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs h-8 px-3 rounded-xl shadow-lg border border-red-500/40 flex items-center gap-1.5 animate-pulse"
              title="Open the Agency Crisis Dispatch Room (3 Fire Drills Per Week)"
            >
              <Flame className="h-3.5 w-3.5 text-amber-200" />
              <span>🚨 Crisis Dispatch Room (3/Wk)</span>
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Your Progress:</span>
              <span className="text-[#ffd700] font-semibold">{getOverallProgress()}%</span>
            </div>
            <div className="w-48">
              <Progress value={getOverallProgress()} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
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
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-3 sm:p-5 md:p-6 mb-6 shadow-2xl">
              {/* Header with Title and Mode Switcher */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Badge variant="outline" className="text-[11px] font-semibold px-2.5 py-0.5 bg-primary/10 text-primary border-primary/30">
                      Level: {currentTutorial.level}
                    </Badge>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10">
                      ⏱️ {currentTutorial.estimatedTime || 45} mins
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                    {currentTutorial.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-start md:self-auto justify-end flex-wrap">
                  <Button
                    onClick={() => setIsCrisisHubOpen(true)}
                    className="bg-red-600/90 hover:bg-red-500 text-white font-bold text-xs h-8 px-2.5 rounded-lg border border-red-500/40 flex items-center gap-1.5"
                    title="Open Agency Crisis Dispatch Room"
                  >
                    <Flame className="h-3 w-3 text-amber-300 animate-pulse" />
                    <span>🚨 Weekly Crisis Calls (3/Wk)</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentTutorial(null)}
                    className="border-white/10 text-muted-foreground hover:text-foreground text-xs h-8"
                  >
                    Back to Syllabus
                  </Button>
                </div>
              </div>

              {/* Learning Style Chooser: "How do you learn best? Pick an option below. This can be switched whenever." */}
              <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/10 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span>How do you learn best? Pick an option below.</span>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      This can be switched whenever.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[11px] font-mono text-primary border-primary/30 bg-primary/10 self-start sm:self-auto">
                    {learningMode === 'study_guide' && '📖 Study Guide Active'}
                    {learningMode === 'listen' && '🎧 Listen to the Lesson Active'}
                    {learningMode === 'conversational' && '🎙️ Conversational Active'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: Study Guide */}
                  <button
                    type="button"
                    onClick={() => setLearningMode('study_guide')}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                      learningMode === 'study_guide'
                        ? 'bg-primary/15 border-primary text-foreground shadow-md ring-1 ring-primary/50'
                        : 'bg-card/40 border-border/70 text-muted-foreground hover:bg-card/80 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                      <BookOpen className="h-4 w-4 text-primary shrink-0" />
                      <span>Study Guide</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Self-paced written notes, key formulas, diagrams & tactical steps.
                    </p>
                  </button>

                  {/* Option 2: Listen to the Lesson */}
                  <button
                    type="button"
                    onClick={() => setLearningMode('listen')}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                      learningMode === 'listen'
                        ? 'bg-primary/15 border-primary text-foreground shadow-md ring-1 ring-primary/50'
                        : 'bg-card/40 border-border/70 text-muted-foreground hover:bg-card/80 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                      <Headphones className="h-4 w-4 text-primary shrink-0" />
                      <span>Listen to the Lesson</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Read-aloud audio narration of the lesson powered by Deepgram Aura.
                    </p>
                  </button>

                  {/* Option 3: Conversational */}
                  <button
                    type="button"
                    onClick={() => setLearningMode('conversational')}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                      learningMode === 'conversational'
                        ? 'bg-primary/15 border-primary text-foreground shadow-md ring-1 ring-primary/50'
                        : 'bg-card/40 border-border/70 text-muted-foreground hover:bg-card/80 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                      <MessageSquare className="h-4 w-4 text-primary shrink-0" />
                      <span>Conversational</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      1-on-1 talk with your instructor via Gemini Live bidirectional voice or chat.
                    </p>
                  </button>
                </div>
              </div>

              {/* Dynamic Learning Modes */}
              {learningMode === 'study_guide' && (
                <div className="prose prose-invert max-w-none p-4 sm:p-6 rounded-xl bg-slate-950/60 border border-white/10 text-slate-200 shadow-xl">
                  <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Study Guide & Reference Notes</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                      Self-Paced Reading
                    </Badge>
                  </div>
                  <TutorialContentRenderer 
                    content={currentTutorial.content} 
                    chapterNumber={(currentTutorial as any).chapterNumber}
                    tutorialIndex={(currentTutorial as any).lessonNumber}
                    hideAudioBar={true}
                  />
                </div>
              )}

              {learningMode === 'listen' && (
                <div className="prose prose-invert max-w-none p-4 sm:p-6 rounded-xl bg-slate-950/60 border border-white/10 text-slate-200 shadow-xl">
                  <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Headphones className="h-4 w-4 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Listen to the Lesson</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-primary/10">
                      Read-Aloud Narration
                    </Badge>
                  </div>
                  <TutorialContentRenderer 
                    content={currentTutorial.content} 
                    chapterNumber={(currentTutorial as any).chapterNumber}
                    tutorialIndex={(currentTutorial as any).lessonNumber}
                    hideAudioBar={false}
                  />
                </div>
              )}

              {learningMode === 'conversational' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Interactive Socratic Chat Classroom */}
                  <div className="lg:col-span-6 xl:col-span-5 space-y-4">
                    <SocraticChatClassroom
                      tutorialId={currentTutorial.id}
                      lessonTitle={currentTutorial.title}
                      lessonLevel={currentTutorial.level}
                      chapterNumber={(currentTutorial as any).chapterNumber || 1}
                      simulationLink={(currentTutorial as any).chapterNumber === 2 ? "/ad-simulation/1" : (currentTutorial as any).chapterNumber >= 4 ? "/capstone-simulation" : "/seo-simulation/1"}
                      simulationName={(currentTutorial as any).chapterNumber === 2 ? "Dr. Miller Dental (Paid Search Auction)" : (currentTutorial as any).chapterNumber >= 4 ? "Apex Global Growth Capstone Simulation" : "Jenny's Artisan Java (CMS On-Page Repair)"}
                      playbookContent={currentTutorial.content}
                      isSplitView={true}
                      onMasteryAchieved={async () => {
                        try {
                          await fetch('/api/tutorials/complete', {
                            method: 'POST',
                            body: JSON.stringify({ tutorialId: currentTutorial.id }),
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include'
                          });
                          setProgress(prev => Array.from(new Set([...prev, currentTutorial.id])));
                        } catch (err) {
                          console.error('Failed to mark tutorial complete on mastery:', err);
                        }
                      }}
                    />
                  </div>

                  {/* Right Column: Study Guide & Reference Notes */}
                  <div className="lg:col-span-6 xl:col-span-7 prose prose-invert max-w-none p-4 sm:p-6 rounded-xl bg-slate-950/60 border border-white/10 text-slate-200 shadow-xl max-h-[850px] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3 sticky top-0 bg-slate-950/95 backdrop-blur z-10 -mt-2 pt-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Study Guide Reference Notes</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                        Referenced by Instructor
                      </Badge>
                    </div>
                    <TutorialContentRenderer 
                      content={currentTutorial.content} 
                      chapterNumber={(currentTutorial as any).chapterNumber}
                      tutorialIndex={(currentTutorial as any).lessonNumber}
                      hideAudioBar={true}
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 mb-2">
                <MicroFeedback 
                  contentType="tutorial"
                  contentId={currentTutorial.id}
                  context={`Tutorial: ${currentTutorial.title}`}
                  className="justify-end"
                />
              </div>

              {/* Seamless Course Flow: Week Lesson Strip + Previous / Simulation / Next Navigation Strip */}
              {(() => {
                const currentChapterNum = (currentTutorial as any).chapterNumber || 1;
                // Strictly sort chapter tutorials by subchapter number (e.g. 1.1, 1.2, 1.3, 1.4, 1.5...)
                const chapterTutorials = tutorials
                  .filter(t => ((t as any).chapterNumber || 1) === currentChapterNum)
                  .sort((a, b) => {
                    const aTitleMatch = a.title.match(/chapter\s*\d+[\-\.](\d+)/i);
                    const bTitleMatch = b.title.match(/chapter\s*\d+[\-\.](\d+)/i);
                    if (aTitleMatch && bTitleMatch) {
                      return parseInt(aTitleMatch[1]) - parseInt(bTitleMatch[1]);
                    }
                    return a.id - b.id;
                  });

                const currentChapterIndex = chapterTutorials.findIndex(t => t.id === currentTutorial.id);
                const prevTutorial = currentChapterIndex > 0 ? chapterTutorials[currentChapterIndex - 1] : null;
                const nextTutorial = currentChapterIndex >= 0 && currentChapterIndex < chapterTutorials.length - 1 ? chapterTutorials[currentChapterIndex + 1] : null;
                const isLastLessonOfWeek = chapterTutorials.length > 0 && chapterTutorials[chapterTutorials.length - 1].id === currentTutorial.id;
                const isWeekCompleted = chapterTutorials.length > 0 && chapterTutorials.every(t => progress.includes(t.id));
                const weekSimLink = currentChapterNum === 2 ? "/ad-simulation/1" : currentChapterNum >= 4 ? "/capstone-simulation" : "/seo-simulation/1";
                const weekSimName = currentChapterNum === 2 ? "Week 2: Dr. Miller Dental (Paid Search)" : currentChapterNum >= 4 ? "Week 6: Apex Global Growth Capstone" : "Week 1: Jenny's Artisan Java (CMS SEO)";

                return (
                  <div className="space-y-4 mt-8">
                    {/* Week Lesson Navigator Track (Directly inspect all 15 lessons) */}
                    {chapterTutorials.length > 1 && (
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/70 border border-white/10 shadow-lg">
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-3.5 w-3.5 text-primary" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                              Week {currentChapterNum} Syllabus • {chapterTutorials.length} Bite-Sized Lessons (Learn → See → Do)
                            </span>
                          </div>
                          <Badge variant="outline" className="text-[10px] text-primary border-primary/30 bg-primary/10">
                            Lesson {currentChapterIndex >= 0 ? currentChapterIndex + 1 : 1} of {chapterTutorials.length}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {chapterTutorials.map((tut, idx) => {
                            const isCurrent = tut.id === currentTutorial.id;
                            const isDone = progress.includes(tut.id);
                            const subMatch = tut.title.match(/chapter\s*(\d+[\-\.]\d+)/i);
                            const label = subMatch ? subMatch[1] : `${currentChapterNum}.${idx + 1}`;
                            const typeTag = tut.title.includes('(Learn)') ? 'Learn' : tut.title.includes('(See') ? 'See & AI' : tut.title.includes('(Do)') ? 'Do' : `L${idx+1}`;

                            return (
                              <button
                                key={tut.id}
                                type="button"
                                onClick={() => {
                                  setCurrentTutorial(tut);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                title={tut.title}
                                className={`px-2 py-1.5 rounded-lg border text-center transition-all flex items-center gap-1.5 text-xs ${
                                  isCurrent
                                    ? 'bg-primary/25 border-primary text-primary-foreground font-extrabold shadow-md ring-1 ring-primary/60 scale-105'
                                    : isDone
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                    : 'bg-card/40 border-border/60 text-muted-foreground hover:bg-card/80 hover:text-foreground'
                                }`}
                              >
                                {isDone && <span className="text-[10px] text-emerald-400">✓</span>}
                                <span className="font-semibold">{label}</span>
                                <span className={`text-[10px] px-1 py-0.2 rounded ${
                                  isCurrent ? 'bg-primary/40 text-white' : 'bg-secondary/60 text-muted-foreground'
                                }`}>
                                  {typeTag}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons Strip */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
                      {/* Previous Lesson Button */}
                      <Button 
                        variant="outline"
                        disabled={!prevTutorial}
                        onClick={() => {
                          if (prevTutorial) {
                            setCurrentTutorial(prevTutorial);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="w-full md:w-auto text-xs h-11 border-border hover:bg-secondary flex items-center gap-2 px-3 sm:px-4"
                      >
                        <span className="text-sm">⬅️</span>
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                            {prevTutorial ? (prevTutorial.title.match(/Chapter\s*(\d+[\-\.]\d+)/i) ? `Previous: ${prevTutorial.title.match(/Chapter\s*(\d+[\-\.]\d+)/i)![1]}` : 'Previous Lesson') : 'First Lesson'}
                          </span>
                          <span className="truncate max-w-[170px] font-bold text-xs text-foreground">
                            {prevTutorial ? prevTutorial.title.replace(/^Chapter\s*\d+[\-\.]\d+:\s*/i, '') : 'Start of Week'}
                          </span>
                        </div>
                      </Button>

                      {/* Week's Simulation Workbench (Available throughout the week) */}
                      <Button
                        asChild
                        className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs h-11 px-4 shadow-lg flex items-center gap-2"
                        title="Practice client simulation workbench — available throughout the week"
                      >
                        <Link href={weekSimLink}>
                          <span>🛠️</span>
                          <span>{weekSimName} (Open All Week)</span>
                        </Link>
                      </Button>

                      {/* Weekly Assessment Quiz Button - Only unlocked at end of week once week's lessons are completed */}
                      {(isLastLessonOfWeek || isWeekCompleted) ? (
                        <Button
                          asChild
                          className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs h-11 px-4 shadow-md flex items-center gap-1.5 animate-pulse"
                          title="End-of-Week Assessment Quiz"
                        >
                          <Link href="/seo-quiz">
                            <span>📝</span>
                            <span>Take Week {currentChapterNum} Assessment Quiz</span>
                          </Link>
                        </Button>
                      ) : (
                        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-muted-foreground/80 italic px-3 py-2 bg-secondary/30 rounded-lg border border-border/50">
                          <span>🔒</span>
                          <span>Assessment unlocks after Lesson {chapterTutorials.length}</span>
                        </div>
                      )}

                      {/* Next Lesson / Complete Button */}
                      {nextTutorial ? (
                        <Button 
                          onClick={async () => {
                            try {
                              await fetch('/api/tutorials/complete', {
                                method: 'POST',
                                body: JSON.stringify({ tutorialId: currentTutorial.id }),
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include' 
                              });
                              await fetchProgress();
                            } catch (e) {}
                            setCurrentTutorial(nextTutorial);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-11 flex items-center gap-2 px-3 sm:px-4 shadow-lg"
                        >
                          <div className="flex flex-col text-left">
                            <span className="text-[10px] text-primary-foreground/80 uppercase font-semibold">
                              {nextTutorial.title.match(/Chapter\s*(\d+[\-\.]\d+)/i) ? `Next: ${nextTutorial.title.match(/Chapter\s*(\d+[\-\.]\d+)/i)![1]}` : 'Next Lesson'}
                            </span>
                            <span className="truncate max-w-[190px] font-extrabold text-xs">
                              {nextTutorial.title.replace(/^Chapter\s*\d+[\-\.]\d+:\s*/i, '')}
                            </span>
                          </div>
                          <span className="text-sm">➡️</span>
                        </Button>
                      ) : (
                        <Button 
                          onClick={async () => {
                            try {
                              await fetch('/api/tutorials/complete', {
                                method: 'POST',
                                body: JSON.stringify({ tutorialId: currentTutorial.id }),
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include' 
                              });
                              await fetchProgress();
                            } catch (e) {}
                            setCurrentTutorial(null);
                          }}
                          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-11 px-4"
                        >
                          <span>🎉 Complete & Return to Syllabus</span>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="space-y-12">
              {getChapters().map((chapter, chapterIdx, allChaptersList) => (
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
                        chapter.tutorials.map((tutorial, idx) => renderTutorialCard(tutorial, idx, chapter.tutorials, chapter.number, allChaptersList, chapterIdx)) : 
                        <div className="col-span-3 p-8 text-center bg-[#222]/50 rounded-lg border border-dashed border-[#ffd700]/20">
                          <h4 className="text-[#ffd700] font-medium mb-2">Coming Soon</h4>
                          <p className="text-gray-400 text-sm">New tutorials for this chapter are being prepared and will be available soon!</p>
                        </div>
                      }
                    </div>

                    {/* Chapter Weekly Simulation & Assessment Action Strip */}
                    {chapter.tutorials.length > 0 && (() => {
                      const simLink = chapter.number === 2 ? "/ad-simulation/1" : chapter.number >= 4 ? "/capstone-simulation" : "/seo-simulation/1";
                      const simName = chapter.number === 2 ? "Dr. Miller Dental (Paid Search)" : chapter.number >= 4 ? "Apex Global Growth Capstone" : "Jenny's Artisan Java (CMS SEO)";
                      const completedCount = chapter.tutorials.filter(t => progress.includes(t.id)).length;
                      const allCompleted = completedCount === chapter.tutorials.length && chapter.tutorials.length > 0;

                      return (
                        <div className="mt-6 pt-4 border-t border-[#ffd700]/15 flex flex-wrap items-center justify-between gap-3 bg-black/40 p-3.5 sm:p-4 rounded-xl">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs border-[#ffd700]/30 text-[#ffd700] bg-[#ffd700]/10 font-bold">
                              Week {chapter.number} Progress: {completedCount}/{chapter.tutorials.length} Lessons
                            </Badge>
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                              Simulations are open all week for hands-on practice.
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <Button
                              asChild
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 shadow"
                              title="Practice hands-on simulation workbench anytime throughout the week"
                            >
                              <Link href={simLink}>
                                <span className="mr-1">🛠️</span>
                                <span>Practice in {simName}</span>
                              </Link>
                            </Button>

                            {allCompleted ? (
                              <Button
                                asChild
                                size="sm"
                                className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs h-8 shadow animate-pulse"
                                title="Week complete! Take the weekly assessment quiz"
                              >
                                <Link href="/seo-quiz">
                                  <span className="mr-1">📝</span>
                                  <span>Take Week {chapter.number} Assessment Quiz</span>
                                </Link>
                              </Button>
                            ) : (
                              <Badge variant="outline" className="text-[11px] text-muted-foreground border-border bg-secondary/20 py-1.5 px-2.5">
                                🔒 Assessment unlocks after Week {chapter.number} lessons
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ErrorBoundary>

        {/* Agency Weekly Crisis Dispatch Hub */}
        <CrisisDispatchHub
          isOpen={isCrisisHubOpen}
          onClose={() => setIsCrisisHubOpen(false)}
          defaultWeek={currentTutorial ? Math.min(4, Math.max(1, Math.ceil(extractChapterNumber(currentTutorial) / 2))) : 1}
        />
      </div>
    </div>
  );
}