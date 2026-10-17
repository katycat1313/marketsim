import React, { useState } from 'react';
import Posts from '@/components/Posts';
import Connections from '@/components/ui/connections';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageSquare, Users, Sparkles, TrendingUp, HelpCircle, ShieldCheck, Flame } from 'lucide-react';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'network'>('feed');

  return (
    <div className="container mx-auto py-6 max-w-5xl space-y-6">
      {/* Community Header Banner */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-[11px] font-semibold">
                Krechet Growth Network
              </Badge>
              <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Peer Hub</span>
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              Growth Lab Community & Peer Network
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Compare weekly client simulation strategies, tear down ad copy, get direct tactical feedback from Director Atlas and Sarah, and build your digital marketing network.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="text-right hidden sm:block p-3 rounded-xl bg-slate-950/50 border border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Community Ethos</div>
              <div className="text-xs font-bold text-primary">Brutal Honesty • Proof-of-Work</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)}>
            <TabsList className="bg-slate-950/80 p-1 border border-white/10 rounded-xl">
              <TabsTrigger 
                value="feed" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Tactical Growth Feed & Debriefs</span>
              </TabsTrigger>
              <TabsTrigger 
                value="network" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg"
              >
                <Users className="h-3.5 w-3.5" />
                <span>Peer Network & Study Groups</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'feed' ? (
        <div className="space-y-4">
          <Posts />
        </div>
      ) : (
        <div className="space-y-4">
          <Connections />
        </div>
      )}
    </div>
  );
}
