import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  UserCircle2, 
  Users, 
  Target, 
  DollarSign, 
  Activity, 
  MapPin, 
  Calendar, 
  ShoppingBag,
  BookOpen,
  Share2,
  MessageSquare,
  Heart,
  X,
  Check,
  Download,
  Bookmark
} from 'lucide-react';

// Form schema
const personaSchema = z.object({
  name: z.string().min(2, { message: "Persona name must be at least 2 characters." }),
  age: z.string().min(1, { message: "Age range is required." }),
  gender: z.string().min(1, { message: "Gender is required." }),
  occupation: z.string().min(2, { message: "Occupation must be at least 2 characters." }),
  income: z.string().min(1, { message: "Income range is required." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  education: z.string().min(1, { message: "Education level is required." }),
  familyStatus: z.string().min(1, { message: "Family status is required." }),
  goals: z.string().min(10, { message: "Goals must be at least 10 characters." }),
  challenges: z.string().min(10, { message: "Challenges must be at least 10 characters." }),
  values: z.string().min(10, { message: "Values must be at least 10 characters." }),
  interests: z.string().min(10, { message: "Interests must be at least 10 characters." }),
  brands: z.string().min(5, { message: "Preferred brands must be at least 5 characters." }),
  mediaChannels: z.string().min(5, { message: "Media channels must be at least 5 characters." }),
  purchaseInfluencers: z.string().min(10, { message: "Purchase influencers must be at least 10 characters." }),
  buyingProcess: z.string().min(10, { message: "Buying process must be at least 10 characters." }),
  painPoints: z.string().min(10, { message: "Pain points must be at least 10 characters." }),
  objections: z.string().min(10, { message: "Objections must be at least 10 characters." }),
});

type PersonaFormValues = z.infer<typeof personaSchema>;

// Template types
interface TemplateOption {
  id: string;
  name: string;
  industry: string;
  description: string;
}

export default function PersonaBuilderTemplate() {
  const [activeTab, setActiveTab] = useState('fill-in-blank');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioVisibility, setPortfolioVisibility] = useState<'private' | 'public'>('private');
  const { toast } = useToast();

  // Default values based on template selection
  const getDefaultValues = (): PersonaFormValues => {
    if (selectedTemplate) {
      switch (selectedTemplate.id) {
        case 'e-commerce':
          return {
            name: 'Shopping Sarah',
            age: '25-34',
            gender: 'Female',
            occupation: 'Marketing Manager',
            income: '$50,000 - $75,000',
            location: 'Urban area',
            education: 'Bachelor\'s degree',
            familyStatus: 'Single',
            goals: 'Find quality products at good prices, save time shopping online, discover new brands',
            challenges: 'Overwhelmed by too many choices, concerned about product quality when buying online',
            values: 'Quality, convenience, good customer service, sustainability',
            interests: 'Fashion, home decor, fitness, travel',
            brands: 'Nike, Sephora, Amazon, Target',
            mediaChannels: 'Instagram, TikTok, Email newsletters, YouTube',
            purchaseInfluencers: 'Online reviews, social media influencers, friends\' recommendations',
            buyingProcess: 'Research online, compare options, check reviews, purchase through mobile app',
            painPoints: 'Shipping costs, unclear return policies, inconsistent sizing',
            objections: 'Price sensitivity, concerns about data privacy, preference for seeing products in person',
          };
        case 'b2b-saas':
          return {
            name: 'Tech Thomas',
            age: '35-44',
            gender: 'Male',
            occupation: 'IT Director',
            income: '$100,000 - $150,000',
            location: 'Suburban area',
            education: 'Master\'s degree',
            familyStatus: 'Married with children',
            goals: 'Improve operational efficiency, stay within budget, implement scalable solutions',
            challenges: 'Limited resources, integration with existing systems, security concerns',
            values: 'Reliability, data security, ROI, innovation',
            interests: 'Technology trends, cybersecurity, process optimization, professional development',
            brands: 'Microsoft, Salesforce, Slack, IBM',
            mediaChannels: 'LinkedIn, Industry newsletters, Webinars, Podcasts',
            purchaseInfluencers: 'Industry reports, case studies, peer recommendations',
            buyingProcess: 'Research solutions, consult stakeholders, request demos, evaluate ROI',
            painPoints: 'Long implementation times, lack of technical support, complex pricing models',
            objections: 'Concerns about user adoption, implementation disruptions, long-term viability',
          };
        default:
          break;
      }
    }
    
    return {
      name: '',
      age: '',
      gender: '',
      occupation: '',
      income: '',
      location: '',
      education: '',
      familyStatus: '',
      goals: '',
      challenges: '',
      values: '',
      interests: '',
      brands: '',
      mediaChannels: '',
      purchaseInfluencers: '',
      buyingProcess: '',
      painPoints: '',
      objections: '',
    };
  };

  // Form setup
  const form = useForm<PersonaFormValues>({
    resolver: zodResolver(personaSchema),
    defaultValues: getDefaultValues(),
  });

  // Reset form when template changes
  const handleTemplateSelect = (template: TemplateOption) => {
    setSelectedTemplate(template);
    // Reset form with new defaults
    form.reset(getDefaultValues());
  };

  // Handle form submission
  const savePersona = useMutation({
    mutationFn: (data: PersonaFormValues) => 
      apiRequest('/api/personas', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/personas'] });
      toast({
        title: "Persona saved!",
        description: "Your customer persona has been saved successfully.",
      });
      setShowSaveDialog(false);
    },
    onError: () => {
      toast({
        title: "Failed to save",
        description: "There was an error saving your persona. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSaveToPortfolio = () => {
    // Logic to save to portfolio here
    toast({
      title: "Added to Portfolio",
      description: "Your customer persona has been added to your portfolio.",
    });
    setShowSaveDialog(false);
  };

  // Template options
  const templateOptions: TemplateOption[] = [
    {
      id: 'e-commerce',
      name: 'E-commerce Customer',
      industry: 'Retail',
      description: 'Ideal for online stores and retail businesses targeting digital shoppers.',
    },
    {
      id: 'b2b-saas',
      name: 'B2B Decision Maker',
      industry: 'Technology',
      description: 'Perfect for SaaS companies selling to business clients.',
    },
    {
      id: 'service-local',
      name: 'Local Service Client',
      industry: 'Service',
      description: 'For local service businesses like restaurants, salons, or repair services.',
    },
    {
      id: 'content-subscriber',
      name: 'Content Subscriber',
      industry: 'Media',
      description: 'For content creators, publishers, or subscription services.',
    },
    {
      id: 'healthcare-patient',
      name: 'Healthcare Patient',
      industry: 'Healthcare',
      description: 'For medical practices, wellness businesses, or health-related services.',
    },
  ];

  const onSubmit = (data: PersonaFormValues) => {
    setShowPreview(true);
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#ffd700]">Customer Persona Builder</h1>
          <p className="text-[#f5f5f5]/70 mt-1">Create detailed customer personas to guide your marketing strategies</p>
        </div>
        {showPreview && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-[#ffd700]/30 text-[#f5f5f5] hover:bg-[#ffd700]/10"
              onClick={() => setShowPreview(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Edit Persona
            </Button>
            <Button
              className="bg-[#ffd700] text-black hover:bg-[#e6c200]"
              onClick={() => setShowSaveDialog(true)}
            >
              <Bookmark className="mr-2 h-4 w-4" />
              Save to Portfolio
            </Button>
          </div>
        )}
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="mb-4 bg-[#222] border border-[#444]">
          <TabsTrigger value="fill-in-blank" className="data-[state=active]:bg-[#ffd700] data-[state=active]:text-black">
            Fill-in-Blank Template
          </TabsTrigger>
          <TabsTrigger value="ai-generation" className="data-[state=active]:bg-[#ffd700] data-[state=active]:text-black">
            AI Persona Generation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fill-in-blank" className="space-y-8">
          {!showPreview ? (
            <div className="grid grid-cols-1 gap-8">
              <Card className="bg-[#111]/60 border border-[#ffd700]/20">
                <CardHeader>
                  <CardTitle className="text-[#ffd700]">Select a Template</CardTitle>
                  <CardDescription className="text-[#f5f5f5]/70">
                    Choose a template to get started with pre-filled values for your industry
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templateOptions.map((template) => (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer transition-all border ${
                          selectedTemplate?.id === template.id 
                            ? 'border-[#ffd700] bg-[#ffd700]/10' 
                            : 'border-[#444] bg-[#222] hover:border-[#ffd700]/50'
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg text-[#ffd700]">{template.name}</CardTitle>
                          <Badge variant="outline" className="mt-1 w-fit">
                            {template.industry}
                          </Badge>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm text-[#f5f5f5]/70">{template.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <Card className="bg-[#111]/60 border border-[#ffd700]/20">
                    <CardHeader>
                      <CardTitle className="text-[#ffd700]">Demographics</CardTitle>
                      <CardDescription className="text-[#f5f5f5]/70">
                        Basic information about your ideal customer
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 grid-cols-1 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Persona Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="E.g. Marketing Mary, Tech Thomas" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription className="text-[#f5f5f5]/50">
                              Create a memorable name that represents this customer type
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Age Range</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="E.g. 25-34, 35-44" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription className="text-[#f5f5f5]/50">
                              Age range of your typical customer
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Gender</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="E.g. Female, Male, Non-binary" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Occupation</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="E.g. Marketing Manager, IT Director" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="income"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Income Range</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="E.g. $50,000-$75,000" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Location</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="E.g. Urban areas, Suburban, Northeast US" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="education"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Education</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="E.g. Bachelor's degree" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="familyStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Family Status</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="E.g. Single, Married with children" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111]/60 border border-[#ffd700]/20">
                    <CardHeader>
                      <CardTitle className="text-[#ffd700]">Psychographics</CardTitle>
                      <CardDescription className="text-[#f5f5f5]/70">
                        Understand their motivations, values and challenges
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 grid-cols-1">
                      <FormField
                        control={form.control}
                        name="goals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Goals & Objectives</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What are they trying to achieve? What are their personal or professional goals?" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="challenges"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Challenges</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What obstacles are they facing in achieving their goals?" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="values"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Values</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What principles or beliefs guide their decisions? What do they care about most?" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="interests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Interests & Activities</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What do they enjoy doing in their free time? What topics interest them?" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111]/60 border border-[#ffd700]/20">
                    <CardHeader>
                      <CardTitle className="text-[#ffd700]">Buying Behavior</CardTitle>
                      <CardDescription className="text-[#f5f5f5]/70">
                        How they make purchasing decisions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 grid-cols-1">
                      <FormField
                        control={form.control}
                        name="brands"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Preferred Brands</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What brands do they currently use or prefer?" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="mediaChannels"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Media Channels</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What platforms, websites, or media do they use regularly?" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="purchaseInfluencers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Purchase Influencers</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Who or what influences their purchasing decisions? (Reviews, recommendations, etc.)" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="buyingProcess"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Buying Process</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="How do they research and make purchase decisions? What steps do they take?" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-[#111]/60 border border-[#ffd700]/20">
                    <CardHeader>
                      <CardTitle className="text-[#ffd700]">Pain Points & Objections</CardTitle>
                      <CardDescription className="text-[#f5f5f5]/70">
                        Understand their concerns and how to address them
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 grid-cols-1">
                      <FormField
                        control={form.control}
                        name="painPoints"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Pain Points</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What frustrations or problems do they experience that your product/service can solve?" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="objections"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[#ffd700]">Common Objections</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What hesitations might they have about your product/service?" 
                                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-[#ffd700] text-black hover:bg-[#e6c200]"
                      disabled={form.formState.isSubmitting}
                    >
                      Preview Persona
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          ) : (
            // Preview Mode
            <div className="bg-[#111]/60 border border-[#ffd700]/20 rounded-lg p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex flex-col items-center text-center">
                  <div className="w-40 h-40 rounded-full bg-[#222] flex items-center justify-center mb-4 border-4 border-[#ffd700]/30">
                    <UserCircle2 className="w-20 h-20 text-[#ffd700]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#ffd700] mb-2">{form.getValues('name')}</h2>
                  <div className="space-y-3 w-full">
                    <div className="flex items-center justify-center gap-2 text-[#f5f5f5]/70">
                      <Users className="w-4 h-4" />
                      <span>{form.getValues('age')} • {form.getValues('gender')}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[#f5f5f5]/70">
                      <Target className="w-4 h-4" />
                      <span>{form.getValues('occupation')}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[#f5f5f5]/70">
                      <DollarSign className="w-4 h-4" />
                      <span>{form.getValues('income')}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[#f5f5f5]/70">
                      <MapPin className="w-4 h-4" />
                      <span>{form.getValues('location')}</span>
                    </div>
                    <Separator className="my-3 bg-[#ffd700]/20" />
                    <div className="flex items-center justify-center gap-2 text-[#f5f5f5]/70">
                      <BookOpen className="w-4 h-4" />
                      <span>{form.getValues('education')}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[#f5f5f5]/70">
                      <Users className="w-4 h-4" />
                      <span>{form.getValues('familyStatus')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3 space-y-6">
                  <Accordion type="single" collapsible className="w-full" defaultValue="goals">
                    <AccordionItem value="goals" className="border-[#444]">
                      <AccordionTrigger className="text-[#ffd700]">
                        Goals & Challenges
                      </AccordionTrigger>
                      <AccordionContent className="text-[#f5f5f5]/90 space-y-4">
                        <div>
                          <h4 className="font-medium text-[#ffd700]/80">Goals</h4>
                          <p>{form.getValues('goals')}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-[#ffd700]/80">Challenges</h4>
                          <p>{form.getValues('challenges')}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="values" className="border-[#444]">
                      <AccordionTrigger className="text-[#ffd700]">
                        Values & Interests
                      </AccordionTrigger>
                      <AccordionContent className="text-[#f5f5f5]/90 space-y-4">
                        <div>
                          <h4 className="font-medium text-[#ffd700]/80">Values</h4>
                          <p>{form.getValues('values')}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-[#ffd700]/80">Interests</h4>
                          <p>{form.getValues('interests')}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="brands" className="border-[#444]">
                      <AccordionTrigger className="text-[#ffd700]">
                        Brand Preferences
                      </AccordionTrigger>
                      <AccordionContent className="text-[#f5f5f5]/90">
                        <p>{form.getValues('brands')}</p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="media" className="border-[#444]">
                      <AccordionTrigger className="text-[#ffd700]">
                        Media & Communication
                      </AccordionTrigger>
                      <AccordionContent className="text-[#f5f5f5]/90">
                        <p>{form.getValues('mediaChannels')}</p>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="buying" className="border-[#444]">
                      <AccordionTrigger className="text-[#ffd700]">
                        Buying Behavior
                      </AccordionTrigger>
                      <AccordionContent className="text-[#f5f5f5]/90 space-y-4">
                        <div>
                          <h4 className="font-medium text-[#ffd700]/80">Purchase Influencers</h4>
                          <p>{form.getValues('purchaseInfluencers')}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-[#ffd700]/80">Buying Process</h4>
                          <p>{form.getValues('buyingProcess')}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="pain" className="border-[#444]">
                      <AccordionTrigger className="text-[#ffd700]">
                        Pain Points & Objections
                      </AccordionTrigger>
                      <AccordionContent className="text-[#f5f5f5]/90 space-y-4">
                        <div>
                          <h4 className="font-medium text-[#ffd700]/80">Pain Points</h4>
                          <p>{form.getValues('painPoints')}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-[#ffd700]/80">Objections</h4>
                          <p>{form.getValues('objections')}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <Card className="bg-[#222] border border-[#444]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-[#ffd700] text-lg">Marketing Opportunities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-[#f5f5f5]">
                            Target messaging around <span className="text-[#ffd700]">solving {form.getValues('name')}'s challenges</span> with your products or services.
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-[#f5f5f5]">
                            Focus on <span className="text-[#ffd700]">values alignment</span> in your messaging to build trust and connection.
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-[#f5f5f5]">
                            Prioritize <span className="text-[#ffd700]">{form.getValues('mediaChannels').split(',')[0]}</span> for most effective reach.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="ai-generation" className="space-y-6">
          <Card className="bg-[#111]/60 border border-[#ffd700]/20">
            <CardHeader>
              <CardTitle className="text-[#ffd700]">AI Persona Generator</CardTitle>
              <CardDescription className="text-[#f5f5f5]/70">
                Let AI create a detailed customer persona based on your business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#ffd700]">Business Type</Label>
                    <Input 
                      placeholder="E.g. E-commerce fashion store, B2B software company" 
                      className="bg-[#222] border-[#444] text-[#f5f5f5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#ffd700]">Target Market</Label>
                    <Input 
                      placeholder="E.g. Professionals aged 25-45, small business owners" 
                      className="bg-[#222] border-[#444] text-[#f5f5f5]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#ffd700]">Product/Service Description</Label>
                  <Textarea 
                    placeholder="Describe what you offer and its main benefits..." 
                    className="bg-[#222] border-[#444] text-[#f5f5f5]"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#ffd700]">Current Customer Insights (Optional)</Label>
                  <Textarea 
                    placeholder="Share any insights you already have about your customers..." 
                    className="bg-[#222] border-[#444] text-[#f5f5f5]"
                    rows={3}
                  />
                </div>
                <div className="pt-4">
                  <Button
                    className="w-full bg-[#ffd700] text-black hover:bg-[#e6c200]"
                    disabled
                  >
                    Generate AI Persona (Premium Feature)
                  </Button>
                  <p className="text-center text-sm text-[#f5f5f5]/50 mt-2">
                    Upgrade to a premium plan to access AI persona generation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Save to Portfolio Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-[500px] bg-[#111] border border-[#ffd700]/30 text-[#f5f5f5]">
          <DialogHeader>
            <DialogTitle className="text-[#ffd700]">Add to Portfolio</DialogTitle>
            <DialogDescription className="text-[#f5f5f5]/70">
              Save this customer persona to your portfolio to showcase your marketing strategy skills.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#ffd700]">
                Portfolio Title
              </Label>
              <Input 
                value={portfolioTitle}
                onChange={(e) => setPortfolioTitle(e.target.value)}
                className="bg-[#222] border-[#444] text-[#f5f5f5]"
                placeholder="E.g. E-commerce Customer Persona for Fashion Brand"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#ffd700]">
                Visibility
              </Label>
              <Select 
                value={portfolioVisibility}
                onValueChange={(value) => setPortfolioVisibility(value as 'private' | 'public')}
              >
                <SelectTrigger className="bg-[#222] border-[#444] text-[#f5f5f5]">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent className="bg-[#222] border-[#444] text-[#f5f5f5]">
                  <SelectItem value="private">Private (Only you can see)</SelectItem>
                  <SelectItem value="public">Public (Can be shared with employers)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="text-sm text-[#f5f5f5]/60 mb-2">
              Adding this to your portfolio will help you showcase your market research and customer understanding skills.
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSaveDialog(false)}
                className="border-[#ffd700]/30 text-[#f5f5f5] hover:bg-[#ffd700]/10"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveToPortfolio}
                className="bg-[#ffd700] text-black hover:bg-[#e6c200]"
              >
                Save to Portfolio
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}