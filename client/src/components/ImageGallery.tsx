import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Image, Check, Info } from 'lucide-react';

interface ImageOption {
  id: string;
  src: string;
  alt: string;
  quality: 'poor' | 'fair' | 'good';
  seoImpact: string;
  relevance: 'irrelevant' | 'partial' | 'relevant';
}

// Demo image options categorized by quality and relevance
const demoImages: Record<string, ImageOption[]> = {
  'product': [
    {
      id: 'product-1',
      src: 'https://placehold.co/600x400/png?text=High-Quality+Product+Image',
      alt: 'Detailed product with clear features',
      quality: 'good',
      seoImpact: 'High-quality product images with clear details improve user experience and reduce bounce rates.',
      relevance: 'relevant'
    },
    {
      id: 'product-2',
      src: 'https://placehold.co/600x400/png?text=Low-Quality+Product+Image',
      alt: 'Blurry product image',
      quality: 'poor',
      seoImpact: 'Poor image quality frustrates users and may indicate outdated or untrustworthy content to search engines.',
      relevance: 'relevant'
    },
    {
      id: 'product-3',
      src: 'https://placehold.co/600x400/png?text=Unrelated+Image',
      alt: 'Completely unrelated image',
      quality: 'good',
      seoImpact: 'Even high-quality images that are irrelevant to your content confuse users and search engines about your page purpose.',
      relevance: 'irrelevant'
    },
    {
      id: 'product-4',
      src: 'https://placehold.co/600x400/png?text=Generic+Stock+Photo',
      alt: 'Generic office setting',
      quality: 'good',
      seoImpact: 'Generic stock photos provide little value to users seeking specific information and miss opportunities for relevant keywords in alt text.',
      relevance: 'partial'
    }
  ],
  'location': [
    {
      id: 'location-1',
      src: 'https://placehold.co/600x400/png?text=Specific+Location+Image',
      alt: 'Detailed exterior of physical business location',
      quality: 'good',
      seoImpact: 'Location-specific images help with local SEO and provide users with valuable context about your business.',
      relevance: 'relevant'
    },
    {
      id: 'location-2',
      src: 'https://placehold.co/600x400/png?text=Generic+Building',
      alt: 'Generic building',
      quality: 'fair',
      seoImpact: 'Generic location images miss opportunities to showcase unique features of your business location.',
      relevance: 'partial'
    },
    {
      id: 'location-3',
      src: 'https://placehold.co/600x400/png?text=Unrelated+Landmark',
      alt: 'Famous landmark unrelated to business',
      quality: 'good',
      seoImpact: 'Using unrelated locations, even famous ones, creates confusion about your actual business location.',
      relevance: 'irrelevant'
    }
  ],
  'infographic': [
    {
      id: 'infographic-1',
      src: 'https://placehold.co/600x400/png?text=Optimized+Infographic',
      alt: 'Infographic showing key statistics with readable text',
      quality: 'good',
      seoImpact: 'Well-designed infographics with readable text and proper alt descriptions can significantly boost engagement and shareability.',
      relevance: 'relevant'
    },
    {
      id: 'infographic-2',
      src: 'https://placehold.co/600x400/png?text=Poor+Infographic',
      alt: 'Cluttered infographic with small text',
      quality: 'poor',
      seoImpact: 'Cluttered infographics with illegible text create a poor user experience and are less likely to be shared.',
      relevance: 'relevant'
    },
    {
      id: 'infographic-3',
      src: 'https://placehold.co/600x400/png?text=Irrelevant+Data+Visualization',
      alt: 'Data visualization on unrelated topic',
      quality: 'good',
      seoImpact: 'High-quality but irrelevant data visualizations can distract from your core message and confuse users about your content purpose.',
      relevance: 'irrelevant'
    }
  ]
};

interface ImageGalleryProps {
  onSelectImage: (image: ImageOption) => void;
  currentImageSrc?: string;
  category?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  onSelectImage, 
  currentImageSrc,
  category = 'product'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>(category);
  const [selectedImage, setSelectedImage] = useState<ImageOption | null>(null);
  const [customAltText, setCustomAltText] = useState('');

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // Reset selections when dialog opens
    if (open) {
      setSelectedImage(null);
      setCustomAltText('');
    }
  };

  const handleSelectImage = (image: ImageOption) => {
    setSelectedImage(image);
    setCustomAltText(image.alt);
  };

  const handleConfirmSelection = () => {
    if (selectedImage) {
      onSelectImage({
        ...selectedImage,
        alt: customAltText
      });
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Image className="mr-2 h-4 w-4" />
          {currentImageSrc ? 'Change Image' : 'Choose Image'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select an Image</DialogTitle>
          <DialogDescription>
            Choose the most appropriate image for your content. Remember that both image quality and relevance impact SEO.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="product" className="flex-1">Product Images</TabsTrigger>
            <TabsTrigger value="location" className="flex-1">Location Images</TabsTrigger>
            <TabsTrigger value="infographic" className="flex-1">Infographics</TabsTrigger>
          </TabsList>
          
          {Object.keys(demoImages).map(category => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {demoImages[category].map(image => (
                  <Card 
                    key={image.id}
                    className={`cursor-pointer hover:border-blue-300 transition-colors ${
                      selectedImage?.id === image.id ? 'border-blue-500 ring-2 ring-blue-300' : ''
                    }`}
                    onClick={() => handleSelectImage(image)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2">
                          <Badge variant={
                            image.quality === 'good' ? 'default' :
                            image.quality === 'fair' ? 'secondary' : 'destructive'
                          }>
                            {image.quality === 'good' ? 'High Quality' : 
                              image.quality === 'fair' ? 'Average Quality' : 'Poor Quality'}
                          </Badge>
                          <Badge variant={
                            image.relevance === 'relevant' ? 'outline' :
                            image.relevance === 'partial' ? 'secondary' : 'destructive'
                          }>
                            {image.relevance === 'relevant' ? 'Relevant' :
                              image.relevance === 'partial' ? 'Partially Relevant' : 'Irrelevant'}
                          </Badge>
                        </div>
                        {selectedImage?.id === image.id && (
                          <Check className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="relative h-40 overflow-hidden bg-gray-100 rounded-md flex items-center justify-center">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/png?text=Image+Not+Available';
                          }}
                        />
                      </div>
                      <p className="text-sm mt-2 text-gray-500">{image.alt}</p>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-2 rounded-b-md flex items-start">
                      <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-xs">{image.seoImpact}</p>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {selectedImage && (
          <div className="space-y-4 mt-4 pt-4 border-t">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customize Alt Text</label>
              <Input
                value={customAltText}
                onChange={(e) => setCustomAltText(e.target.value)}
                placeholder="Describe the image for accessibility and SEO"
              />
              <p className="text-xs text-gray-500">
                Good alt text is descriptive, concise, and includes relevant keywords when appropriate.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmSelection}
            disabled={!selectedImage}
          >
            Select Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageGallery;