import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDeepgramVoice } from "@/hooks/useDeepgramVoice";
import { getActiveInstructor } from "@/lib/instructorConfig";
import { InfoIcon, AlertTriangleIcon, CheckCircleIcon, LightbulbIcon, Headphones, Play, Square, Loader2 } from 'lucide-react';

// Define image metadata with topic tags for more intelligent content matching
interface ImageMetadata {
  path: string;
  topics: string[];  // Topics this image relates to
  description: string; // Brief description of what's in the image
}

// Comprehensive image metadata system to enable context-aware image selection
const imageMetadata: ImageMetadata[] = [
  {
    path: '/images/small-business.jpeg',
    topics: ['small business', 'entrepreneurship', 'business planning', 'marketing basics', 'digital strategy'],
    description: 'Small business owner working at a desk'
  },
  {
    path: '/images/womanwork.jpeg',
    topics: ['professional', 'women in business', 'marketing strategy', 'campaign planning', 'analytics'],
    description: 'Professional woman working on digital marketing'
  },
  {
    path: '/images/group-thinking.jpeg',
    topics: ['team collaboration', 'brainstorming', 'marketing team', 'strategy meeting', 'campaign planning'],
    description: 'Marketing team collaborating on strategy'
  },
  {
    path: '/images/ad-image.jpeg',
    topics: ['google ads', 'ppc', 'advertising', 'digital ads', 'campaign management', 'display advertising'],
    description: 'Digital advertising campaign visualization'
  },
  {
    path: '/images/wiered-headshot.jpeg',
    topics: ['networking', 'social media', 'audience targeting', 'customer persona', 'targeting'],
    description: 'Connected network visualization representing audience targeting'
  },
  {
    path: '/images/cart-with-packages.jpeg',
    topics: ['e-commerce', 'shopping', 'conversion', 'google shopping', 'retail advertising'],
    description: 'Shopping cart with packages representing e-commerce'
  },
  {
    path: '/images/seo-visual.jpeg',
    topics: ['seo', 'search engine', 'website optimization', 'organic traffic', 'digital visibility'],
    description: 'SEO and search engine optimization visualization'
  },
  // Adding alternate versions with correct naming that exist in the filesystem
  {
    path: '/images/small-business-alt.jpeg',
    topics: ['small business', 'entrepreneurship', 'business planning', 'marketing basics', 'digital strategy'],
    description: 'Small business owner working at a desk (alt)'
  },
  {
    path: '/images/smallbusinessspelled.jpeg',
    topics: ['small business', 'entrepreneurship', 'business strategy', 'startup'],
    description: 'Small business planning and strategy'
  }
];

// Topic mapping for chapters to ensure contextual relevance
const chapterTopics: Record<number, string[]> = {
  1: ['marketing basics', 'digital strategy', 'small business', 'entrepreneurship'], // Digital Marketing Basics
  2: ['google ads', 'ppc', 'advertising', 'digital ads'], // Google Ads Fundamentals
  3: ['campaign management', 'strategy meeting', 'marketing team', 'campaign planning'], // Campaign Management
  4: ['audience targeting', 'customer persona', 'targeting', 'social media'], // Audience Strategies
  5: ['analytics', 'testing', 'optimization', 'data analysis'], // Analytics & Testing
  6: ['advanced marketing', 'marketing strategy', 'digital visibility'], // Advanced Marketing
  7: ['seo', 'search engine', 'website optimization', 'organic traffic'], // SEO Specialization
  8: ['troubleshooting', 'problem solving', 'conversion optimization', 'shopping'] // Troubleshooting
};

