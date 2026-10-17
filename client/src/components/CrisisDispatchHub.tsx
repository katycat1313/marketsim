import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PhoneCall, CheckCircle2, AlertTriangle, ShieldCheck, Flame, Sparkles } from "lucide-react";
import { CRISIS_SCENARIOS, CrisisScenario, getCrisesForWeek } from "@/lib/crisisScenarios";
import { EmergencyCrisisModal } from "./EmergencyCrisisModal";
import { useToast } from "@/hooks/use-toast";

interface CrisisDispatchHubProps {
  isOpen: boolean;
  onClose: () => void;
  defaultWeek?: number;
}

export function CrisisDispatchHub({ isOpen, onClose, defaultWeek = 1 }: CrisisDispatchHubProps) {
  const [selectedWeek, setSelectedWeek] = useState(defaultWeek.toString());
  const [activeScenario, setActiveScenario] = useState<CrisisScenario | null>(null);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setSelectedWeek(defaultWeek.toString());
  }, [defaultWeek]);

  // Load resolved crises from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("krechet_crises_resolved");
      if (saved) setResolvedIds(JSON.parse(saved));
    } catch {}
  }, []);

  const handleLaunchScenario = (sc: CrisisScenario) => {
    setActiveScenario(sc);
    setIsCrisisModalOpen(true);
  };

  const handleScenarioResolved = () => {
    if (!activeScenario) return;
    const updated = Array.from(new Set([...resolvedIds, activeScenario.id]));
    setResolvedIds(updated);
    try {
      localStorage.setItem("krechet_crises_resolved", JSON.stringify(updated));
    } catch {}
    toast({
      title: "🎉 Crisis Averted!",
      description: `${activeScenario.title} completed. +${activeScenario.rewardRep} Rep Points logged to your portfolio!`,
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-2xl bg-slate-950/95 border border-red-500/30 text-foreground backdrop-blur-2xl shadow-2xl p-6 rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 animate-pulse">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
                    Agency Crisis Dispatch Room
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    3 High-Stakes Tactical Fires Per Week • Live Audio Calls & Executive Pressure
                  </DialogDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30 bg-emerald-500/10 font-mono">
                {resolvedIds.length}/12 Fires Averted
              </Badge>
            </div>
          </DialogHeader>

          <Tabs value={selectedWeek} onValueChange={setSelectedWeek} className="mt-2">
            <TabsList className="grid grid-cols-4 bg-slate-900 border border-white/10 p-1">
              <TabsTrigger value="1" className="text-xs">Week 1: SEO</TabsTrigger>
              <TabsTrigger value="2" className="text-xs">Week 2: Ads</TabsTrigger>
              <TabsTrigger value="3" className="text-xs">Week 3: CRO</TabsTrigger>
              <TabsTrigger value="4" className="text-xs">Week 4: Scale</TabsTrigger>
            </TabsList>

            {[1, 2, 3, 4].map((wk) => {
              const weekCrises = getCrisesForWeek(wk);
              return (
                <TabsContent key={wk} value={wk.toString()} className="space-y-3 mt-4">
                  <div className="text-xs text-muted-foreground font-semibold px-1">
                    Week {wk} Emergency Schedule (1 Operational, 1 Executive Boss, 1 PR/Legal):
                  </div>
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {weekCrises.map((cr) => {
                      const isResolved = resolvedIds.includes(cr.id);
                      return (
                        <div
                          key={cr.id}
                          className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                            isResolved
                              ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                              : "bg-slate-900/60 border-white/10 hover:border-red-500/40 text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-10 w-10 border border-white/10 shrink-0">
                              <AvatarImage src={cr.callerAvatar} alt={cr.callerName} />
                              <AvatarFallback className="bg-red-500/20 text-red-300 font-bold text-xs">
                                {cr.callerName.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-xs text-foreground truncate">{cr.title}</span>
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] py-0 px-1.5 ${
                                    cr.category === "executive"
                                      ? "border-amber-500/40 text-amber-400 bg-amber-500/10"
                                      : cr.category === "pr_legal"
                                      ? "border-purple-500/40 text-purple-400 bg-purple-500/10"
                                      : "border-blue-500/40 text-blue-400 bg-blue-500/10"
                                  }`}
                                >
                                  {cr.urgencyBadge}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                                {cr.callerName} ({cr.callerRole}) • {cr.clientName}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            {isResolved ? (
                              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[11px] flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Averted (+{cr.rewardRep} Rep)</span>
                              </Badge>
                            ) : null}

                            <Button
                              size="sm"
                              onClick={() => handleLaunchScenario(cr)}
                              className={`h-7 px-2.5 text-xs font-semibold flex items-center gap-1.5 ${
                                isResolved
                                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                  : "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30"
                              }`}
                            >
                              <PhoneCall className="h-3 w-3" />
                              <span>{isResolved ? "Replay Call" : "Answer Call"}</span>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </DialogContent>
      </Dialog>

      {activeScenario && (
        <EmergencyCrisisModal
          isOpen={isCrisisModalOpen}
          onClose={() => setIsCrisisModalOpen(false)}
          onResolved={handleScenarioResolved}
          scenario={activeScenario}
        />
      )}
    </>
  );
}
