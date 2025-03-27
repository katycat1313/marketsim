import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon, CheckCircleIcon, LightbulbIcon } from 'lucide-react';

// Mapping of image references to actual image paths
const imageMap: Record<string, string> = {
  // Google Ads images
  'google_ads_overview': '/attached_assets/ad-image.jpeg',
  'campaign_types': '/attached_assets/smallbusinessspelled.jpeg',
  'search_network': '/attached_assets/seo-visual.jpeg',
  'display_network': '/attached_assets/small business.jpeg',
  'analytics_dashboard': '/attached_assets/group-thinking.jpeg',
  'email_marketing': '/attached_assets/wiered-headshot.jpeg',
  'seo_optimization': '/attached_assets/seo-visual.jpeg',
  'troubleshooting': '/attached_assets/cart-with-packages.jpeg',
  'small_business': '/attached_assets/small business.jpeg',
  'marketing_team': '/attached_assets/group-thinking.jpeg',
  'shopping_cart': '/attached_assets/cart-with-packages.jpeg',
  
  // Chapter 1 specific
  'digital_marketing_intro': '/attached_assets/smallbusinessspelled.jpeg',
  
  // Chapter 2 specific
  'google_ads_intro': '/attached_assets/ad-image.jpeg',
  
  // Chapter 3 specific
  'advanced_strategies': '/attached_assets/womanwork.jpeg',
  
  // Chapter 7 specific
  'seo_basics': '/attached_assets/seo-visual.jpeg',
  
  // Default fallback images
  'default': '/attached_assets/small business.jpeg'
};

// Helper function to get image path
const getImagePath = (imageKey: string): string => {
  return imageMap[imageKey] || imageMap['default'];
};

interface TutorialContentRendererProps {
  content: string;
}

/**
 * Enhanced tutorial content renderer component that converts markdown to interactive HTML
 * with support for images, accordions, sliders, tabs, and alerts
 */
