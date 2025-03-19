import React, { useState } from 'react';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Connection, UserProfile } from '@shared/schema';
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  UserPlus, 
  Users, 
  Clock, 
  Check, 
  X, 
  Search, 
  MessageSquare, 
  Bell,
  Calendar,
  Star
} from "lucide-react";

interface ConnectionItemProps {
  connection: {
    id: number;
    userId: number;
    connectedUserId: number;
    status: string;
    createdAt: string;
    // Optional user data if available
    user?: UserProfile;
  };
  currentUserId: number;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onMessage: (userId: number) => void;
}

const ConnectionItem: React.FC<ConnectionItemProps> = ({ 
  connection, 
  currentUserId, 
  onAccept, 
  onReject, 
  onMessage 
}) => {
  // Determine if the current user is the sender or receiver
  const isRequester = connection.userId === currentUserId;
  const otherUserId = isRequester ? connection.connectedUserId : connection.userId;
  
  // Helper for user initials
  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  // Generate a friendly date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Badge for connection status
  const getStatusBadge = () => {
    switch(connection.status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Connected</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{connection.status}</Badge>;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{getInitials(`User ${otherUserId}`)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">
                {connection.user?.displayName || `User #${otherUserId}`}
              </CardTitle>
              <CardDescription className="text-xs">
                {connection.user?.level || 'Marketing Professional'}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">
          {isRequester && connection.status === 'pending' 
            ? 'You sent a connection request' 
            : !isRequester && connection.status === 'pending'
            ? 'Sent you a connection request'
            : connection.status === 'accepted'
            ? 'You can collaborate and share marketing insights'
            : 'Connection request was declined'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDate(connection.createdAt)}
        </p>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {!isRequester && connection.status === 'pending' && (
          <>
            <Button 
              variant="default" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => onAccept(connection.id)}
            >
              <Check className="h-4 w-4" />
              Accept
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => onReject(connection.id)}
            >
              <X className="h-4 w-4" />
              Decline
            </Button>
          </>
        )}
        
        {connection.status === 'accepted' && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => onMessage(otherUserId)}
            >
              <MessageSquare className="h-4 w-4" />
              Message
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              Endorse
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

const ConnectionsList = ({ 
  connections, 
  currentUserId, 
  isLoading 
}: { 
  connections: any[];
  currentUserId: number; 
  isLoading: boolean;
}) => {
  const { toast } = useToast();

  const handleAcceptConnection = async (id: number) => {
    try {
      await apiRequest('PATCH', `/api/connections/${id}`, { status: 'accepted' });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'connections'] });
      toast({
        title: "Connection accepted!",
        description: "You are now connected with this user.",
      });
    } catch (error) {
      toast({
        title: "Failed to accept connection",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleRejectConnection = async (id: number) => {
    try {
      await apiRequest('PATCH', `/api/connections/${id}`, { status: 'rejected' });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'connections'] });
      toast({
        title: "Connection declined",
        description: "You've declined this connection request.",
      });
    } catch (error) {
      toast({
        title: "Failed to decline connection",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleMessageUser = (userId: number) => {
    toast({
      title: "Messaging coming soon",
      description: `Direct messaging will be available in a future update.`,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="w-full h-32 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-xl mb-2">No connections yet</h3>
        <p className="text-muted-foreground mb-4">
          Connect with other marketing professionals to share insights and collaborate.
        </p>
      </div>
    );
  }

  return (
    <div>
      {connections.map(connection => (
        <ConnectionItem
          key={connection.id}
          connection={connection}
          currentUserId={currentUserId}
          onAccept={handleAcceptConnection}
          onReject={handleRejectConnection}
          onMessage={handleMessageUser}
        />
      ))}
    </div>
  );
};

const FindConnections = ({ userId }: { userId: number }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  // Mock search results - in a real implementation, this would be a query to your API
  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['/api/users/search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      
      // This is a placeholder - in reality, you'd search users via API
      // Mocking some data for UI demonstration
      return [
        { id: 2, username: 'marketingpro', displayName: 'Marketing Pro', level: 'Expert' },
        { id: 3, username: 'adguru', displayName: 'Ad Guru', level: 'Master' },
        { id: 4, username: 'brandinnovator', displayName: 'Brand Innovator', level: 'Strategist' },
      ];
    },
    enabled: searchTerm.trim().length > 2 // Only search when at least 3 characters are entered
  });

  const handleConnect = async (connectUserId: number) => {
    try {
      await apiRequest('POST', '/api/connections', {
        userId,
        connectedUserId: connectUserId,
        status: 'pending'
      });
      
      toast({
        title: "Connection request sent!",
        description: "They'll be notified of your request.",
      });
    } catch (error) {
      toast({
        title: "Failed to send request",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or username..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
          <p className="text-xs text-muted-foreground mt-1">
            Enter at least 3 characters to search
          </p>
        )}
      </div>

      {searchTerm.trim().length >= 3 && (
        <div>
          <h3 className="text-sm font-medium mb-4">Search Results</h3>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="w-full h-20 animate-pulse bg-muted" />
              ))}
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-6 bg-muted/30 rounded-md">
              <p className="text-muted-foreground">No users found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map(user => (
                <Card key={user.id} className="overflow-hidden">
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-base">{user.displayName}</h3>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => handleConnect(user.id)}
                    >
                      <UserPlus className="h-4 w-4" />
                      Connect
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {searchTerm.trim().length < 3 && (
        <div className="text-center py-12 px-4 bg-muted/30 rounded-lg">
          <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-xl mb-2">Find Marketing Professionals</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Search for other MarketSim users to connect, collaborate, and share insights.
          </p>
        </div>
      )}
    </div>
  );
};

const PendingConnectionRequests = ({ userId }: { userId: number }) => {
  const { toast } = useToast();
  
  // Fetch all connections for the current user
  const { data: connections = [], isLoading } = useQuery<Connection[]>({
    queryKey: ['/api/users', userId, 'connections'],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/${userId}/connections`);
        if (!res.ok) throw new Error('Failed to fetch connections');
        return res.json();
      } catch (error) {
        console.error("Error fetching connections:", error);
        return [];
      }
    }
  });

  // Filter to find pending requests
  const pendingRequests = connections.filter(conn => 
    conn.status === 'pending' && conn.userId !== userId
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="w-full h-24 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-xl mb-2">No pending requests</h3>
        <p className="text-muted-foreground mb-4">
          You're all caught up! No connection requests to review.
        </p>
      </div>
    );
  }

  const handleAcceptConnection = async (id: number) => {
    try {
      await apiRequest('PATCH', `/api/connections/${id}`, { status: 'accepted' });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'connections'] });
      toast({
        title: "Connection accepted!",
        description: "You are now connected with this user.",
      });
    } catch (error) {
      toast({
        title: "Failed to accept connection",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleRejectConnection = async (id: number) => {
    try {
      await apiRequest('PATCH', `/api/connections/${id}`, { status: 'rejected' });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'connections'] });
      toast({
        title: "Connection declined",
        description: "You've declined this connection request.",
      });
    } catch (error) {
      toast({
        title: "Failed to decline connection",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
      <div className="space-y-3">
        {pendingRequests.map(request => (
          <Card key={request.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{`U${request.userId}`}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">User #{request.userId}</CardTitle>
                    <CardDescription className="text-xs">
                      Wants to connect with you
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Pending
                </Badge>
              </div>
            </CardHeader>
            <CardFooter className="flex gap-2 pt-2">
              <Button 
                variant="default" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => handleAcceptConnection(request.id)}
              >
                <Check className="h-4 w-4" />
                Accept
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => handleRejectConnection(request.id)}
              >
                <X className="h-4 w-4" />
                Decline
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const NetworkEvents = () => {
  // This would be populated from API in a real implementation
  const upcomingEvents = [
    {
      id: 1,
      title: 'Digital Marketing Mastermind',
      date: '2025-04-02T18:00:00',
      attendees: 24,
      type: 'Virtual Meetup'
    },
    {
      id: 2,
      title: 'PPC Strategy Workshop',
      date: '2025-04-15T14:00:00',
      attendees: 18,
      type: 'Workshop'
    },
    {
      id: 3,
      title: 'Social Media Trends 2025',
      date: '2025-04-28T17:30:00',
      attendees: 36,
      type: 'Webinar'
    }
  ];

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
      <div className="space-y-3">
        {upcomingEvents.map(event => (
          <Card key={event.id} className="overflow-hidden">
            <div className="h-1.5 bg-indigo-500" />
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <Badge variant="outline">
                  {event.type}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatEventDate(event.date)}</span>
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0 pb-3">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees} attending</span>
                </div>
                <Button size="sm">RSVP</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Connections = () => {
  const [activeTab, setActiveTab] = useState('network');
  const { toast } = useToast();
  
  // In a real app, this would come from authentication/context
  const currentUserId = 1;
  
  // Fetch all connections for the current user
  const { data: connections = [], isLoading } = useQuery<Connection[]>({
    queryKey: ['/api/users', currentUserId, 'connections'],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/${currentUserId}/connections`);
        if (!res.ok) throw new Error('Failed to fetch connections');
        return res.json();
      } catch (error) {
        console.error("Error fetching connections:", error);
        return [];
      }
    }
  });

  // Filter by connection status
  const pendingOutgoing = connections.filter(conn => conn.status === 'pending' && conn.userId === currentUserId);
  const accepted = connections.filter(conn => conn.status === 'accepted');
  const pendingIncoming = connections.filter(conn => conn.status === 'pending' && conn.userId !== currentUserId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Professional Network</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs defaultValue="network" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="network" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>My Network</span>
              </TabsTrigger>
              <TabsTrigger value="find" className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                <span>Find Connections</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-1 relative">
                <Bell className="h-4 w-4" />
                <span>Requests</span>
                {pendingIncoming.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] flex items-center justify-center bg-red-500 text-white rounded-full">
                    {pendingIncoming.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="network">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">My Connections</h2>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {accepted.length} Connected
                  </Badge>
                </div>
                
                <ConnectionsList 
                  connections={accepted} 
                  currentUserId={currentUserId}
                  isLoading={isLoading} 
                />
              </div>
              
              {pendingOutgoing.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold">Pending Sent Requests</h2>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      {pendingOutgoing.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {pendingOutgoing.map(request => (
                      <Card key={request.id} className="overflow-hidden">
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {`U${request.connectedUserId}`}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-sm font-medium">User #{request.connectedUserId}</h3>
                                <p className="text-xs text-muted-foreground">Awaiting response</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-600 text-sm">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Pending</span>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="find">
              <FindConnections userId={currentUserId} />
            </TabsContent>
            
            <TabsContent value="pending">
              <PendingConnectionRequests userId={currentUserId} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <NetworkEvents />
        </div>
      </div>
    </div>
  );
};

export default Connections;