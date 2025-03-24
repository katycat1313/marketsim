import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SeoQuiz from '@/components/SeoQuiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Define interfaces for API responses
interface Badge {
  id: string;
  name: string;
  achieved: boolean;
  description: string;
}

interface UserProgress {
  completedQuizzes: number;
  totalQuizzes: number;
  badges: Badge[];
}

export default function SeoQuizPage() {
  const [activeTab, setActiveTab] = useState("quiz");
  const { toast } = useToast();

  // Query to fetch user progress with proper typing
  const { data: userProgress, isLoading: isLoadingProgress } = useQuery<UserProgress>({
    queryKey: ['/api/quiz/progress'],
    queryFn: getQueryFn<UserProgress>({ on401: "returnNull" }),
    refetchOnWindowFocus: false,
  });

  const startQuiz = () => {
    setActiveTab("quiz");
    toast({
      title: "Quiz started",
      description: "Good luck! Try to apply your SEO knowledge to real-world scenarios.",
    });
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">SEO Knowledge Quiz</h1>
          <p className="text-muted-foreground">
            Test your SEO knowledge with practical, real-world scenarios and challenges.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="overview">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="quiz">
              <Search className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="progress">
              <Award className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Progress</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About the SEO Quiz</CardTitle>
                <CardDescription>
                  Practical assessment to test your search engine optimization knowledge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">What This Quiz Covers:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Content analysis and optimization</li>
                    <li>Keyword research and selection</li>
                    <li>Negative keyword identification</li>
                    <li>SEO performance metrics interpretation</li>
                    <li>Search intent classification</li>
                    <li>Technical SEO troubleshooting</li>
                    <li>Local SEO strategies</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Quiz Format:</h3>
                  <p>
                    This quiz consists of 8 questions covering various aspects of SEO. 
                    You'll analyze website content, select relevant keywords, identify technical issues, 
                    and interpret SEO performance data.
                  </p>
                  <p>
                    Each question includes detailed explanations to help you learn regardless of your answer.
                  </p>
                </div>
                
                <Button size="lg" onClick={startQuiz}>
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Content Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Analyze real website content and identify optimization opportunities based on SEO best practices.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Keyword Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Learn to select the most relevant keywords and understand how to use negative keywords effectively.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Technical SEO</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Identify technical issues that affect search performance and learn how to diagnose common problems.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="quiz">
            <SeoQuiz />
          </TabsContent>
          
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>
                  Track your SEO learning journey and achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoadingProgress ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Loading your progress...</p>
                  </div>
                ) : userProgress ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Quiz Completion</h3>
                        <span className="text-sm text-muted-foreground">
                          {userProgress.completedQuizzes || 0}/{userProgress.totalQuizzes || 3} Completed
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${((userProgress.completedQuizzes || 0) / (userProgress.totalQuizzes || 3)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Your Achievements</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {userProgress.badges && userProgress.badges.length > 0 ? (
                          userProgress.badges.map((badge) => (
                            <Card key={badge.id} className={`border ${badge.achieved ? 'border-primary' : 'border-muted'}`}>
                              <CardContent className="p-4 flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  badge.achieved ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                }`}>
                                  <Award className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-medium">{badge.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {badge.achieved ? 'Achieved' : 'Not yet achieved'}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <Card className="border border-muted col-span-3">
                            <CardContent className="p-4 flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                                <Award className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">No badges yet</p>
                                <p className="text-xs text-muted-foreground">
                                  Complete more quizzes to earn badges
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <Award className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium">No Progress Yet</h3>
                      <p className="text-muted-foreground max-w-md mt-2">
                        Complete the SEO quiz to start tracking your progress. Your results will be saved automatically.
                      </p>
                    </div>
                  </div>
                )}
                
                <Button onClick={startQuiz} className="w-full">
                  {userProgress ? 'Take Quiz Again' : 'Start Quiz Now'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}