const TutorialContentRenderer: React.FC<TutorialContentRendererProps> = ({ content }) => {
  const [sliderValues, setSliderValues] = useState<Record<string, number[]>>({});
  
  // Process special tags in the content
  const processContent = () => {
    // Start with basic markdown to HTML conversion for paragraphs, headings, etc.
    const processedContent = content
      .replace(/\n\n/g, '</p><p class="text-gray-100 mb-4">')
      .replace(/\n/g, '<br />')
      .replace(/^/, '<p class="text-gray-100 mb-4">')
      .replace(/$/, '</p>')
      .replace(/## (.*?)$/gm, (_, heading) => `</p><h2 class="text-xl font-bold text-[#ffd700] mt-6 mb-3">${heading}</h2><p class="text-gray-100 mb-4">`)
      .replace(/### (.*?)$/gm, (_, heading) => `</p><h3 class="text-lg font-semibold text-[#ffd700] mt-5 mb-2">${heading}</h3><p class="text-gray-100 mb-4">`);
    
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
        const imagePath = getImagePath(imageKey);
        return (
          <div key={`image-${index}`} className="my-4 rounded-lg overflow-hidden shadow-md">
            <img 
              src={imagePath} 
              alt={imageKey} 
              className="w-full object-cover max-h-64"
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
                <AccordionContent className="px-4 pt-2 text-gray-300">
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
            <AlertDescription className="text-gray-300">
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
            <AlertDescription className="text-gray-300">
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
            <AlertDescription className="text-gray-300">
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
            <AlertDescription className="text-gray-300">
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
    
    // 1. Add initial image based on content
    let initialImage = 'default';
    if (contentLower.includes('google ads')) initialImage = 'google_ads_intro';
    else if (contentLower.includes('seo')) initialImage = 'seo_basics';
    else if (contentLower.includes('analytics')) initialImage = 'analytics_dashboard';
    else if (contentLower.includes('email marketing')) initialImage = 'email_marketing';
    else if (contentLower.includes('advanced')) initialImage = 'advanced_strategies';
    else if (contentLower.includes('digital marketing')) initialImage = 'digital_marketing_intro';
    
    enhancedContent.push(
      <div key="auto-image" className="my-4 rounded-lg overflow-hidden shadow-md">
        <img 
          src={getImagePath(initialImage)} 
          alt="Tutorial illustration" 
          className="w-full object-cover max-h-64"
        />
      </div>
    );
    
    // 2. Add the main content with markdown processing
    enhancedContent.push(
      <div key="main-content" dangerouslySetInnerHTML={{ 
        __html: content
          .replace(/\n\n/g, '</p><p>')
          .replace(/\n/g, '<br />')
          .replace(/^/, '<p>')
          .replace(/$/, '</p>')
          .replace(/## (.*?)$/gm, (_, heading) => `</p><h2 class="text-xl font-bold text-[#ffd700] mt-6 mb-3">${heading}</h2><p>`)
          .replace(/### (.*?)$/gm, (_, heading) => `</p><h3 class="text-lg font-semibold text-[#ffd700] mt-5 mb-2">${heading}</h3><p>`)
      }} />
    );
    
    // 3. Add an auto-generated accordion Q&A section if key headings are found
    if (headingTexts.some(h => 
        h.includes('key') || 
        h.includes('takeaway') || 
        h.includes('summary') || 
        h.includes('concept'))) {
      
      enhancedContent.push(
        <div key="auto-accordion" className="mt-6">
          <h3 className="text-lg font-semibold text-[#ffd700] mt-5 mb-4">Key Concepts Review</h3>
          <Accordion type="single" collapsible className="border border-[#ffd700]/20 rounded-lg">
            {/* Extract key concepts based on content */}
            {generateKeyConceptsFromContent(content).map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="px-4 text-[#ffd700] hover:text-[#ffd700]/80 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 text-gray-300">
                  {item.answer}
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
          <AlertDescription className="text-gray-300">
            Start with small tests before scaling up your marketing efforts. This approach allows you to refine your strategy based on real data while minimizing risk.
          </AlertDescription>
        </Alert>
      );
    }
    
    return enhancedContent;
  };
  
  // Helper function to generate Q&A items from content
  const generateKeyConceptsFromContent = (content: string): Array<{question: string, answer: string}> => {
    const contentLower = content.toLowerCase();
    const concepts = [];
    
    // Extract headings and use them to generate questions
    const headings = content.match(/##\s+(.*?)$/gm) || [];
    headings.forEach(heading => {
      const title = heading.replace(/^## /, '');
      concepts.push({
        question: `What is meant by "${title}"?`,
        answer: generateAnswerForHeading(title, content)
      });
    });
    
    // Add platform-specific questions based on content
    if (contentLower.includes('google ads')) {
      concepts.push({
        question: "What are the main Google Ads campaign types?",
        answer: "Google Ads offers various campaign types including Search, Display, Video, Shopping, and App campaigns. Each type is optimized for different marketing objectives and customer touchpoints."
      });
    }
    
    if (contentLower.includes('seo')) {
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
  const generateAnswerForHeading = (heading: string, content: string): string => {
    // Extract the paragraph that follows the heading
    const headingPattern = new RegExp(`## ${heading}\\s*([\\s\\S]*?)(?=##|$)`, 'i');
    const match = content.match(headingPattern);
    
    if (match && match[1]) {
      // Take the first 250 characters as the answer
      const paragraphText = match[1].trim();
      const summary = paragraphText.length > 250 ? 
        paragraphText.substring(0, 250) + '...' : 
        paragraphText;
      return summary;
    }
    
    // Fallback if we couldn't extract content
    return `${heading} is a key concept in this tutorial. Review the section above for a detailed explanation.`;
  };
  
  return (
    <div className="tutorial-content">
      {enhanceBasicContent()}
    </div>
  );
};

export default TutorialContentRenderer;