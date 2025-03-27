import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Info, AlertCircle, Check, X, Edit, Save, Bookmark } from 'lucide-react';
import WordPressEditor from '@/components/WordPressEditor';
import WebsitePreview from '@/components/WebsitePreview';
import '@/components/WebsitePreview.css';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface SeoPageContent {
  title: string;
  metaDescription: string;
  headings: {
    tag: string; // h1, h2, h3, etc.
    content: string;
  }[];
  body: string;
  images: {
    src: string;
    alt: string;
  }[];
  links: {
    href: string;
    text: string;
    isInternal: boolean;
  }[];
  schemaMarkup?: string; // Optional JSON-LD schema markup
}

interface SeoSimulation {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  industry: string;
  originalContent: SeoPageContent;
  targetKeywords: string[];
  seoIssues: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    location: string;
  }[];
  bestPractices: {
    category: string;
    description: string;
    example: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface SimulationAttempt {
  id: number;
  simulationId: number;
  userId: number;
  modifiedContent: SeoPageContent;
  score: number;
  issuesFixed: {
    issueType: string;
    fixed: boolean;
    feedback: string;
  }[];
  keywordOptimization: {
    keyword: string;
    density: number;
    placement: string[];
    feedback: string;
  }[];
  readabilityScore: number;
  technicalSeoScore: number;
  contentQualityScore: number;
  feedback: string;
  recommendations: string[];
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function SeoSimulationPage() {
  const [, params] = useRoute<{ id: string }>('/seo-simulation/:id');
  const simulationId = params ? parseInt(params.id) : null;
  
  const [content, setContent] = useState<SeoPageContent | null>(null);
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();
  
  // Get simulation data
  const { data: simulation, isLoading: simulationLoading } = useQuery({
    queryKey: ['/api/seo-simulations', simulationId],
    queryFn: () => apiRequest(`/api/seo-simulations/${simulationId}`, { method: 'GET' }),
    enabled: !!simulationId
  });
  
  // Get user's previous attempts
  const { data: attempts, isLoading: attemptsLoading } = useQuery({
    queryKey: ['/api/seo-simulations', simulationId, 'attempts'],
    queryFn: () => apiRequest(`/api/seo-simulations/${simulationId}/attempts`, { method: 'GET' }),
    enabled: !!simulationId
  });
  
  // Submit attempt mutation
  const submitMutation = useMutation({
    mutationFn: (modifiedContent: SeoPageContent) => 
      apiRequest(`/api/seo-simulations/${simulationId}/attempts`, {
        method: 'POST',
        body: JSON.stringify({ modifiedContent })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/seo-simulations', simulationId, 'attempts'] });
      toast({
        title: "Submission successful!",
        description: "Your SEO optimization has been evaluated.",
      });
      setEditMode(false);
    },
    onError: () => {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your optimization.",
        variant: "destructive"
      });
    }
  });
  
  // Initialize content with original simulation content
  useEffect(() => {
    if (simulation && !content) {
      setContent(JSON.parse(JSON.stringify(simulation.originalContent)));
    }
  }, [simulation, content]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!content) return;
    setContent({ ...content, title: e.target.value });
  };
  
  const handleMetaDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!content) return;
    setContent({ ...content, metaDescription: e.target.value });
  };
  
  const handleHeadingChange = (index: number, value: string) => {
    if (!content) return;
    const newHeadings = [...content.headings];
    newHeadings[index] = { ...newHeadings[index], content: value };
    setContent({ ...content, headings: newHeadings });
  };
  
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!content) return;
    setContent({ ...content, body: e.target.value });
  };
  
  const handleImageAltChange = (index: number, value: string) => {
    if (!content) return;
    const newImages = [...content.images];
    newImages[index] = { ...newImages[index], alt: value };
    setContent({ ...content, images: newImages });
  };
  
  const handleLinkTextChange = (index: number, value: string) => {
    if (!content) return;
    const newLinks = [...content.links];
    newLinks[index] = { ...newLinks[index], text: value };
    setContent({ ...content, links: newLinks });
  };
  
  const handleSchemaMarkupChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!content) return;
    setContent({ ...content, schemaMarkup: e.target.value });
  };
  
  const handleSubmit = () => {
    if (!content) return;
    submitMutation.mutate(content);
  };
  
  const latestAttempt = attempts && attempts.length > 0 ? attempts[0] : null;
  
  if (simulationLoading) {
    return <div className="flex justify-center items-center h-[80vh]">Loading simulation...</div>;
  }
  
  if (!simulation) {
    return <div className="flex justify-center items-center h-[80vh]">Simulation not found</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{simulation.title}</h1>
            <p className="text-gray-500">{simulation.description}</p>
            <div className="flex mt-2 gap-2">
              <Badge variant="outline">{simulation.industry}</Badge>
              <Badge 
                variant={
                  simulation.difficulty === 'Beginner' ? 'secondary' : 
                  simulation.difficulty === 'Intermediate' ? 'default' : 
                  'destructive'
                }
              >
                {simulation.difficulty}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button 
                  variant="default" 
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Submit Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setContent(JSON.parse(JSON.stringify(simulation.originalContent)));
                    setEditMode(false);
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                onClick={() => setEditMode(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Optimize Content
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                {latestAttempt && (
                  <TabsTrigger value="results">Results</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="editor" className="space-y-6">
                {content && (
                  <>
                    {simulation.difficulty === 'Beginner' ? (
                      // Beginner mode - Form-based editor
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Page Title</CardTitle>
                            <CardDescription>The title tag is a critical SEO element (50-60 characters ideal)</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Input 
                              value={content.title} 
                              onChange={handleTitleChange}
                              disabled={!editMode}
                              className={editMode ? "border-blue-300" : ""}
                            />
                            <div className="mt-2 text-xs text-gray-500">
                              {content.title.length} characters
                            </div>
                          </CardContent>
                        </Card>
                    
                        <Card>
                          <CardHeader>
                            <CardTitle>Meta Description</CardTitle>
                            <CardDescription>Appears in search results (150-160 characters ideal)</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Textarea 
                              value={content.metaDescription} 
                              onChange={handleMetaDescriptionChange}
                              disabled={!editMode}
                              className={editMode ? "border-blue-300" : ""}
                              rows={3}
                            />
                            <div className="mt-2 text-xs text-gray-500">
                              {content.metaDescription.length} characters
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Headings</CardTitle>
                            <CardDescription>Heading structure is important for SEO and accessibility</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {content.headings.map((heading, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{heading.tag}</Badge>
                                  <Input 
                                    value={heading.content} 
                                    onChange={(e) => handleHeadingChange(index, e.target.value)}
                                    disabled={!editMode}
                                    className={editMode ? "border-blue-300" : ""}
                                  />
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Body Content</CardTitle>
                            <CardDescription>Main content of the page (300+ words recommended)</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Textarea 
                              value={content.body} 
                              onChange={handleBodyChange}
                              disabled={!editMode}
                              className={editMode ? "border-blue-300" : ""}
                              rows={8}
                            />
                            <div className="mt-2 text-xs text-gray-500">
                              {content.body.split(/\s+/).length} words
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Images</CardTitle>
                            <CardDescription>Images should have descriptive alt text</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {content.images.map((image, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-1/4">
                                    <Badge variant="outline">Image src</Badge>
                                    <div className="text-sm mt-1 truncate">{image.src}</div>
                                  </div>
                                  <div className="w-3/4">
                                    <Badge variant="outline">Alt Text</Badge>
                                    <Input 
                                      value={image.alt} 
                                      onChange={(e) => handleImageAltChange(index, e.target.value)}
                                      disabled={!editMode}
                                      className={editMode ? "border-blue-300" : ""}
                                      placeholder="Descriptive alt text for the image"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Links</CardTitle>
                            <CardDescription>Links should have descriptive anchor text</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {content.links.map((link, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-1/4">
                                    <Badge variant={link.isInternal ? "secondary" : "outline"}>
                                      {link.isInternal ? "Internal" : "External"}
                                    </Badge>
                                    <div className="text-sm mt-1 truncate">{link.href}</div>
                                  </div>
                                  <div className="w-3/4">
                                    <Badge variant="outline">Link Text</Badge>
                                    <Input 
                                      value={link.text} 
                                      onChange={(e) => handleLinkTextChange(index, e.target.value)}
                                      disabled={!editMode}
                                      className={editMode ? "border-blue-300" : ""}
                                      placeholder="Descriptive link text"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Schema Markup</CardTitle>
                            <CardDescription>Structured data helps search engines understand your content (JSON-LD format)</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Textarea 
                              value={content.schemaMarkup || ''} 
                              onChange={handleSchemaMarkupChange}
                              disabled={!editMode}
                              className={editMode ? "border-blue-300 font-mono text-sm" : "font-mono text-sm"}
                              rows={8}
                              placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Your headline here",\n  "author": {\n    "@type": "Person",\n    "name": "Author Name"\n  }\n}`}
                            />
                            <div className="mt-2 text-xs text-gray-500 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              <span>Valid JSON-LD required for structured data</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      // Advanced mode - WordPress-like editor
                      <WordPressEditor 
                        content={content}
                        onContentChange={setContent}
                        readOnly={!editMode}
                      />
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="preview" className="space-y-6">
                {content && (
                  simulation.difficulty === 'Beginner' ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Page Preview</CardTitle>
                        <CardDescription>How your page would appear</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-md p-6 space-y-4">
                          <div className="flex flex-col space-y-2">
                            <div className="text-xs text-gray-500 flex items-center">
                              <div className="w-full h-2 bg-green-100 rounded" />
                              <div className="ml-2">example.com</div>
                            </div>
                            <h1 className="text-blue-600 text-xl font-medium hover:underline cursor-pointer">
                              {content.title}
                            </h1>
                            <p className="text-sm text-gray-600">
                              {content.metaDescription}
                            </p>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-4">
                            {content.headings.map((heading, index) => {
                              const HeadingTag = heading.tag as keyof JSX.IntrinsicElements;
                              return (
                                <HeadingTag key={index} className={
                                  heading.tag === 'h1' ? 'text-2xl font-bold' :
                                  heading.tag === 'h2' ? 'text-xl font-bold' :
                                  heading.tag === 'h3' ? 'text-lg font-bold' :
                                  'text-base font-bold'
                                }>
                                  {heading.content}
                                </HeadingTag>
                              );
                            })}
                            
                            <div className="text-gray-700 whitespace-pre-wrap">
                              {content.body.split('\n').map((paragraph, i) => (
                                <p key={i} className="mb-4">{paragraph}</p>
                              ))}
                            </div>
                            
                            <div className="flex flex-wrap gap-4">
                              {content.images.map((image, index) => (
                                <div key={index} className="border p-2 text-center">
                                  <div className="bg-gray-100 h-20 w-32 flex items-center justify-center text-gray-400">
                                    [Image: {image.src.split('/').pop()}]
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">Alt: {image.alt}</div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="space-y-2">
                              <h3 className="font-medium">Links:</h3>
                              <ul className="space-y-1 list-disc list-inside">
                                {content.links.map((link, index) => (
                                  <li key={index}>
                                    <a 
                                      href="#" 
                                      className={link.isInternal ? "text-blue-600" : "text-green-600"}
                                      onClick={(e) => e.preventDefault()}
                                    >
                                      {link.text}
                                    </a>
                                    <span className="text-xs text-gray-500 ml-2">
                                      ({link.href})
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle>Realistic Website Preview</CardTitle>
                          <CardDescription>Professional view of your optimized page</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 overflow-hidden">
                          {/* Fix WebsitePreview rendering */}
                          <div className="website-preview-container">
                            <WebsitePreview 
                              content={content} 
                              industry={simulation.industry} 
                              difficulty={simulation.difficulty} 
                            />
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Search Engine Results Preview</CardTitle>
                          <CardDescription>How your page might appear in search results</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-white p-4 rounded-md border">
                            <div className="text-blue-600 text-xl hover:underline cursor-pointer">{content.title}</div>
                            <div className="text-green-700 text-sm">example.com/your-page-url</div>
                            <div className="text-gray-600">
                              {content.metaDescription.length > 160 
                                ? content.metaDescription.substring(0, 157) + '...' 
                                : content.metaDescription}
                            </div>
                            {content.schemaMarkup && (
                              <div className="mt-2 p-2 border border-gray-200 rounded bg-gray-50">
                                <p className="text-xs text-gray-500">Rich result preview (based on schema markup)</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-yellow-500">★★★★★</span>
                                  <span className="text-sm font-medium">5.0</span>
                                  <span className="text-sm text-gray-500">(24 reviews)</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )
                )}
              </TabsContent>
              
              {latestAttempt && (
                <TabsContent value="results" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>SEO Performance Score: {latestAttempt.score}/100</CardTitle>
                      <CardDescription>Submitted on {new Date(latestAttempt.completedAt).toLocaleString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Readability</span>
                            <span className="text-sm">{latestAttempt.readabilityScore}/100</span>
                          </div>
                          <Progress value={latestAttempt.readabilityScore} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Technical SEO</span>
                            <span className="text-sm">{latestAttempt.technicalSeoScore}/100</span>
                          </div>
                          <Progress value={latestAttempt.technicalSeoScore} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Content Quality</span>
                            <span className="text-sm">{latestAttempt.contentQualityScore}/100</span>
                          </div>
                          <Progress value={latestAttempt.contentQualityScore} />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">AI Feedback</h3>
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertTitle>Overall Assessment</AlertTitle>
                          <AlertDescription>
                            {latestAttempt.feedback}
                          </AlertDescription>
                        </Alert>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Keyword Optimization</h3>
                        <div className="space-y-3">
                          {latestAttempt.keywordOptimization.map((keyword: {
                              keyword: string;
                              density: number;
                              placement: string[];
                              feedback: string;
                            }, index: number) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">"{keyword.keyword}"</h4>
                                    <p className="text-sm text-gray-500">
                                      Density: {keyword.density.toFixed(2)}% | 
                                      Placement: {keyword.placement.join(', ') || 'None'}
                                    </p>
                                  </div>
                                  <Badge variant={
                                    keyword.density >= 0.5 && keyword.density <= 2.5 ? "secondary" : 
                                    keyword.density > 0 ? "outline" : "destructive"
                                  }>
                                    {keyword.density >= 0.5 && keyword.density <= 2.5 ? "Optimal" : 
                                     keyword.density > 0 ? "Suboptimal" : "Missing"}
                                  </Badge>
                                </div>
                                <p className="mt-2 text-sm">{keyword.feedback}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">SEO Issues</h3>
                        <div className="space-y-2">
                          {latestAttempt.issuesFixed.map((issue: {
                            issueType: string;
                            fixed: boolean;
                            feedback: string;
                          }, index: number) => (
                            <div key={index} className="flex items-start space-x-2 p-2 border rounded-md">
                              {issue.fixed ? (
                                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                  <Check className="h-4 w-4 text-green-600" />
                                </div>
                              ) : (
                                <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                                  <X className="h-4 w-4 text-red-600" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{issue.issueType}</div>
                                <div className="text-sm text-gray-600">{issue.feedback}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Recommendations</h3>
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Areas for Improvement</AlertTitle>
                          <AlertDescription>
                            <ul className="list-disc list-inside space-y-1 mt-2">
                              {latestAttempt.recommendations.map((rec: string, index: number) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Target Keywords</CardTitle>
                <CardDescription>Optimize your content for these keywords</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {simulation.targetKeywords.map((keyword: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>SEO Issues to Fix</CardTitle>
                <CardDescription>Problems identified in the original content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {simulation.seoIssues.map((issue: {
                  type: string;
                  description: string;
                  severity: 'low' | 'medium' | 'high';
                  location: string;
                }, index: number) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        issue.severity === 'high' ? 'destructive' :
                        issue.severity === 'medium' ? 'default' :
                        'outline'
                      }>
                        {issue.severity}
                      </Badge>
                      <span className="font-medium">{issue.type}</span>
                    </div>
                    <p className="text-sm text-gray-600">{issue.description}</p>
                    <p className="text-xs text-gray-500">Location: {issue.location}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
                <CardDescription>Recommendations for good SEO</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue={simulation.bestPractices[0]?.category || ""}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    {simulation.bestPractices
                      .reduce((categories, practice) => {
                        if (!categories.includes(practice.category)) {
                          categories.push(practice.category);
                        }
                        return categories;
                      }, [] as string[])
                      .slice(0, 3)
                      .map((category) => (
                        <TabsTrigger key={category} value={category}>
                          {category}
                        </TabsTrigger>
                      ))
                    }
                  </TabsList>
                  
                  {simulation.bestPractices
                    .reduce((categories, practice) => {
                      if (!categories.includes(practice.category)) {
                        categories.push(practice.category);
                      }
                      return categories;
                    }, [] as string[])
                    .map((category) => (
                      <TabsContent key={category} value={category} className="space-y-4">
                        {simulation.bestPractices
                          .filter(practice => practice.category === category)
                          .map((practice, index) => (
                            <div key={index} className="space-y-2">
                              <p className="text-sm">{practice.description}</p>
                              <div className="bg-gray-50 p-2 text-sm text-gray-600 rounded border">
                                <div className="text-xs font-medium mb-1">Example:</div>
                                {practice.example}
                              </div>
                            </div>
                          ))
                        }
                      </TabsContent>
                    ))
                  }
                </Tabs>
              </CardContent>
            </Card>
            
            {attempts && attempts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Previous Attempts</CardTitle>
                  <CardDescription>Your submission history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {attempts.map((attempt: {
                      id: number;
                      simulationId: number;
                      score: number;
                      completedAt: string;
                    }, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded hover:bg-gray-50">
                      <div>
                        <div className="font-medium">Attempt #{attempts.length - index}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(attempt.completedAt).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant={
                        attempt.score >= 80 ? 'secondary' :
                        attempt.score >= 60 ? 'default' :
                        'destructive'
                      }>
                        {attempt.score}/100
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}