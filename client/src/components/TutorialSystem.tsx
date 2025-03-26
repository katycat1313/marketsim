
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import LessonPlanView from './LessonPlanView';

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

interface Slide {
  id: number;
  title: string;
  content: string;
  image?: string;
  contentType: 'text' | 'image' | 'quiz' | 'video' | 'interactive' | 'expandable' | 'swipeable';
  items?: {
    id: number;
    title: string;
    content: string;
  }[];
  cards?: {
    id: number;
    title: string;
    content: string;
    image?: string;
  }[];
}

export function TutorialSystem() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);
  const [currentLessonPlan, setCurrentLessonPlan] = useState<{
    title: string;
    tutorials: Tutorial[];
  } | null>(null);
  const [progress, setProgress] = useState<number[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [slideAnimation, setSlideAnimation] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  
  // Track the current slide ID to reset swipe index when it changes
  useEffect(() => {
    if (slides.length > 0 && currentSlideIndex >= 0 && currentSlideIndex < slides.length) {
      setCurrentSwipeIndex(0);
    }
  }, [currentSlideIndex, slides]);

  // Sample learning path visual
  const learningPathSteps = [
    { id: 1, title: 'Foundations', completed: true },
    { id: 2, title: 'Setup & Configuration', completed: true },
    { id: 3, title: 'Campaign Strategy', completed: false },
    { id: 4, title: 'Optimization', completed: false },
    { id: 5, title: 'Advanced Tactics', completed: false },
    { id: 6, title: 'Analytics & Reporting', completed: false },
  ];

  useEffect(() => {
    fetchTutorials();
    fetchProgress();
  }, []);

  useEffect(() => {
    if (currentTutorial) {
      // Generate slides from tutorial content
      const generatedSlides = generateSlidesFromContent(currentTutorial);
      setSlides(generatedSlides);
      setCurrentSlideIndex(0);
      
      // Scroll to top when tutorial changes
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  }, [currentTutorial]);

  // Generate slides from tutorial content
  const generateSlidesFromContent = (tutorial: Tutorial): Slide[] => {
    // Split the content by sections (headers)
    const contentSections = tutorial.content.split(/(?=^#+ )/m);
    
    // Create slides from the sections
    const slides: Slide[] = [];
    
    // Add intro slide
    slides.push({
      id: 0,
      title: tutorial.title,
      content: `<div class="text-center">
                  <h2 class="text-2xl font-bold mb-4">${tutorial.title}</h2>
                  <p class="text-lg mb-6">Level: ${tutorial.level}</p>
                  <div class="flex justify-center space-x-2 mb-4">
                    ${tutorial.skillsLearned?.map(skill => `<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">${skill}</span>`).join('') || ''}
                  </div>
                  <p class="text-gray-600 italic">Estimated time: ${tutorial.estimatedTime || 60} minutes</p>
                </div>`,
      contentType: 'text'
    });
    
    // Process each content section
    contentSections.forEach((section, index) => {
      if (section.trim()) {
        // Extract header
        const headerMatch = section.match(/^(#+) (.+)$/m);
        const title = headerMatch ? headerMatch[2] : `Section ${index + 1}`;
        
        // Check for special image markers
        const hasImage = section.includes('![') || section.includes('<img');
        
        slides.push({
          id: index + 1,
          title,
          content: section,
          contentType: hasImage ? 'image' : 'text',
          image: hasImage ? extractImagePath(section) : undefined
        });
      }
    });
    
    // Add tasks as slides
    tutorial.tasks.forEach((task, index) => {
      slides.push({
        id: slides.length,
        title: `Task: ${task.description}`,
        content: `<div>
                    <h3 class="text-xl font-semibold mb-4">${task.description}</h3>
                    <p class="text-sm text-gray-600 mb-4">Type: ${task.type}</p>
                    
                    <div class="mb-4">
                      <h4 class="font-medium mb-2">Requirements:</h4>
                      <ul class="list-disc pl-5">
                        ${task.requirements.map(req => `<li>${req}</li>`).join('')}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 class="font-medium mb-2">Verification Criteria:</h4>
                      <ul class="list-disc pl-5">
                        ${task.verificationCriteria.map(crit => `<li>${crit}</li>`).join('')}
                      </ul>
                    </div>
                  </div>`,
        contentType: 'interactive'
      });
    });
    
    return slides;
  };
  
  // Extract image path from content (simple version)
  const extractImagePath = (content: string): string => {
    const imgTagMatch = content.match(/<img.*?src=["'](.+?)["']/);
    if (imgTagMatch) return imgTagMatch[1];
    
    const markdownMatch = content.match(/!\[.*?\]\((.+?)\)/);
    if (markdownMatch) return markdownMatch[1];
    
    // Default image if none found
    return '/placeholder-image.png';
  };

  const fetchTutorials = async () => {
    try {
      const response = await fetch('/api/tutorials', {
        credentials: 'include', // Include cookies for session authentication
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.log(`Server responded with status: ${response.status}`);
        setTutorials([]);
        return;
      }
      
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
      const response = await fetch('/api/tutorials/progress', {
        credentials: 'include', // Include cookies for session authentication
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

  // Show a specific tutorial
  const startTutorial = (tutorial: Tutorial) => {
    setCurrentLessonPlan(null);
    setCurrentTutorial(tutorial);
  };
  
  // Show the lesson plan view for a group of tutorials
  const showLessonPlan = (lessonTitle: string, tutorials: Tutorial[]) => {
    setCurrentTutorial(null);
    setCurrentLessonPlan({
      title: lessonTitle,
      tutorials: tutorials
    });
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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' // Include cookies for session authentication
      });
      
      if (response.status === 401) {
        setCompletionError('Authentication required. Please log in to complete tutorials.');
        return;
      }
      
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

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setSlideAnimation('slide-left');
      setTimeout(() => {
        setCurrentSlideIndex(currentSlideIndex + 1);
        setSlideAnimation('');
      }, 300);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setSlideAnimation('slide-right');
      setTimeout(() => {
        setCurrentSlideIndex(currentSlideIndex - 1);
        setSlideAnimation('');
      }, 300);
    }
  };
  
  // Define state for expandable items
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({}); 
  // currentSwipeIndex is already defined at the component level

  // Toggle expandable item
  const toggleExpandItem = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Handle swipe navigation
  const handleSwipe = (direction: 'next' | 'prev', cards: { id: number; title: string; content: string; image?: string }[]) => {
    if (!cards) return;
    
    if (direction === 'next' && currentSwipeIndex < cards.length - 1) {
      setCurrentSwipeIndex(currentSwipeIndex + 1);
    } else if (direction === 'prev' && currentSwipeIndex > 0) {
      setCurrentSwipeIndex(currentSwipeIndex - 1);
    }
  };

  // Render expandable content blocks (like in your screenshots)
  const renderExpandableItems = (items: { id: number; title: string; content: string }[]) => {
    return (
      <div className="space-y-3">
        {items.map(item => (
          <div 
            key={item.id} 
            className={`expandable-item ${expandedItems[`item-${item.id}`] ? 'expanded' : ''}`}
          >
            <div 
              className="expandable-item-header"
              onClick={() => toggleExpandItem(`item-${item.id}`)}
            >
              <span>{item.title}</span>
              <span>{expandedItems[`item-${item.id}`] ? '−' : '+'}</span>
            </div>
            <div className="expandable-item-content">
              <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render swipeable content (like in your screenshots)
  const renderSwipeableContent = (cards: { id: number; title: string; content: string; image?: string }[]) => {
    return (
      <div className="swipeable-container">
        <div 
          className="swipeable-wrapper" 
          style={{ transform: `translateX(-${currentSwipeIndex * 100}%)` }}
        >
          {cards.map((card, index) => (
            <div key={card.id} className="swipeable-slide">
              {card.image && (
                <div className="mb-4">
                  <img src={card.image} alt={card.title} className="w-full h-auto rounded-md max-h-64 object-contain" />
                </div>
              )}
              <h4 className="text-lg font-semibold mb-2">{card.title}</h4>
              <div dangerouslySetInnerHTML={{ __html: card.content }}></div>
            </div>
          ))}
        </div>
        
        {/* Navigation buttons */}
        {currentSwipeIndex > 0 && (
          <div className="swipe-nav-button prev" onClick={() => handleSwipe('prev', cards)}>
            ←
          </div>
        )}
        
        {currentSwipeIndex < cards.length - 1 && (
          <div className="swipe-nav-button next" onClick={() => handleSwipe('next', cards)}>
            →
          </div>
        )}
        
        {/* Swipe indicator dots */}
        <div className="swipe-indicator">
          {cards.map((_, index) => (
            <div 
              key={index} 
              className={`swipe-dot ${index === currentSwipeIndex ? 'active' : ''}`}
              onClick={() => setCurrentSwipeIndex(index)}
            />
          ))}
        </div>
        
        <div className="swipe-instruction">SWIPE TO SEE MORE</div>
      </div>
    );
  };

  // We already added the effect at the component level above
  // No need for this duplicate useEffect

  const renderSlideContent = (slide: Slide) => {
    if (slide.contentType === 'expandable' && slide.items) {
      return renderExpandableItems(slide.items);
    }
    
    if (slide.contentType === 'swipeable' && slide.cards) {
      return renderSwipeableContent(slide.cards);
    }
    
    if (slide.contentType === 'image' && slide.image) {
      return (
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-1/2">
            <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: formatMarkdown(slide.content) }}></div>
          </div>
          <div className="md:w-1/2 rounded-lg overflow-hidden shadow-lg border border-[#ffd700]/30">
            <img src={slide.image} alt={slide.title} className="w-full h-auto object-cover" />
          </div>
        </div>
      );
    } else if (slide.contentType === 'interactive') {
      // Create a demo expandable content based on the tutorial content with visual icons
      const demoItems = [
        {
          id: 1,
          title: "1. Key Concepts",
          content: "<div class='flex items-start'><span class='text-[#ffd700] mr-2 text-xl'>🔑</span><p>To implement effective digital marketing analytics, businesses should focus on setting clear goals and KPIs.</p></div>"
        },
        {
          id: 2,
          title: "2. Best Practices",
          content: "<div class='flex items-start'><span class='text-[#ffd700] mr-2 text-xl'>⭐</span><p>Regularly reviewing and adjusting strategies based on data insights is crucial for success.</p></div>"
        },
        {
          id: 3,
          title: "3. Implementation Tips",
          content: "<div class='flex items-start'><span class='text-[#ffd700] mr-2 text-xl'>💡</span><p>Investing in the right tools and technologies can enhance data collection and analysis.</p></div>"
        }
      ];
      
      // Add Google Ads visual icons based on the slide content
      const hasGoogleAdsContent = slide.content.toLowerCase().includes('google ads');
      const hasAnalyticsContent = slide.content.toLowerCase().includes('analytics');
      const hasSEOContent = slide.content.toLowerCase().includes('seo');
      
      return (
        <div className="space-y-6">
          {/* Visual task header with icon */}
          <div className="flex items-center mb-2">
            {hasGoogleAdsContent && <div className="mr-3 text-2xl">📊</div>}
            {hasAnalyticsContent && <div className="mr-3 text-2xl">📈</div>}
            {hasSEOContent && <div className="mr-3 text-2xl">🔍</div>}
            {!hasGoogleAdsContent && !hasAnalyticsContent && !hasSEOContent && <div className="mr-3 text-2xl">📚</div>}
            <h3 className="text-xl font-semibold text-[#ffd700]">Task Overview</h3>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-[#ffd700]/30 mb-4 shadow-lg" dangerouslySetInnerHTML={{ __html: slide.content }}></div>
          
          <div className="mt-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-1 bg-[#ffd700]/30"></div>
              <h3 className="text-xl font-semibold mx-3 text-[#ffd700]">Conclusion and Best Practices</h3>
              <div className="w-8 h-1 bg-[#ffd700]/30"></div>
            </div>
            {renderExpandableItems(demoItems)}
          </div>
        </div>
      );
    } else {
      // Add visual elements to regular content
      return (
        <div>
          {/* Add a decorative graphic element */}
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#ffd700]/30 to-transparent mb-6"></div>
          
          <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: formatMarkdown(slide.content) }}></div>
          
          {/* Add a decorative graphic element at the bottom */}
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#ffd700]/30 to-transparent mt-6"></div>
        </div>
      );
    }
  };
  
  // Basic markdown to HTML formatter
  const formatMarkdown = (markdown: string): string => {
    // First, preserve code blocks to avoid processing them with other transformations
    const codeBlocks: string[] = [];
    let html = markdown.replace(/```([^`]+)```/g, (match) => {
      codeBlocks.push(match);
      return `%%CODEBLOCK_${codeBlocks.length - 1}%%`;
    });
    
    // Process headers from h1 to h6
    html = html.replace(/^######\s+(.+)$/gm, '<h6 class="text-sm font-semibold mb-2 text-blue-600">$1</h6>');
    html = html.replace(/^#####\s+(.+)$/gm, '<h5 class="text-base font-semibold mb-2 text-blue-600">$1</h5>');
    html = html.replace(/^####\s+(.+)$/gm, '<h4 class="text-lg font-semibold mb-2 text-blue-700">$1</h4>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-xl font-semibold mb-3 text-blue-700">$1</h3>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-2xl font-bold mb-3 text-blue-800">$1</h2>');
    html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-3xl font-bold mb-4 text-blue-900">$1</h1>');
    
    // Convert bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em class="text-blue-700">$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-blue-700">$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em class="text-blue-600">$1</em>');
    
    // Convert blockquotes for interactive challenges, polls, etc.
    html = html.replace(/^>\s*\*\*(.+?)\*\*:\s*(.+)$/gm, 
      '<div class="bg-blue-50 p-4 rounded-lg border border-blue-200 my-4"><h4 class="font-bold text-blue-800 mb-2">$1</h4><p class="text-blue-700">$2</p></div>');
    
    html = html.replace(/^>\s*(.+)$/gm, 
      '<div class="bg-blue-50 p-4 rounded-lg border border-blue-200 my-2 text-blue-700">$1</div>');
    
    // Convert lists (both ordered and unordered)
    html = html.replace(/^\s*-\s+(.+)$/gm, '<li class="text-gray-700 mb-1">$1</li>');
    html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li class="text-gray-700 mb-1">$1</li>');
    
    // Group list items
    html = html.replace(/(<li class="text-gray-700 mb-1">.*<\/li>\n)+/g, 
      '<ul class="list-disc pl-5 mb-4 space-y-1">$&</ul>');
    
    // Convert inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-red-500 px-1 py-0.5 rounded text-sm">$1</code>');
    
    // Process links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
      '<a href="$2" class="text-blue-500 hover:underline font-medium">$1</a>');
    
    // Convert paragraphs (skip anything that looks like HTML)
    html = html.replace(/^(?!<[a-z\/]).+$/gm, 
      '<p class="mb-4 text-gray-700 leading-relaxed">$&</p>');
    
    // Fix multiple line breaks
    html = html.replace(/\n{2,}/g, '<br/>');
    
    // Replace HTML in paragraphs (cleanup)
    html = html.replace(/<p class="mb-4 text-gray-700 leading-relaxed">(<[^>]+>)(.*?)(<\/[^>]+>)<\/p>/g, '$1$2$3');
    
    // Restore code blocks with syntax highlighting
    codeBlocks.forEach((block, index) => {
      // Strip the markdown code block syntax
      const cleanCode = block.replace(/```(?:\w+)?\n([\s\S]*?)```/g, '$1');
      const highlightedCode = `<pre class="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto mb-4"><code>${cleanCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
      html = html.replace(`%%CODEBLOCK_${index}%%`, highlightedCode);
    });
    
    return html;
  };

  const renderLearningPath = () => {
    return (
      <div className="mt-8">
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 bg-[#ffd700] rounded mr-2"></div>
          <h3 className="text-lg font-semibold text-[#ffd700]">Your Learning Journey</h3>
        </div>
        
        <div className="p-5 rounded-lg border border-[#ffd700]/20 bg-[#111]/60 shadow-lg">
          <div className="flex flex-wrap gap-2 relative">
            {/* Add decorative path connector */}
            <div className="absolute top-4 left-4 right-4 h-1 bg-gradient-to-r from-[#ffd700]/20 via-[#ffd700]/40 to-[#ffd700]/10"></div>
            
            {learningPathSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative z-10 bg-[#111]/90 p-2 rounded-lg border border-[#ffd700]/20">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg ${
                  step.completed 
                    ? 'bg-gradient-to-r from-[#ffd700] to-[#e6c200] text-black' 
                    : 'bg-[#333] text-[#f5f5f5] border border-[#ffd700]/30'
                }`}>
                  {step.completed ? '✓' : step.id}
                </div>
                <div className="mt-2 text-center">
                  <span className={`text-sm font-medium ${
                    step.completed 
                      ? 'text-[#ffd700]' 
                      : 'text-[#f5f5f5]'
                  }`}>
                    {step.title}
                  </span>
                  
                  {/* Add status indicator */}
                  <div className="mt-1 text-xs text-center">
                    {step.completed ? (
                      <span className="text-green-400">Completed</span>
                    ) : index === 0 || learningPathSteps[index-1]?.completed ? (
                      <span className="text-blue-400">In Progress</span>
                    ) : (
                      <span className="text-gray-400">Locked</span>
                    )}
                  </div>
                </div>
                
                {index < learningPathSteps.length - 1 && (
                  <div className="hidden md:block absolute right-[-16px] top-[19px] transform rotate-[-45deg]">
                    <span className="text-[#ffd700]/50">→</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Define lesson interface
  interface LessonGroup {
    description: string;
    tutorials: Tutorial[];
    icon: string;
    color: string;
    ctaText: string;
  }

  // Group tutorials by lessons with clear progression
  const categorizedTutorials = React.useMemo(() => {
    // Define lessons with clear progression instead of just categories
    const lessons: Record<string, LessonGroup> = {
      'Lesson 1: Getting Started with Digital Marketing': {
        description: 'Learn the fundamentals of digital marketing, including Google Ads setup, SEO foundations, and basic analytics. After completing this lesson, you will have confidence in your ability to understand the basic principles of digital marketing campaigns.',
        tutorials: tutorials.filter(t => 
          t.title.toLowerCase().includes('foundation') || 
          t.title.toLowerCase().includes('mastery') || 
          t.title.toLowerCase().includes('beginner') ||
          t.title.toLowerCase().includes('setup')
        ),
        icon: '🚀',
        color: 'green-500',
        ctaText: 'Start Your Digital Marketing Journey'
      },
      'Lesson 2: Building Effective Campaigns': {
        description: 'Discover how to create effective marketing campaigns across multiple platforms. Learn about search campaign fundamentals, audience targeting, and content optimization strategies.',
        tutorials: tutorials.filter(t => 
          t.title.toLowerCase().includes('campaign') ||
          t.title.toLowerCase().includes('audience') ||
          t.title.toLowerCase().includes('targeting') ||
          t.title.toLowerCase().includes('strategy')
        ),
        icon: '📊',
        color: 'blue-500',
        ctaText: 'Master Campaign Creation'
      },
      'Lesson 3: Platform-Specific Marketing': {
        description: 'Dive deeper into specific marketing platforms including Google Ads, SEO, social media, and email marketing. Learn advanced techniques for each platform.',
        tutorials: tutorials.filter(t => 
          (t.title.toLowerCase().includes('google') && !t.title.toLowerCase().includes('foundation')) ||
          (t.title.toLowerCase().includes('seo') && !t.title.toLowerCase().includes('foundation')) ||
          t.title.toLowerCase().includes('email') ||
          t.title.toLowerCase().includes('social')
        ),
        icon: '🔍',
        color: 'purple-500',
        ctaText: 'Explore Platform Specialization'
      },
      'Lesson 4: Advanced Optimization & Analytics': {
        description: 'Take your marketing skills to the next level with advanced optimization techniques, troubleshooting strategies, and data-driven decision making.',
        tutorials: tutorials.filter(t => 
          t.title.toLowerCase().includes('advanced') ||
          t.title.toLowerCase().includes('analytics') ||
          t.title.toLowerCase().includes('troubleshooting') ||
          t.title.toLowerCase().includes('expert')
        ),
        icon: '📈',
        color: 'yellow-500',
        ctaText: 'Elevate Your Marketing Skills'
      }
    };
    
    // Assign any remaining tutorials to an additional lesson
    const otherTutorials = tutorials.filter(tutorial => {
      return !Object.values(lessons).some(lesson => 
        lesson.tutorials.some(t => t.id === tutorial.id)
      );
    });
    
    if (otherTutorials.length > 0) {
      lessons['Lesson 5: Specialized Marketing Topics'] = {
        description: 'Explore specialized marketing topics and niche strategies to round out your digital marketing expertise.',
        tutorials: otherTutorials,
        icon: '🔎',
        color: 'pink-500',
        ctaText: 'Explore Specialized Topics'
      };
    }
    
    return lessons;
  }, [tutorials]);
  
  // Assign lesson numbers to tutorials for consistent numbering
  const assignLessonNumbers = () => {
    const lessonMap = new Map<string, number>();
    
    // Group by category
    const categories = {
      'Google Ads': tutorials.filter(t => t.title.toLowerCase().includes('google') || t.title.toLowerCase().includes('ads')),
      'SEO': tutorials.filter(t => t.title.toLowerCase().includes('seo')),
      'Analytics': tutorials.filter(t => t.title.toLowerCase().includes('analytics')),
      'Social Media': tutorials.filter(t => t.title.toLowerCase().includes('social') || t.title.toLowerCase().includes('facebook') || t.title.toLowerCase().includes('instagram')),
      'Content Marketing': tutorials.filter(t => t.title.toLowerCase().includes('content')),
      'Other': [] as Tutorial[]
    };
    
    // Assign lesson numbers
    let lessonNumber = 1;
    Object.entries(categories).forEach(([category, tutorialsInCategory]) => {
      if (tutorialsInCategory.length === 0) return;
      
      tutorialsInCategory.forEach((tutorial, subIndex) => {
        const key = `${tutorial.id}`;
        lessonMap.set(key, lessonNumber + (subIndex + 1) / 10);
      });
      
      lessonNumber++;
    });
    
    return lessonMap;
  };
  
  const lessonNumberMap = React.useMemo(assignLessonNumbers, [tutorials]);
  
  // Format the lesson number as "Lesson X.Y"
  const formatLessonNumber = (tutorial: Tutorial) => {
    const number = lessonNumberMap.get(`${tutorial.id}`);
    if (!number) return '';
    
    const mainNumber = Math.floor(number);
    const subNumber = Math.round((number - mainNumber) * 10);
    
    return `Lesson ${mainNumber}-${subNumber}`;
  };
  
  // Get an appropriate icon for each tutorial category
  const getCategoryIcon = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('google ads') || lowerTitle.includes('ads')) {
      return '📊';
    } else if (lowerTitle.includes('seo')) {
      return '🔍';
    } else if (lowerTitle.includes('analytics')) {
      return '📈';
    } else if (lowerTitle.includes('social') || lowerTitle.includes('facebook')) {
      return '📱';
    } else if (lowerTitle.includes('content')) {
      return '📝';
    } else if (lowerTitle.includes('email')) {
      return '📧';
    } else {
      return '📚';
    }
  };

  // Render a tutorial card with consistent styling and gold accents
  const renderTutorialCard = (tutorial: Tutorial) => (
    <Card 
      key={tutorial.id} 
      className="tutorial-card transition-all duration-300 hover:shadow-lg border-l-4 border-l-[#ffd700]"
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-md font-medium mr-2">
                {formatLessonNumber(tutorial)}
              </span>
              {progress.includes(tutorial.id) && (
                <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                  Completed
                </span>
              )}
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">{getCategoryIcon(tutorial.title)}</span>
              <h3 className="text-lg font-semibold">{tutorial.title}</h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">Level: {tutorial.level}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {/* Add decorative gold accent line */}
        <div className="w-full h-px bg-[#ffd700]/30 my-2"></div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {tutorial.skillsLearned && tutorial.skillsLearned.map((skill, i) => (
            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {skill}
            </span>
          ))}
          
        </div>
        
        <p className="text-xs text-gray-500 mb-3 flex items-center">
          <span className="mr-1">⏱️</span> Estimated time: {tutorial.estimatedTime || 60} minutes
        </p>
        
        {/* Visual progress indicator */}
        <div className="relative mt-4">
          <Progress 
            value={progress.includes(tutorial.id) ? 100 : 0} 
            className={progress.includes(tutorial.id) ? "bg-green-100" : "bg-gray-100"}
          />
          {progress.includes(tutorial.id) && (
            <span className="absolute right-0 -top-1 text-xs text-green-600">✓ Completed</span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => startTutorial(tutorial)}
          className="w-full relative overflow-hidden group"
          variant={progress.includes(tutorial.id) ? "outline" : "default"}
        >
          {/* Add gold shimmer effect on hover */}
          <span className="absolute inset-0 w-0 bg-[#ffd700]/10 transition-all duration-300 group-hover:w-full"></span>
          <span className="relative">
            {progress.includes(tutorial.id) ? 'Review Lesson' : 'Start Lesson'}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="p-4">
      <div className="py-3 px-1 mb-6 border-b border-[#ffd700]/30">
        <h2 className="text-2xl font-bold text-[#ffd700] flex items-center">
          <span className="w-8 h-8 rounded-full bg-[#ffd700] text-black flex items-center justify-center mr-3 text-sm">DZ</span>
          DIGITAL ZOOM Marketing Academy
        </h2>
      </div>
      
      {!currentTutorial ? (
        <div>
          {renderLearningPath()}
          
          <div className="mt-8 mb-6">
            <Tabs defaultValue="learning-path" className="mb-6 pb-6 border-b border-[#ffd700]/20">
              <TabsList className="w-full p-1 bg-[#333] rounded-lg mb-6 border border-[#ffd700]/20">
                <TabsTrigger 
                  value="learning-path" 
                  className="flex-1 data-[state=active]:bg-[#ffd700]/20 data-[state=active]:text-[#ffd700] data-[state=active]:shadow-[0_0_10px_rgba(255,215,0,0.3)]"
                >
                  <span className="mr-2">🛣️</span> Learning Path
                </TabsTrigger>
                <TabsTrigger 
                  value="categories" 
                  className="flex-1 data-[state=active]:bg-[#ffd700]/20 data-[state=active]:text-[#ffd700] data-[state=active]:shadow-[0_0_10px_rgba(255,215,0,0.3)]"
                >
                  <span className="mr-2">📊</span> By Category
                </TabsTrigger>
                <TabsTrigger 
                  value="levels" 
                  className="flex-1 data-[state=active]:bg-[#ffd700]/20 data-[state=active]:text-[#ffd700] data-[state=active]:shadow-[0_0_10px_rgba(255,215,0,0.3)]"
                >
                  <span className="mr-2">🏆</span> By Level
                </TabsTrigger>
              </TabsList>
              
              {/* Learning Path Tab */}
              <TabsContent value="learning-path">
                <div className="space-y-6">
                  <div className="bg-[#111]/80 p-6 rounded-lg border border-[#ffd700]/20 mb-6 shadow-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-1 h-6 bg-[#ffd700] rounded mr-2"></div>
                      <h3 className="text-lg font-medium text-[#ffd700]">Recommended Learning Path</h3>
                    </div>
                    <p className="text-[#f5f5f5]">Follow this structured learning path for the best results. Start with the foundations and work your way up to advanced topics.</p>
                  </div>
                  
                  {/* Foundation */}
                  <div className="p-2 rounded-lg bg-[#111]/40 shadow-md border border-[#ffd700]/10">
                    <div className="mb-4 pl-2 border-l-4 border-[#ffd700]">
                      <h3 className="text-xl font-bold text-[#ffd700] flex items-center">
                        <span className="w-8 h-8 bg-gradient-to-br from-[#ffd700] to-[#e6c200] text-black rounded-full flex items-center justify-center mr-2 shadow-lg">1</span>
                        Foundations
                      </h3>
                      <p className="ml-10 text-[#f5f5f5]/70 text-sm">Begin your marketing journey with essential concepts</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                      {tutorials
                        .filter(t => t.level.toLowerCase().includes('beginner') || t.title.toLowerCase().includes('foundation'))
                        .map(renderTutorialCard)}
                    </div>
                  </div>
                  
                  {/* Core Skills */}
                  <div className="mt-8 p-2 rounded-lg bg-[#111]/40 shadow-md border border-[#ffd700]/10">
                    <div className="mb-4 pl-2 border-l-4 border-[#ffd700]">
                      <h3 className="text-xl font-bold text-[#ffd700] flex items-center">
                        <span className="w-8 h-8 bg-gradient-to-br from-[#ffd700] to-[#e6c200] text-black rounded-full flex items-center justify-center mr-2 shadow-lg">2</span>
                        Core Skills
                      </h3>
                      <p className="ml-10 text-[#f5f5f5]/70 text-sm">Build your expertise with intermediate concepts and techniques</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                      {tutorials
                        .filter(t => !t.level.toLowerCase().includes('beginner') && !t.level.toLowerCase().includes('advanced'))
                        .map(renderTutorialCard)}
                    </div>
                  </div>
                  
                  {/* Advanced Techniques */}
                  <div className="mt-8 p-2 rounded-lg bg-[#111]/40 shadow-md border border-[#ffd700]/10">
                    <div className="mb-4 pl-2 border-l-4 border-[#ffd700]">
                      <h3 className="text-xl font-bold text-[#ffd700] flex items-center">
                        <span className="w-8 h-8 bg-gradient-to-br from-[#ffd700] to-[#e6c200] text-black rounded-full flex items-center justify-center mr-2 shadow-lg">3</span>
                        Advanced Techniques
                      </h3>
                      <p className="ml-10 text-[#f5f5f5]/70 text-sm">Master complex strategies and optimization methods</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                      {tutorials
                        .filter(t => t.level.toLowerCase().includes('advanced'))
                        .map(renderTutorialCard)}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Lessons Tab */}
              <TabsContent value="categories">
                <div className="space-y-10">
                  {Object.entries(categorizedTutorials).map(([lessonName, lessonGroup]) => {
                    // Safely access the tutorials array with type checking
                    const tutorials = lessonGroup.tutorials || [];
                    
                    return tutorials.length > 0 ? (
                      <div key={lessonName} className="mb-8 p-2 rounded-lg bg-[#111]/40 shadow-md border border-[#ffd700]/10">
                        <div className="mb-4 pl-2 border-l-4 border-[#ffd700]">
                          <h3 className="text-xl font-bold text-[#ffd700] flex items-center">
                            <span className="text-2xl mr-3">{lessonGroup.icon}</span>
                            {lessonName}
                          </h3>
                          <p className="ml-10 text-[#f5f5f5]/70 text-sm">{lessonGroup.description}</p>
                          
                          {/* Call to action button */}
                          <div className="ml-10 mt-3">
                            <Button 
                              className={`bg-${lessonGroup.color} hover:bg-${lessonGroup.color}/90 text-white`}
                              onClick={() => tutorials.length > 0 ? startTutorial(tutorials[0]) : null}
                            >
                              {lessonGroup.ctaText} →
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                          {tutorials.map(renderTutorialCard)}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </TabsContent>
              
              {/* Levels Tab */}
              <TabsContent value="levels">
                <div className="space-y-10">
                  {/* Beginner Tutorials */}
                  <div className="mb-8 p-2 rounded-lg bg-[#111]/40 shadow-md border border-[#ffd700]/10">
                    <div className="mb-4 pl-2 border-l-4 border-green-500">
                      <h3 className="text-xl font-bold text-[#ffd700] flex items-center">
                        <span className="bg-[#111] text-green-400 text-sm font-medium px-3 py-1 rounded-full mr-2 border border-green-500/30">Beginner</span>
                        Start Here
                      </h3>
                      <p className="ml-10 text-[#f5f5f5]/70 text-sm">Perfect for newcomers to digital marketing - no prior experience required</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                      {tutorials
                        .filter(t => t.level.toLowerCase().includes('beginner'))
                        .map(renderTutorialCard)}
                    </div>
                  </div>
                  
                  {/* Intermediate Tutorials */}
                  <div className="mb-8 p-2 rounded-lg bg-[#111]/40 shadow-md border border-[#ffd700]/10">
                    <div className="mb-4 pl-2 border-l-4 border-blue-500">
                      <h3 className="text-xl font-bold text-[#ffd700] flex items-center">
                        <span className="bg-[#111] text-blue-400 text-sm font-medium px-3 py-1 rounded-full mr-2 border border-blue-500/30">Intermediate</span>
                        Build Your Skills
                      </h3>
                      <p className="ml-10 text-[#f5f5f5]/70 text-sm">For marketers with basic knowledge ready to enhance their capabilities</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                      {tutorials
                        .filter(t => t.level.toLowerCase().includes('intermediate'))
                        .map(renderTutorialCard)}
                    </div>
                  </div>
                  
                  {/* Advanced Tutorials */}
                  <div className="mb-8 p-2 rounded-lg bg-[#111]/40 shadow-md border border-[#ffd700]/10">
                    <div className="mb-4 pl-2 border-l-4 border-purple-500">
                      <h3 className="text-xl font-bold text-[#ffd700] flex items-center">
                        <span className="bg-[#111] text-purple-400 text-sm font-medium px-3 py-1 rounded-full mr-2 border border-purple-500/30">Advanced</span>
                        Master Your Craft
                      </h3>
                      <p className="ml-10 text-[#f5f5f5]/70 text-sm">Advanced strategies for experienced marketers ready to maximize results</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                      {tutorials
                        .filter(t => t.level.toLowerCase().includes('advanced'))
                        .map(renderTutorialCard)}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto" ref={contentRef}>
          <div className="flex justify-between items-center mb-4">
            <Button onClick={() => setCurrentTutorial(null)} variant="outline" size="sm">
              ← Back to Tutorials
            </Button>
            <div className="text-sm text-gray-500">
              Slide {currentSlideIndex + 1} of {slides.length}
            </div>
          </div>
          
          <Card className="mb-6 tutorial-card shadow-lg">
            <CardHeader className="pb-2 border-b border-[#ffd700]/30">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getCategoryIcon(currentTutorial.title)}</span>
                  <h3 className="text-xl font-bold">{currentTutorial.title}</h3>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {currentTutorial.level}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              {/* Gold accent divider */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#ffd700]/30 to-transparent mb-6"></div>
              
              <div className={`tutorial-slide ${slideAnimation}`}>
                {slides.length > 0 && (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center">
                        <div className="w-1 h-6 bg-[#ffd700] rounded mr-2"></div>
                        <h4 className="text-lg font-semibold mb-2">{slides[currentSlideIndex].title}</h4>
                      </div>
                      <Separator className="mb-4 mt-2" />
                    </div>
                    
                    <div className="min-h-[400px]">
                      {renderSlideContent(slides[currentSlideIndex])}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-4 border-t border-[#ffd700]/30 flex justify-between">
              <Button 
                onClick={prevSlide} 
                disabled={currentSlideIndex === 0}
                variant="outline"
                className="border-[#ffd700]/50 hover:bg-[#ffd700]/10"
              >
                ← Previous
              </Button>
              
              <div className="flex space-x-2 items-center">
                {slides.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-200 ${
                      index === currentSlideIndex 
                        ? 'bg-[#ffd700] w-3 h-3' 
                        : 'bg-gray-300 hover:bg-[#ffd700]/50'
                    }`}
                    onClick={() => setCurrentSlideIndex(index)}
                  />
                ))}
              </div>
              
              {currentSlideIndex === slides.length - 1 ? (
                <Button 
                  onClick={() => completeTutorial(currentTutorial.id)}
                  disabled={isCompleting}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 relative overflow-hidden group"
                >
                  {/* Add gold shimmer effect on hover */}
                  <span className="absolute inset-0 w-0 bg-[#ffd700]/10 transition-all duration-300 group-hover:w-full"></span>
                  <span className="relative flex items-center">
                    {isCompleting ? 'Completing...' : 'Complete Tutorial ✓'}
                  </span>
                </Button>
              ) : (
                <Button 
                  onClick={nextSlide}
                  className="relative overflow-hidden group"
                >
                  {/* Add gold shimmer effect on hover */}
                  <span className="absolute inset-0 w-0 bg-[#ffd700]/10 transition-all duration-300 group-hover:w-full"></span>
                  <span className="relative">Next →</span>
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {completionError && (
            <div className="p-4 mb-4 text-red-600 bg-red-50 border border-red-200 rounded-md">
              {completionError}
            </div>
          )}
          
          <div className="mb-6">
            <Accordion type="single" collapsible className="border border-[#ffd700]/30 rounded-lg overflow-hidden">
              <AccordionItem value="resources" className="border-b-[#ffd700]/30">
                <AccordionTrigger className="hover:bg-[#ffd700]/5 py-4 px-2">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">📚</span>
                    <span className="text-[#ffd700] font-medium">Additional Resources</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-[#111]/80 p-4">
                  <ul className="space-y-3">
                    <li className="flex items-center p-2 hover:bg-[#222] rounded transition-all">
                      <span className="w-8 h-8 bg-[#333] text-[#ffd700] rounded-full flex items-center justify-center mr-3 shadow-inner">
                        📄
                      </span>
                      <a href="#" className="text-[#f5f5f5] hover:text-[#ffd700] transition-colors">
                        Downloadable PDF Guide
                      </a>
                    </li>
                    <li className="flex items-center p-2 hover:bg-[#222] rounded transition-all">
                      <span className="w-8 h-8 bg-[#333] text-[#ffd700] rounded-full flex items-center justify-center mr-3 shadow-inner">
                        🎬
                      </span>
                      <a href="#" className="text-[#f5f5f5] hover:text-[#ffd700] transition-colors">
                        Supplementary Video Tutorial
                      </a>
                    </li>
                    <li className="flex items-center p-2 hover:bg-[#222] rounded transition-all">
                      <span className="w-8 h-8 bg-[#333] text-[#ffd700] rounded-full flex items-center justify-center mr-3 shadow-inner">
                        🔗
                      </span>
                      <a href="#" className="text-[#f5f5f5] hover:text-[#ffd700] transition-colors">
                        Google Documentation Reference
                      </a>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="tasks">
                <AccordionTrigger className="hover:bg-[#ffd700]/5 py-4 px-2">
                  <div className="flex items-center">
                    <span className="text-xl mr-2">✓</span>
                    <span className="text-[#ffd700] font-medium">Tutorial Tasks</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-[#111]/80 p-4">
                  {currentTutorial.tasks.map((task, index) => (
                    <div 
                      key={task.id} 
                      className="mb-4 last:mb-0 p-4 bg-[#222] rounded-md border border-[#ffd700]/20 hover:border-[#ffd700]/30 transition-all"
                    >
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center text-[#ffd700] mr-3 mt-1 text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-[#ffd700]">{task.description}</h5>
                          <div className="inline-block px-2 py-1 bg-[#333] text-[#f5f5f5] rounded text-xs mt-2 mb-3">
                            {task.type}
                          </div>
                          
                          <div className="mt-3 border-t border-[#ffd700]/10 pt-3">
                            <h6 className="text-sm font-medium text-[#ffd700]/80 mb-2">Requirements:</h6>
                            <ul className="space-y-2 text-sm text-[#f5f5f5]">
                              {task.requirements.map((req, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-[#ffd700] mr-2">•</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )}
      
      {/* CSS styles applied using className instead of inline jsx */}
    </div>
  );
}