// Specific tutorial-to-image mappings for perfect content alignment
// Key format: "chapter-tutorialIndex" (e.g., "1-2" = Chapter 1, second tutorial)
const tutorialImageMappings: Record<string, string> = {
  "1-1": '/images/small-business-alt.jpeg', // Digital Marketing Foundations
  "1-2": '/images/group-thinking.jpeg', // Marketing Strategy Essentials
  "1-3": '/images/smallbusinessspelled.jpeg', // Brand Building Online
  
  "2-1": '/images/ad-image.jpeg',       // Google Ads Platform Intro
  "2-2": '/images/small-business-alt.jpeg', // Google Ads Account Structure
  "2-3": '/images/group-thinking.jpeg', // Campaign Types Overview
  "2-4": '/images/ad-image.jpeg',       // Keyword Research Mastery
  "2-5": '/images/wiered-headshot.jpeg', // Ad Writing Best Practices
  
  "3-1": '/images/cart-with-packages.jpeg', // Campaign Setup Guide
  "3-2": '/images/group-thinking.jpeg', // Budget Optimization
  "3-3": '/images/ad-image.jpeg',       // Performance Monitoring
  
  "4-1": '/images/wiered-headshot.jpeg', // Audience Targeting Guide
  
  "5-1": '/images/seo-visual.jpeg',     // Analytics Fundamentals
  "5-2": '/images/group-thinking.jpeg', // A/B Testing Framework
  "5-3": '/images/ad-image.jpeg',       // Conversion Tracking Setup
  "5-4": '/images/small-business-alt.jpeg', // Data-Driven Decision Making
  "5-5": '/images/wiered-headshot.jpeg', // Marketing Measurement Models
  
  "6-1": '/images/ad-image.jpeg',       // Advanced Google Ads Tactics
  "6-2": '/images/seo-visual.jpeg',     // Cross-Channel Integration
  "6-3": '/images/wiered-headshot.jpeg', // Automation & AI in Marketing
  "6-4": '/images/group-thinking.jpeg', // International Marketing
  
  "7-1": '/images/seo-visual.jpeg',     // SEO Fundamentals
  "7-2": '/images/smallbusinessspelled.jpeg', // On-Page Optimization
  "7-3": '/images/cart-with-packages.jpeg', // Content Strategy for SEO
  "7-4": '/images/seo-visual.jpeg',     // Technical SEO Guide
  "7-5": '/images/group-thinking.jpeg', // Local SEO Strategies
  "7-6": '/images/ad-image.jpeg',       // SEO & PPC Integration
  
  "8-1": '/images/cart-with-packages.jpeg', // Troubleshooting Google Ads
  "8-2": '/images/wiered-headshot.jpeg', // Recovery Strategies for Declining Campaigns
  "8-3": '/images/small-business-alt.jpeg'   // Competitive Analysis Framework
};

// Helper function to get image path based on chapter, tutorial, and context
const getImagePath = (imageKey: string, chapterNumber?: number, tutorialIndex?: number): string => {
  // First priority: Check if we have an exact tutorial mapping
  if (chapterNumber !== undefined && tutorialIndex !== undefined) {
    const tutorialKey = `${chapterNumber}-${tutorialIndex}`;
    if (tutorialImageMappings[tutorialKey]) {
      return tutorialImageMappings[tutorialKey];
    }
  }
  
  // Second priority: Match image to content topic based on chapter
  if (chapterNumber !== undefined) {
    const relevantTopics = chapterTopics[chapterNumber] || [];
    
    // Find images that match the chapter topics
    const matchingImages = imageMetadata.filter(img => 
      img.topics.some(topic => relevantTopics.includes(topic))
    );
    
    if (matchingImages.length > 0) {
      // Generate a consistent index based on the imageKey to always get same image for same key
      const hash = imageKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const index = hash % matchingImages.length;
      return matchingImages[index].path;
    }
  }
  
  // Third priority: Match directly by keyword to image
  const keywordMatches = imageMetadata.filter(img => 
    img.topics.some(topic => imageKey.toLowerCase().includes(topic.toLowerCase())) ||
    img.description.toLowerCase().includes(imageKey.toLowerCase())
  );
  
  if (keywordMatches.length > 0) {
    return keywordMatches[0].path;
  }
  
  // Final fallback: Use a default image
  return '/images/small-business-alt.jpeg';
};

interface TutorialContentRendererProps {
  content: string;
  chapterNumber?: number; // Optional chapter number for better image selection
  tutorialIndex?: number; // Optional tutorial index within chapter for precise image mapping
  hideAudioBar?: boolean; // When true, hides the audio narration bar for pure text study
}

/**
 * Enhanced tutorial content renderer component that converts markdown to interactive HTML
 * with support for images, accordions, sliders, tabs, and alerts
 */
