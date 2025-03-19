import React, { useState } from 'react';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Post, Comment } from '@shared/schema';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Heart, Share2, ThumbsUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PostCardProps {
  post: Post;
  onLike: (postId: number) => void;
  onComment: (postId: number, comment: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment }) => {
  const [comment, setComment] = useState('');
  const { toast } = useToast();
  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ['/api/posts', post.id, 'comments'],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${post.id}/comments`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      return res.json();
    },
    enabled: !!post.id
  });

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    
    try {
      await onComment(post.id, comment);
      setComment('');
      toast({
        title: "Comment posted!",
        description: "Your comment has been added to the discussion.",
      });
    } catch (error) {
      toast({
        title: "Failed to post comment",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    // Ensure we're working with a string
    const dateValue = typeof dateString === 'string' ? dateString : String(dateString);
    try {
      const date = new Date(dateValue);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return dateValue; // Return the original value if parsing fails
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{getInitials(post.userId.toString())}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">User #{post.userId}</CardTitle>
              <CardDescription className="text-xs">
                {formatDate(post.createdAt)}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline">{post.type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="flex justify-between w-full mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => onLike(post.id)}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes}</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{comments.length}</span>
          </Button>

          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="my-2" />
        
        {/* Comments section */}
        {comments.length > 0 && (
          <div className="w-full mb-3">
            <h4 className="text-sm font-medium mb-2">Comments</h4>
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">{getInitials(comment.userId.toString())}</AvatarFallback>
                </Avatar>
                <div className="bg-muted p-2 rounded-md text-sm flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-xs">User #{comment.userId}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-xs">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Add comment form */}
        <div className="flex gap-2 w-full">
          <Input
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1"
          />
          <Button size="sm" onClick={handleSubmitComment}>Post</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const CreatePostForm = ({ onPost }: { onPost: (title: string, content: string, type: string) => Promise<void> }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('discussion');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both title and content for your post.",
        variant: "destructive"
      });
      return;
    }

    try {
      await onPost(title, content, type);
      setTitle('');
      setContent('');
      toast({
        title: "Post created!",
        description: "Your post has been published successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to create post",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create a Post</CardTitle>
        <CardDescription>Share your thoughts with the community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="post-type" className="text-sm font-medium">Post Type</label>
          <div className="flex flex-wrap gap-2">
            <Button 
              type="button"
              variant={type === 'discussion' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setType('discussion')}
            >
              Discussion
            </Button>
            <Button 
              type="button"
              variant={type === 'question' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setType('question')}
            >
              Question
            </Button>
            <Button 
              type="button"
              variant={type === 'showcase' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setType('showcase')}
            >
              Showcase
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="post-title" className="text-sm font-medium">Title</label>
          <Input
            id="post-title"
            placeholder="Enter a title for your post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="post-content" className="text-sm font-medium">Content</label>
          <Textarea
            id="post-content"
            placeholder="What would you like to share?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={isMobile ? 3 : 5}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">Post</Button>
      </CardFooter>
    </Card>
  );
};

const Posts = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('feed');
  
  // Fetch all posts
  const { data: posts = [], isLoading, error, refetch } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    }
  });

  const handleCreatePost = async (title: string, content: string, type: string) => {
    // Temporary user ID until auth is implemented
    const userId = 1;
    
    await apiRequest('POST', '/api/posts', {
      userId,
      title,
      content,
      type,
      tags: [],
    });
    
    // Invalidate and refetch posts
    queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
  };

  const handleLikePost = async (postId: number) => {
    // This would typically update the like count on the server
    // For now, just show a toast
    toast({
      title: "Post liked!",
      description: "This feature will be fully implemented soon.",
    });
  };

  const handleAddComment = async (postId: number, comment: string) => {
    // Temporary user ID until auth is implemented
    const userId = 1;
    
    await apiRequest('POST', '/api/comments', {
      postId,
      userId,
      content: comment
    });
    
    // Invalidate and refetch comments for this post
    queryClient.invalidateQueries({ queryKey: ['/api/posts', postId, 'comments'] });
  };

  if (error) {
    return <div className="p-4 text-red-500">Failed to load posts. Please try again.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Tabs defaultValue="feed" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="create">Create Post</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed">
          <h1 className="text-2xl font-bold mb-6">Community Feed</h1>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="w-full h-40 animate-pulse bg-muted" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to share with the community!</p>
              <Button onClick={() => setActiveTab('create')}>Create a Post</Button>
            </div>
          ) : (
            <div>
              {posts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={handleLikePost}
                  onComment={handleAddComment}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create">
          <h1 className="text-2xl font-bold mb-6">Create a New Post</h1>
          <CreatePostForm onPost={handleCreatePost} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Posts;