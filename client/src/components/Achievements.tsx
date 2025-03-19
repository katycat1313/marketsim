import React, { useState } from 'react';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Achievement } from '@shared/schema';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy,
  Medal,
  Award,
  Star,
  TrendingUp,
  Lightbulb,
  Target,
  Plus
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  // Map achievement types to icons
  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'skill':
        return <Trophy className="h-5 w-5" />;
      case 'campaign':
        return <Medal className="h-5 w-5" />;
      case 'social':
        return <Award className="h-5 w-5" />;
      case 'special':
        return <Star className="h-5 w-5" />;
      default:
        return <Trophy className="h-5 w-5" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${achievement.type === 'skill' ? 'bg-blue-500' : 
        achievement.type === 'campaign' ? 'bg-green-500' : 
        achievement.type === 'social' ? 'bg-purple-500' : 'bg-amber-500'}`} 
      />
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className={`p-1.5 rounded-full ${
              achievement.type === 'skill' ? 'bg-blue-100 text-blue-700' : 
              achievement.type === 'campaign' ? 'bg-green-100 text-green-700' : 
              achievement.type === 'social' ? 'bg-purple-100 text-purple-700' : 
              'bg-amber-100 text-amber-700'
            }`}>
              {getAchievementIcon(achievement.type)}
            </span>
            {achievement.name}
          </CardTitle>
          <Badge variant="outline">{achievement.type}</Badge>
        </div>
        <CardDescription>
          {achievement.experiencePoints} XP
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{achievement.description}</p>
      </CardContent>
      <CardFooter className="bg-muted/50 pt-2">
        <div className="w-full">
          <div className="text-xs font-medium mb-1.5">Requirements:</div>
          <div className="text-xs text-muted-foreground">
            {achievement.requirements && typeof achievement.requirements === 'object' && 
             Object.keys(achievement.requirements as Record<string, unknown>).length > 0 ? (
              <ul className="list-disc pl-4 space-y-1">
                {Object.entries(achievement.requirements as Record<string, unknown>).map(([key, value], i) => (
                  <li key={i}>
                    {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No specific requirements defined.</p>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const CreateAchievementForm = ({ onSubmit }: { onSubmit: (data: any) => Promise<void> }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('skill');
  const [experiencePoints, setExperiencePoints] = useState(10);
  const [icon, setIcon] = useState('trophy');
  const { toast } = useToast();
  
  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both name and description for the achievement.",
        variant: "destructive"
      });
      return;
    }

    try {
      await onSubmit({
        name,
        description,
        type,
        requirements: {},
        icon: `icon_${icon}`,
        experiencePoints,
      });
      
      setName('');
      setDescription('');
      setType('skill');
      setExperiencePoints(10);
      
      toast({
        title: "Achievement created!",
        description: "The achievement has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to create achievement",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Achievement</CardTitle>
        <CardDescription>
          Define a new achievement for users to unlock
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="achievement-name" className="text-sm font-medium">Name</label>
          <Input
            id="achievement-name"
            placeholder="Enter achievement name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="achievement-desc" className="text-sm font-medium">Description</label>
          <Textarea
            id="achievement-desc"
            placeholder="Explain how to earn this achievement"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Achievement Type</label>
          <div className="flex flex-wrap gap-2">
            <Button 
              type="button" 
              variant={type === 'skill' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setType('skill')}
              className="flex items-center gap-1"
            >
              <Trophy className="h-4 w-4" />
              Skill
            </Button>
            <Button 
              type="button" 
              variant={type === 'campaign' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setType('campaign')}
              className="flex items-center gap-1"
            >
              <Target className="h-4 w-4" />
              Campaign
            </Button>
            <Button 
              type="button" 
              variant={type === 'social' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setType('social')}
              className="flex items-center gap-1"
            >
              <Award className="h-4 w-4" />
              Social
            </Button>
            <Button 
              type="button" 
              variant={type === 'special' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setType('special')}
              className="flex items-center gap-1"
            >
              <Star className="h-4 w-4" />
              Special
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="experience-points" className="text-sm font-medium">Experience Points</label>
          <Input
            id="experience-points"
            type="number"
            min="5"
            max="100"
            value={experiencePoints}
            onChange={(e) => setExperiencePoints(parseInt(e.target.value) || 10)}
          />
          <p className="text-xs text-muted-foreground">Value between 5-100 points</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">Create Achievement</Button>
      </CardFooter>
    </Card>
  );
};

const AchievementsGallery = ({ achievements }: { achievements: Achievement[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement) => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </div>
  );
};

const AdminAchievementsSection = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  // Fetch all achievements
  const { data: achievements = [], isLoading, refetch } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
    queryFn: async () => {
      const res = await fetch('/api/achievements');
      if (!res.ok) throw new Error('Failed to fetch achievements');
      return res.json();
    }
  });

  const handleCreateAchievement = async (data: any) => {
    await apiRequest('POST', '/api/achievements', data);
    
    // Close dialog and refresh achievements
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Achievements Manager</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              New Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Achievement</DialogTitle>
              <DialogDescription>
                Define a new achievement for community members
              </DialogDescription>
            </DialogHeader>
            <CreateAchievementForm onSubmit={handleCreateAchievement} />
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="w-full h-40 animate-pulse bg-muted" />
          ))}
        </div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-xl mb-2">No achievements yet</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Create your first achievement to incentivize user engagement and recognize accomplishments.
          </p>
          <Button onClick={() => setOpen(true)}>Create Achievement</Button>
        </div>
      ) : (
        <AchievementsGallery achievements={achievements} />
      )}
    </div>
  );
};

const UserAchievementsDisplay = () => {
  // This would be populated from user profile data in a real implementation
  const mockUserAchievements = [
    { id: 'unlocked-1', achievementId: 1, unlockedAt: new Date().toISOString(), progress: 100 },
    { id: 'inprogress-1', achievementId: 2, progress: 60 },
    { id: 'inprogress-2', achievementId: 3, progress: 25 },
  ];
  
  // Fetch all available achievements
  const { data: achievements = [], isLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
    queryFn: async () => {
      const res = await fetch('/api/achievements');
      if (!res.ok) throw new Error('Failed to fetch achievements');
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="w-full h-24 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Achievements</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center gap-1">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span>Unlocked</span>
          </h3>
          {mockUserAchievements
            .filter(ua => ua.progress === 100)
            .map(userAchievement => {
              const achievement = achievements.find(a => a.id === userAchievement.achievementId);
              if (!achievement) return null;
              
              return (
                <Card key={userAchievement.id} className="mb-3">
                  <CardHeader className="py-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        {achievement.name}
                      </CardTitle>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Unlocked
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {achievement.experiencePoints} XP earned
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center gap-1">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span>In Progress</span>
          </h3>
          {mockUserAchievements
            .filter(ua => ua.progress < 100)
            .map(userAchievement => {
              const achievement = achievements.find(a => a.id === userAchievement.achievementId);
              if (!achievement) return null;
              
              return (
                <Card key={userAchievement.id} className="mb-3">
                  <CardHeader className="py-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        {achievement.name}
                      </CardTitle>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {userAchievement.progress}% Complete
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {achievement.experiencePoints} XP available
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
};

const Achievements = () => {
  const [tab, setTab] = useState('gallery');
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="gallery" onValueChange={setTab} value={tab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="gallery">Achievement Gallery</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-2xl font-bold mb-6">Achievement Gallery</h1>
              <UserAchievementsDisplay />
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <span>What are Achievements?</span>
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Achievements recognize your growth and accomplishments as a marketing professional. 
                Unlock them by completing tasks, improving campaigns, and engaging with the community.
              </p>
              <h3 className="text-base font-medium mb-2">Types of Achievements:</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <Trophy className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span><strong>Skill:</strong> Master specific marketing techniques and skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-green-500 mt-0.5" />
                  <span><strong>Campaign:</strong> Create successful marketing campaigns</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="h-4 w-4 text-purple-500 mt-0.5" />
                  <span><strong>Social:</strong> Engage with the marketing community</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-amber-500 mt-0.5" />
                  <span><strong>Special:</strong> Rare achievements for exceptional accomplishments</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="management">
          <AdminAchievementsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Achievements;