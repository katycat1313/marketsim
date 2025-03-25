
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

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
  const [progress, setProgress] = useState<number[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [slideAnimation, setSlideAnimation] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

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
  
  // Define state for expandable items and swipeable slides
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);

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

  const renderSlideContent = (slide: Slide) => {
    // Reset current swipe index when slide changes
    React.useEffect(() => {
      setCurrentSwipeIndex(0);
    }, [slide.id]);

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
          <div className="md:w-1/2 rounded-lg overflow-hidden shadow-lg">
            <img src={slide.image} alt={slide.title} className="w-full h-auto object-cover" />
          </div>
        </div>
      );
    } else if (slide.contentType === 'interactive') {
      // Create a demo expandable content based on the tutorial content
      const demoItems = [
        {
          id: 1,
          title: "1. Key Concepts",
          content: "<p>To implement effective digital marketing analytics, businesses should focus on setting clear goals and KPIs.</p>"
        },
        {
          id: 2,
          title: "2. Best Practices",
          content: "<p>Regularly reviewing and adjusting strategies based on data insights is crucial for success.</p>"
        },
        {
          id: 3,
          title: "3. Implementation Tips",
          content: "<p>Investing in the right tools and technologies can enhance data collection and analysis.</p>"
        }
      ];
      
      return (
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-4" dangerouslySetInnerHTML={{ __html: slide.content }}></div>
          
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 text-center">Conclusion and Best Practices</h3>
            {renderExpandableItems(demoItems)}
          </div>
        </div>
      );
    } else {
      return (
        <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: formatMarkdown(slide.content) }}></div>
      );
    }
  };
  
  // Basic markdown to HTML formatter
  const formatMarkdown = (markdown: string): string => {
    // Remove markdown headers (we'll handle them separately)
    let html = markdown.replace(/^#+\s+(.+)$/gm, '<h3 class="text-xl font-semibold mb-4 text-blue-800">$1</h3>');
    
    // Convert bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-blue-700">$1</strong>');
    
    // Convert italic
    html = html.replace(/\*(.+?)\*/g, '<em class="text-blue-600">$1</em>');
    
    // Convert lists
    html = html.replace(/^\s*-\s+(.+)$/gm, '<li class="text-gray-700">$1</li>');
    html = html.replace(/(<li.*<\/li>\n)+/g, '<ul class="list-disc pl-5 mb-4">$&</ul>');
    
    // Convert paragraphs
    html = html.replace(/^(?!<[uh]|<li|<ul|<ol)(.+)$/gm, '<p class="mb-4 text-gray-700 leading-relaxed">$1</p>');
    
    // Fix line breaks
    html = html.replace(/\n\n/g, '<br/>');
    
    return html;
  };

  const renderLearningPath = () => {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Your Learning Path</h3>
        <div className="flex flex-wrap gap-2">
          {learningPathSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {step.completed ? '✓' : step.id}
              </div>
              <div className="ml-2 mr-4">
                <span className={`text-sm ${step.completed ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                  {step.title}
                </span>
              </div>
              {index < learningPathSteps.length - 1 && (
                <div className={`w-8 h-1 ${index < 2 ? 'bg-green-300' : 'bg-gray-200'}`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Group tutorials by category
  const categorizedTutorials = React.useMemo(() => {
    const categories = {
      'Google Ads': tutorials.filter(t => t.title.toLowerCase().includes('google') || t.title.toLowerCase().includes('ads')),
      'SEO': tutorials.filter(t => t.title.toLowerCase().includes('seo')),
      'Analytics': tutorials.filter(t => t.title.toLowerCase().includes('analytics')),
      'Social Media': tutorials.filter(t => t.title.toLowerCase().includes('social') || t.title.toLowerCase().includes('facebook') || t.title.toLowerCase().includes('instagram')),
      'Content Marketing': tutorials.filter(t => t.title.toLowerCase().includes('content')),
      'Other': [] as Tutorial[]
    };
    
    // Add any tutorials that don't fit specific categories to 'Other'
    tutorials.forEach(tutorial => {
      const inSpecificCategory = Object.entries(categories)
        .filter(([key]) => key !== 'Other')
        .some(([_, tutorialsInCategory]) => 
          tutorialsInCategory.some(t => t.id === tutorial.id)
        );
      
      if (!inSpecificCategory) {
        categories['Other'].push(tutorial);
      }
    });
    
    return categories;
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

  // Render a tutorial card with consistent styling
  const renderTutorialCard = (tutorial: Tutorial) => (
    <Card key={tutorial.id} className="tutorial-card transition-all duration-300 hover:shadow-lg border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
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
            <h3 className="text-lg font-semibold text-blue-800">{tutorial.title}</h3>
            <p className="text-sm text-gray-500">Level: {tutorial.level}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-3">
          {tutorial.skillsLearned && tutorial.skillsLearned.slice(0, 3).map((skill, i) => (
            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {skill}
            </span>
          ))}
          {tutorial.skillsLearned && tutorial.skillsLearned.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
              +{tutorial.skillsLearned.length - 3} more
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-3 flex items-center">
          <span className="mr-1">⏱️</span> Estimated time: {tutorial.estimatedTime || 60} minutes
        </p>
        <div className="mt-4">
          <Progress 
            value={progress.includes(tutorial.id) ? 100 : 0} 
            className={progress.includes(tutorial.id) ? "bg-green-100" : "bg-gray-100"}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => startTutorial(tutorial)}
          className="w-full"
          variant={progress.includes(tutorial.id) ? "outline" : "default"}
        >
          {progress.includes(tutorial.id) ? 'Review Lesson' : 'Start Lesson'}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Digital Marketing Learning Center</h2>
      
      {!currentTutorial ? (
        <div>
          {renderLearningPath()}
          
          <div className="mt-8 mb-6">
            <Tabs defaultValue="learning-path">
              <TabsList className="mb-6">
                <TabsTrigger value="learning-path">Learning Path</TabsTrigger>
                <TabsTrigger value="categories">By Category</TabsTrigger>
                <TabsTrigger value="levels">By Level</TabsTrigger>
              </TabsList>
              
              {/* Learning Path Tab */}
              <TabsContent value="learning-path">
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">Recommended Learning Path</h3>
                    <p className="text-gray-700">Follow this structured learning path for the best results. Start with the foundations and work your way up to advanced topics.</p>
                  </div>
                  
                  {/* Foundation */}
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">1</span>
                      Foundations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tutorials
                        .filter(t => t.level.toLowerCase().includes('beginner') || t.title.toLowerCase().includes('foundation'))
                        .slice(0, 3)
                        .map(renderTutorialCard)}
                    </div>
                  </div>
                  
                  {/* Core Skills */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">2</span>
                      Core Skills
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tutorials
                        .filter(t => !t.level.toLowerCase().includes('beginner') && !t.level.toLowerCase().includes('advanced'))
                        .slice(0, 3)
                        .map(renderTutorialCard)}
                    </div>
                  </div>
                  
                  {/* Advanced Techniques */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">3</span>
                      Advanced Techniques
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tutorials
                        .filter(t => t.level.toLowerCase().includes('advanced'))
                        .slice(0, 3)
                        .map(renderTutorialCard)}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Categories Tab */}
              <TabsContent value="categories">
                <div className="space-y-10">
                  {Object.entries(categorizedTutorials).map(([category, tutorialsInCategory]) => 
                    tutorialsInCategory.length > 0 ? (
                      <div key={category} className="mb-8">
                        <h3 className="text-xl font-bold text-blue-900 mb-4 pb-2 border-b">
                          {category}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {tutorialsInCategory.map(renderTutorialCard)}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </TabsContent>
              
              {/* Levels Tab */}
              <TabsContent value="levels">
                <div className="space-y-10">
                  {/* Beginner Tutorials */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-blue-900 mb-4 pb-2 border-b flex items-center">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full mr-2">Beginner</span>
                      Start Here
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tutorials
                        .filter(t => t.level.toLowerCase().includes('beginner'))
                        .map(renderTutorialCard)}
                    </div>
                  </div>
                  
                  {/* Intermediate Tutorials */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-blue-900 mb-4 pb-2 border-b flex items-center">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full mr-2">Intermediate</span>
                      Build Your Skills
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tutorials
                        .filter(t => t.level.toLowerCase().includes('intermediate'))
                        .map(renderTutorialCard)}
                    </div>
                  </div>
                  
                  {/* Advanced Tutorials */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-blue-900 mb-4 pb-2 border-b flex items-center">
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full mr-2">Advanced</span>
                      Master Your Craft
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          
          <Card className="mb-6">
            <CardHeader className="pb-2 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{currentTutorial.title}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {currentTutorial.level}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className={`tutorial-slide ${slideAnimation}`}>
                {slides.length > 0 && (
                  <>
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold mb-2">{slides[currentSlideIndex].title}</h4>
                      <Separator className="mb-4" />
                    </div>
                    
                    <div className="min-h-[400px]">
                      {renderSlideContent(slides[currentSlideIndex])}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-4 border-t flex justify-between">
              <Button 
                onClick={prevSlide} 
                disabled={currentSlideIndex === 0}
                variant="outline"
              >
                Previous
              </Button>
              
              <div className="flex space-x-1">
                {slides.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentSlideIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                    onClick={() => setCurrentSlideIndex(index)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </div>
              
              {currentSlideIndex === slides.length - 1 ? (
                <Button 
                  onClick={() => completeTutorial(currentTutorial.id)}
                  disabled={isCompleting}
                >
                  {isCompleting ? 'Completing...' : 'Complete Tutorial'}
                </Button>
              ) : (
                <Button onClick={nextSlide}>
                  Next
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
            <Accordion type="single" collapsible>
              <AccordionItem value="resources">
                <AccordionTrigger>Additional Resources</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">
                        📄
                      </span>
                      <a href="#" className="text-blue-600 hover:underline">
                        Downloadable PDF Guide
                      </a>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">
                        🎬
                      </span>
                      <a href="#" className="text-blue-600 hover:underline">
                        Supplementary Video Tutorial
                      </a>
                    </li>
                    <li className="flex items-center">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">
                        🔗
                      </span>
                      <a href="#" className="text-blue-600 hover:underline">
                        Google Documentation Reference
                      </a>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="tasks">
                <AccordionTrigger>Tutorial Tasks</AccordionTrigger>
                <AccordionContent>
                  {currentTutorial.tasks.map((task, index) => (
                    <div key={task.id} className="mb-4 last:mb-0 p-3 bg-gray-50 rounded-md">
                      <h5 className="font-medium">Task {index + 1}: {task.description}</h5>
                      <p className="text-sm text-gray-600 mt-1">Type: {task.type}</p>
                      
                      <div className="mt-2">
                        <h6 className="text-sm font-medium">Requirements:</h6>
                        <ul className="list-disc ml-5 text-sm">
                          {task.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
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