const TutorialContentRenderer: React.FC<TutorialContentRendererProps> = ({ 
  content, 
  chapterNumber,
  tutorialIndex,
  hideAudioBar = false
}) => {
  const [sliderValues, setSliderValues] = useState<Record<string, number[]>>({});
  
  const track = (chapterNumber === 1) ? "seo" : (chapterNumber === 2) ? "ads" : "general";
  const instructor = getActiveInstructor(track);
  const deepgramVoice = useDeepgramVoice({
    defaultVoice: instructor.voice
  });

  const handlePlayStudyGuideAudio = () => {
    // Extract clean readable text from markdown/HTML content
    const cleanContent = content
      .replace(/\[IMAGE:.*?\]/g, '')
      .replace(/\[ACCORDION:.*?\]/g, '')
      .replace(/\[SLIDER:.*?\]/g, '')
      .replace(/\[TABS:.*?\]/g, '')
      .replace(/\[INFO\](.*?)\[\/INFO\]/gs, '$1')
      .replace(/\[WARNING\](.*?)\[\/WARNING\]/gs, '$1')
      .replace(/\[TIP\](.*?)\[\/TIP\]/gs, '$1')
      .replace(/\[SUCCESS\](.*?)\[\/SUCCESS\]/gs, '$1')
      .replace(/<[^>]*>/g, ' ')
      .replace(/#+\s*/g, '')
      .replace(/[*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const narrativeText = cleanContent.length > 4000
      ? cleanContent.slice(0, 4000) + "... Please review the full written guide below for detailed examples and figures."
      : cleanContent;

    deepgramVoice.speak(narrativeText, instructor.voice);
  };
  
  // Process special tags in the content
  const processContent = () => {
    // Start with comprehensive markdown to HTML conversion for headings, lists, bold, etc.
    const processedContent = content
      .replace(/^# (.*?)$/gm, (_, heading) => `</p><h1 class="text-xl sm:text-2xl font-black text-white mb-4 sm:mb-6 border-b border-white/20 pb-2 sm:pb-3">${heading}</h1><p class="text-slate-200 text-sm sm:text-base mb-3 sm:mb-4 font-medium leading-relaxed">`)
      .replace(/^## (.*?)$/gm, (_, heading) => `</p><h2 class="text-lg sm:text-xl font-bold text-[#ffd700] mt-5 sm:mt-6 mb-2 sm:mb-3">${heading}</h2><p class="text-slate-200 text-sm sm:text-base mb-3 sm:mb-4 font-medium leading-relaxed">`)
      .replace(/^### (.*?)$/gm, (_, heading) => `</p><h3 class="text-base sm:text-lg font-semibold text-[#ffd700] mt-4 sm:mt-5 mb-2">${heading}</h3><p class="text-slate-200 text-sm sm:text-base mb-3 sm:mb-4 font-medium leading-relaxed">`)
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*([^\*\n]+)\*/g, '<em class="text-amber-200/90">$1</em>')
      .replace(/`([^`\n]+)`/g, '<code class="bg-black/50 text-amber-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
      .replace(/^[*-•]\s+(.*?)$/gm, '<li class="ml-4 list-disc text-slate-200 my-1 leading-relaxed text-sm sm:text-base">$1</li>')
      .replace(/^(\d+)\.\s+(.*?)$/gm, '<li class="ml-4 list-decimal text-slate-200 my-1 leading-relaxed text-sm sm:text-base"><span class="text-amber-400 font-semibold">$1.</span> $2</li>')
      .replace(/<\/li>\n/g, '</li>')
      .replace(/\n\n/g, '</p><p class="text-slate-200 text-sm sm:text-base mb-3 sm:mb-4 font-medium leading-relaxed">')
      .replace(/\n/g, '<br />')
      .replace(/^/, '<p class="text-slate-200 text-sm sm:text-base mb-3 sm:mb-4 font-medium leading-relaxed">')
      .replace(/$/, '</p>')
      .replace(/<p[^>]*><\/p>/g, '');
    
    // Parse special tags and return the result
    return processSpecialTags(processedContent);
  };
  
  // Process special tags like [IMAGE], [ACCORDION], etc.
  const processSpecialTags = (htmlContent: string): React.ReactNode[] => {
    // Split the content by special tags for processing
    const parts = htmlContent.split(/(\[IMAGE:.*?\]|\[ACCORDION:.*?\]|\[SLIDER:.*?\]|\[TABS:.*?\]|\[INFO\].*?\[\/INFO\]|\[WARNING\].*?\[\/WARNING\]|\[TIP\].*?\[\/TIP\]|\[SUCCESS\].*?\[\/SUCCESS\])/g);
    
    return parts.map((part, index) => {
      // Process IMAGE tags
      if (part.startsWith('[IMAGE:')) {
        const imageKey = part.substring(7, part.length - 1).trim();
        const imagePath = getImagePath(imageKey, chapterNumber, tutorialIndex);
        return (
          <div key={`image-${index}`} className="my-4 rounded-lg overflow-hidden shadow-md">
            <img 
              src={imagePath} 
              alt={imageKey} 
              className="w-auto h-48 object-contain"
            />
            <div className="text-sm text-center text-gray-400 py-1 bg-black/30">
              {imageKey.replace(/_/g, ' ')}
            </div>
          </div>
        );
      }
      
      // Process ACCORDION tags
      else if (part.startsWith('[ACCORDION:')) {
        const accordionContent = part.substring(11, part.length - 1).trim();
        const sections = accordionContent.split('|').map(section => {
          const [title, content] = section.split(':').map(s => s.trim());
          return { title, content };
        });
        
        return (
          <Accordion key={`accordion-${index}`} type="single" collapsible className="my-4 border border-[#ffd700]/20 rounded-lg">
            {sections.map((section, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="px-4 text-[#ffd700] hover:text-[#ffd700]/80 hover:no-underline">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 text-slate-200 font-medium">
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        );
      }
      
      // Process SLIDER tags
      else if (part.startsWith('[SLIDER:')) {
        const sliderContent = part.substring(8, part.length - 1).trim();
        const [sliderId, minValue, maxValue, stepValue, defaultValue, label] = sliderContent.split('|').map(s => s.trim());
        
        // Initialize slider state if not already present
        if (!sliderValues[sliderId]) {
          setSliderValues(prev => ({
            ...prev,
            [sliderId]: [parseInt(defaultValue) || parseInt(minValue) || 0]
          }));
        }
        
        return (
          <div key={`slider-${index}`} className="my-4 p-4 bg-[#222] rounded-lg border border-[#ffd700]/20">
            <div className="mb-2 flex justify-between">
              <span className="text-[#ffd700]">{label}</span>
              <span className="text-white font-medium">{sliderValues[sliderId] ? sliderValues[sliderId][0] : defaultValue}</span>
            </div>
            <Slider
              defaultValue={[parseInt(defaultValue) || parseInt(minValue) || 0]}
              max={parseInt(maxValue) || 100}
              min={parseInt(minValue) || 0}
              step={parseInt(stepValue) || 1}
              value={sliderValues[sliderId]}
              onValueChange={(value) => setSliderValues(prev => ({ ...prev, [sliderId]: value }))}
              className="my-2"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{minValue}</span>
              <span>{maxValue}</span>
            </div>
          </div>
        );
      }
      
      // Process TABS tags
      else if (part.startsWith('[TABS:')) {
        const tabsContent = part.substring(6, part.length - 1).trim();
        const tabs = tabsContent.split('|').map(tab => {
          const [title, content] = tab.split(':').map(s => s.trim());
          return { title, content };
        });
        
        return (
          <Tabs key={`tabs-${index}`} defaultValue={tabs[0].title} className="my-4">
            <TabsList className="w-full grid" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
              {tabs.map((tab, idx) => (
                <TabsTrigger key={idx} value={tab.title} className="text-sm">{tab.title}</TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab, idx) => (
              <TabsContent key={idx} value={tab.title} className="p-4 border border-t-0 border-[#ffd700]/10 rounded-b-lg mt-0">
                <div dangerouslySetInnerHTML={{ __html: tab.content }} />
              </TabsContent>
            ))}
          </Tabs>
        );
      }
      
      // Process INFO boxes
      else if (part.startsWith('[INFO]')) {
        const infoContent = part.substring(6, part.length - 7).trim();
        return (
          <Alert key={`info-${index}`} className="my-4 bg-blue-950/30 border-blue-500/30">
            <InfoIcon className="h-5 w-5 text-blue-500" />
            <AlertTitle className="text-blue-400">Information</AlertTitle>
            <AlertDescription className="text-slate-200 font-medium">
              <div dangerouslySetInnerHTML={{ __html: infoContent }} />
            </AlertDescription>
          </Alert>
        );
      }
      
      // Process WARNING boxes
      else if (part.startsWith('[WARNING]')) {
        const warningContent = part.substring(9, part.length - 10).trim();
        return (
          <Alert key={`warning-${index}`} className="my-4 bg-red-950/30 border-red-500/30">
            <AlertTriangleIcon className="h-5 w-5 text-red-500" />
            <AlertTitle className="text-red-400">Warning</AlertTitle>
            <AlertDescription className="text-slate-200 font-medium">
              <div dangerouslySetInnerHTML={{ __html: warningContent }} />
            </AlertDescription>
          </Alert>
        );
      }
      
      // Process TIP boxes
      else if (part.startsWith('[TIP]')) {
        const tipContent = part.substring(5, part.length - 6).trim();
        return (
          <Alert key={`tip-${index}`} className="my-4 bg-yellow-950/30 border-yellow-500/30">
            <LightbulbIcon className="h-5 w-5 text-yellow-500" />
            <AlertTitle className="text-yellow-400">Tip</AlertTitle>
            <AlertDescription className="text-slate-200 font-medium">
              <div dangerouslySetInnerHTML={{ __html: tipContent }} />
            </AlertDescription>
          </Alert>
        );
      }
      
      // Process SUCCESS boxes
      else if (part.startsWith('[SUCCESS]')) {
        const successContent = part.substring(9, part.length - 10).trim();
        return (
          <Alert key={`success-${index}`} className="my-4 bg-green-950/30 border-green-500/30">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <AlertTitle className="text-green-400">Success</AlertTitle>
            <AlertDescription className="text-slate-200 font-medium">
              <div dangerouslySetInnerHTML={{ __html: successContent }} />
            </AlertDescription>
          </Alert>
        );
      }
      
      // Regular HTML content
      else {
        return <div key={`content-${index}`} dangerouslySetInnerHTML={{ __html: part }} />;
      }
    });
  };
  
  // For basic markdown content that doesn't have our special tags yet,
  // let's enhance it automatically with some images and interactive elements
  const enhanceBasicContent = () => {
    // Check if the content has any of our special tags
    const hasSpecialTags = content.match(/\[IMAGE:.*?\]|\[ACCORDION:.*?\]|\[SLIDER:.*?\]|\[TABS:.*?\]|\[INFO\].*?\[\/INFO\]|\[WARNING\].*?\[\/WARNING\]|\[TIP\].*?\[\/TIP\]|\[SUCCESS\].*?\[\/SUCCESS\]/);
    
    if (hasSpecialTags) {
      // If content already has special tags, just process it normally
      return processContent();
    }
    
    // Otherwise, let's automatically enhance it
    
    // Extract headings from the content to use in the auto-enhancement
    const headings = content.match(/##\s+(.*?)$/gm) || [];
    const headingTexts = headings.map(h => h.replace(/^## /, '').toLowerCase());
    
    // Detect what kind of tutorial this is to add appropriate images
    const contentLower = content.toLowerCase();
    
    // Add components based on content detection
    let enhancedContent = [];
    
    // 1. Add initial image based on content and make it more varied
    let initialImage = 'default';
    
    // Extract title if possible from first ## heading
    const titleMatch = content.match(/##\s+(.*?)$/m);
    const title = titleMatch ? titleMatch[1].toLowerCase() : '';
    
    // Check for specific keywords in title or content to assign more specific images
    if (title.includes('google ads') || contentLower.includes('google ads')) {
      if (contentLower.includes('mastery')) initialImage = 'google_ads_mastery';
      else if (contentLower.includes('platform')) initialImage = 'google_ads_platform';
      else if (contentLower.includes('campaign') && contentLower.includes('type')) initialImage = 'google_ads_campaigns';
      else if (contentLower.includes('account') && contentLower.includes('architecture')) initialImage = 'account_architecture';
      else initialImage = 'google_ads_intro';
    } 
    else if (title.includes('seo') || contentLower.includes('seo')) {
      if (contentLower.includes('advanced')) initialImage = 'advanced_seo';
      else if (contentLower.includes('intermediate')) initialImage = 'seo_intermediate';
      else if (contentLower.includes('expert')) initialImage = 'seo_expert';
      else if (contentLower.includes('master')) initialImage = 'seo_master';
      else if (contentLower.includes('enhanced')) initialImage = 'seo_enhanced';
      else if (contentLower.includes('complete')) initialImage = 'seo_complete';
      else initialImage = 'seo_basics';
    }
    else if (contentLower.includes('analytics')) {
      if (contentLower.includes('foundation')) initialImage = 'analytics_foundations';
      else if (contentLower.includes('site')) initialImage = 'site_analytics';
      else if (contentLower.includes('data') && contentLower.includes('analysis')) initialImage = 'data_analysis';
      else initialImage = 'analytics_dashboard';
    }
    else if (contentLower.includes('email marketing') || contentLower.includes('automation')) {
      initialImage = 'email_automation';
    }
    else if (contentLower.includes('audience targeting')) {
      if (contentLower.includes('core')) initialImage = 'audience_core';
      else initialImage = 'audience_targeting';
    }
    else if (contentLower.includes('troubleshooting')) {
      if (contentLower.includes('best practices')) initialImage = 'troubleshooting_best';
      else if (contentLower.includes('tips')) initialImage = 'troubleshooting_tips';
      else initialImage = 'troubleshooting_ads';
    }
    else if (contentLower.includes('shopping')) {
      initialImage = 'shopping_campaigns';
    }
    else if (contentLower.includes('social media')) {
      initialImage = 'social_media';
    }
    else if (contentLower.includes('advanced')) {
      if (contentLower.includes('campaign') && contentLower.includes('strategies')) initialImage = 'advanced_strategies';
      else initialImage = 'advanced_strategies';
    }
    else if (contentLower.includes('campaign management')) {
      initialImage = 'campaign_management';
    }
    else if (contentLower.includes('goal setting')) {
      initialImage = 'goal_setting';
    }
    else if (contentLower.includes('testing')) {
      initialImage = 'testing_methods';
    }
    else if (contentLower.includes('digital marketing')) {
      if (contentLower.includes('getting started')) initialImage = 'getting_started';
      else if (contentLower.includes('basics')) initialImage = 'marketing_basics';
      else initialImage = 'digital_marketing_intro';
    }
    
    // Use a direct image path based on chapter and tutorial index if available
    const imagePath = getImagePath(initialImage, chapterNumber, tutorialIndex);
    const fallbackImage = '/images/smallbusinessspelled.jpeg'; // A reliable fallback image
    
    console.log('Selected image path:', imagePath, 'for chapter:', chapterNumber, 'tutorial:', tutorialIndex);
    
    enhancedContent.push(
      <div key="auto-image" className="my-3 sm:my-4 rounded-lg overflow-hidden border-2 border-[#ffd700]/20 bg-gradient-to-r from-yellow-900/30 to-gray-900/50 relative z-10">
        <div className="w-full h-36 sm:h-48 md:h-56 flex items-center justify-center">
          <img 
            src={imagePath} 
            alt="Tutorial illustration" 
            className="w-auto h-full object-contain"
            onError={(e) => {
              console.log('Image failed to load:', imagePath);
              e.currentTarget.src = fallbackImage;
              e.currentTarget.className = "w-auto h-28 sm:h-32 object-contain my-3";
            }}
          />
        </div>
      </div>
    );
    
    // 2. Add the main content with markdown processing
    enhancedContent.push(
      <div key="main-content" dangerouslySetInnerHTML={{ 
        __html: content
          .replace(/^# (.*?)$/gm, (_, heading) => `</p><h1 class="text-xl sm:text-2xl font-black text-white mb-4 sm:mb-6 border-b border-white/20 pb-2 sm:pb-3">${heading}</h1><p class="text-slate-200 text-sm sm:text-base mb-3 sm:mb-4 font-normal leading-relaxed">`)
          .replace(/^## (.*?)$/gm, (_, heading) => `</p><h2 class="text-lg sm:text-xl font-bold text-amber-400 mt-6 sm:mt-8 mb-3 sm:mb-4 border-b border-white/10 pb-2">${heading}</h2><p class="text-slate-200 text-sm sm:text-base mb-3 sm:mb-4 font-normal leading-relaxed">`)
          .replace(/^### (.*?)$/gm, (_, heading) => `</p><h3 class="text-base sm:text-lg font-semibold text-emerald-400 mt-5 sm:mt-6 mb-2 sm:mb-3">${heading}</h3><p class="text-slate-200 text-sm sm:text-base mb-3 sm:mb-4 font-normal leading-relaxed">`)
          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
          .replace(/\*([^\*\n]+)\*/g, '<em class="text-amber-200/90">$1</em>')
          .replace(/`([^`\n]+)`/g, '<code class="bg-black/50 text-amber-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
          .replace(/^[*-•]\s+(.*?)$/gm, '<li class="ml-4 list-disc text-slate-200 my-1 leading-relaxed text-sm sm:text-base">$1</li>')
          .replace(/^(\d+)\.\s+(.*?)$/gm, '<li class="ml-4 list-decimal text-slate-200 my-1 leading-relaxed text-sm sm:text-base"><span class="text-amber-400 font-semibold">$1.</span> $2</li>')
          .replace(/<\/li>\n/g, '</li>')
          .replace(/\n\n/g, '</p><p class="text-slate-200 text-sm sm:text-base mb-3 sm:mb-4 font-normal leading-relaxed">')
          .replace(/\n/g, '<br />')
          .replace(/^/, '<p class="text-slate-200 text-sm sm:text-base mb-3 sm:mb-4 font-normal leading-relaxed">')
          .replace(/$/, '</p>')
          .replace(/<p[^>]*><\/p>/g, '')
      }} />
    );
    
    // 3. Add an auto-generated accordion Q&A section if key headings are found
    if (headingTexts.some(h => 
        h.includes('key') || 
        h.includes('takeaway') || 
        h.includes('summary') || 
        h.includes('concept'))) {
      
      enhancedContent.push(
        <div key="auto-accordion" className="mt-5 sm:mt-6">
          <h3 className="text-base sm:text-lg font-semibold text-amber-400 mt-4 sm:mt-5 mb-3 sm:mb-4">Key Concepts Review</h3>
          <Accordion type="single" collapsible className="border border-white/10 rounded-lg">
            {/* Extract key concepts based on content */}
            {generateKeyConceptsFromContent(content).map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="px-3 sm:px-4 py-2.5 sm:py-3 text-amber-400 hover:text-amber-300 hover:no-underline text-xs sm:text-sm text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-3 sm:px-4 pt-1 sm:pt-2 pb-3 text-slate-200 text-xs sm:text-sm font-normal">
                  <div 
                    className="space-y-1.5 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderAccordionAnswer(item.answer) }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      );
    }
    
    // 4. Add an info box tip if appropriate for the content
    if (contentLower.includes('optimization') || 
        contentLower.includes('strategy') || 
        contentLower.includes('best practice')) {
      
      enhancedContent.push(
        <Alert key="auto-tip" className="my-6 bg-yellow-950/30 border-yellow-500/30">
          <LightbulbIcon className="h-5 w-5 text-yellow-500" />
          <AlertTitle className="text-yellow-400">Pro Tip</AlertTitle>
          <AlertDescription className="text-slate-200 text-sm font-normal">
            Start with small tests before scaling up your marketing efforts. This approach allows you to refine your strategy based on real data while minimizing risk.
          </AlertDescription>
        </Alert>
      );
    }
    
    return enhancedContent;
  };
  
  // Helper to format accordion answers with proper markdown support (bold, lists, code)
  const renderAccordionAnswer = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*([^\*\n]+)\*/g, '<em class="text-amber-200/90">$1</em>')
      .replace(/`([^`\n]+)`/g, '<code class="bg-black/50 text-amber-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
      .replace(/^[*-•]\s+(.*?)$/gm, '<li class="ml-4 list-disc text-slate-200 my-1 leading-relaxed">$1</li>')
      .replace(/^(\d+)\.\s+(.*?)$/gm, '<li class="ml-4 list-decimal text-slate-200 my-1 leading-relaxed"><span class="text-amber-400 font-semibold">$1.</span> $2</li>')
      .replace(/<\/li>\n/g, '</li>')
      .replace(/\n\n+/g, '</p><p class="mt-2 text-slate-200 text-sm font-normal leading-relaxed">')
      .replace(/\n/g, '<br />')
      .replace(/^/, '<p class="text-slate-200 text-sm font-normal leading-relaxed">')
      .replace(/$/, '</p>')
      .replace(/<p[^>]*><\/p>/g, '');
  };

  // Helper function to generate Q&A items from content
  const generateKeyConceptsFromContent = (content: string): Array<{question: string, answer: string}> => {
    const contentLower = content.toLowerCase();
    const concepts: Array<{question: string, answer: string}> = [];
    
    // Extract headings and use them to generate questions
    const headings = content.match(/##\s+(.*?)$/gm) || [];
    headings.forEach(heading => {
      const rawTitle = heading.replace(/^##\s+/, '').trim();
      const cleanTitle = rawTitle
        .replace(/^[\d\.\s\-\:]+/, '')
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}⚠️🛡️⚡🎯💡🚀]/gu, '')
        .replace(/[:\s]+$/, '')
        .trim();

      const answer = generateAnswerForHeading(rawTitle, content);
      if (answer && answer.trim().length > 0) {
        concepts.push({
          question: `What is meant by "${cleanTitle || rawTitle}"?`,
          answer: answer
        });
      }
    });
    
    // Add platform-specific questions based on content
    if (contentLower.includes('google ads') && concepts.length < 4) {
      concepts.push({
        question: "What are the main Google Ads campaign types?",
        answer: "Google Ads offers various campaign types including Search, Display, Video, Shopping, and App campaigns. Each type is optimized for different marketing objectives and customer touchpoints."
      });
    }
    
    if (contentLower.includes('seo') && concepts.length < 4) {
      concepts.push({
        question: "What are the core elements of SEO?",
        answer: "Search Engine Optimization consists of on-page optimization (content, meta tags, headings), technical SEO (site speed, mobile-friendliness, structured data), and off-page factors (backlinks, social signals). All these elements work together to improve search rankings."
      });
    }
    
    // If we couldn't generate enough concepts, add some generic ones
    if (concepts.length < 3) {
      concepts.push({
        question: "How do I apply these concepts to my business?",
        answer: "Start by identifying your business objectives and target audience. Then, implement these strategies gradually, measuring results and optimizing as you go. Remember that digital marketing is an iterative process that improves over time with testing and refinement."
      });
      
      concepts.push({
        question: "What tools can help implement these strategies?",
        answer: "Various tools can assist you, including Google Analytics for measurement, SEO tools like Semrush or Ahrefs for keyword research, and platform-specific tools like Google Ads Editor or Facebook Ads Manager for campaign management."
      });
    }
    
    // Return only up to 5 concepts to avoid overwhelming the user
    return concepts.slice(0, 5);
  };
  
  // Helper function to generate an answer based on heading and content
  const generateAnswerForHeading = (rawHeading: string, content: string): string => {
    // Escape regex special characters in the heading to prevent RegExp errors
    const escapedHeading = rawHeading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const headingPattern = new RegExp(`(?:^|\\n)##\\s*${escapedHeading}\\s*\\n+([\\s\\S]*?)(?=\\n##\\s+|$)`, 'i');
    const match = content.match(headingPattern);
    
    if (match && match[1]) {
      const sectionText = match[1].trim();
      if (sectionText.length > 0) {
        return sectionText;
      }
    }
    
    // Fallback if we couldn't extract content
    return `${rawHeading} is a key concept in this tutorial. Review the section above for a detailed explanation.`;
  };
  
  return (
    <div className="tutorial-content">
      {/* Study Guide Audio Narration Bar (Deepgram Aura) */}
      {!hideAudioBar && (
        <div className="not-prose mb-6 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-primary/10 via-background to-secondary/30 border border-primary/20 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">
              <Headphones className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                <span>Listen to the Lesson</span>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                  Deepgram Aura
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {deepgramVoice.isSpeaking 
                  ? `Narration in progress (${instructor.name}'s voice)...` 
                  : "Listen to the complete audio narration of today's lesson notes, read aloud."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Speed selection pills */}
            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-0.5 border border-border/40 text-[10px] font-bold mr-1">
              {[
                { label: '0.80x', rate: 0.80 },
                { label: '0.88x (Calm)', rate: 0.88 },
                { label: '1.0x', rate: 1.0 }
              ].map(item => (
                <button
                  key={item.rate}
                  type="button"
                  onClick={() => deepgramVoice.setPlaybackRate(item.rate)}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    deepgramVoice.playbackRate === item.rate
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={`Play at ${item.label} speed`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {deepgramVoice.isSpeaking ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deepgramVoice.stop()}
                className="h-8 text-xs gap-1.5 font-bold shadow"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>Stop Narration</span>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="default"
                onClick={handlePlayStudyGuideAudio}
                disabled={deepgramVoice.isLoading}
                className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow"
              >
                {deepgramVoice.isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Play className="h-3.5 w-3.5 fill-current" />
                )}
                <span>{deepgramVoice.isLoading ? "Loading Audio..." : "Start Listening"}</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {enhanceBasicContent()}
    </div>
  );
};

export default TutorialContentRenderer;
