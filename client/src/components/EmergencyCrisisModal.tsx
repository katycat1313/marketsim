import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, PhoneOff, AlertTriangle, ShieldCheck, Sparkles, Volume2, VolumeX, CheckCircle2, Clock } from "lucide-react";
import { useDeepgramVoice } from "@/hooks/useDeepgramVoice";

interface EmergencyCrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolved: () => void;
  callerName?: string;
  callerRole?: string;
  callerAvatar?: string;
  clientName?: string;
}

export function EmergencyCrisisModal({
  isOpen,
  onClose,
  onResolved,
  callerName = "Sarah Jenkins",
  callerRole = "Lead Account Director",
  callerAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
  clientName = "Jenny's Artisan Java"
}: EmergencyCrisisModalProps) {
  const [callState, setCallState] = useState<"ringing" | "connected" | "de-escalation" | "resolved">("ringing");
  const [callSeconds, setCallSeconds] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const voice = useDeepgramVoice({
    defaultVoice: "aura-asteria-en"
  });

  const crisisAudioText = 
    "Hey, stop what you're doing for a second. Jenny just called me in a total panic. Her barista has four customers arguing at the register right now because an old test promo on the site says whole bean bags are $4 instead of $18! We need to handle this immediately before she gets slammed with one-star reviews on Google Maps. What's the best damage-control response?";

  // Play realistic telephone ring sound via Web Audio API
  const playPhoneRing = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.setValueAtTime(480, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.4);
      osc2.stop(ctx.currentTime + 1.4);
    } catch {
      // Ignore browser autoplay restrictions
    }
  };

  useEffect(() => {
    if (isOpen && callState === "ringing") {
      playPhoneRing();
      const ringInterval = setInterval(playPhoneRing, 3500);
      return () => clearInterval(ringInterval);
    }
  }, [isOpen, callState]);

  useEffect(() => {
    if (callState === "connected") {
      timerRef.current = setInterval(() => {
        setCallSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  const handleAnswerCall = () => {
    setCallState("connected");
    voice.speak(crisisAudioText);
  };

  const handleRejectCall = () => {
    voice.stop();
    onClose();
  };

  const handleSelectOption = (idx: number) => {
    setSelectedResponse(idx);
    if (idx === 1) {
      // Correct tactical answer
      setFeedback("✅ Exactly right. In client management, honoring the promo for the 4 people currently in the store turns a PR disaster into word-of-mouth loyalty. The immediate CMS fix stops future loss.");
      voice.speak("Brilliant call. Jenny just texted me—she honored the $4 for those four customers and offered a free pour-over. They were super understanding and even promised to leave a positive review! Great job staying calm under pressure.");
      setCallState("resolved");
    } else if (idx === 0) {
      setFeedback("❌ Rookie mistake. Telling angry in-store customers to pay full price when your website made the error creates furious 1-star Yelp and Google Maps reviews that cost thousands to fix.");
    } else {
      setFeedback("❌ Never blame staff or interns to customers. It looks unprofessional and destroys customer trust in Jenny's brand.");
    }
  };

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <>
      {/* Floating Incoming Call Pill when Ringing */}
      {callState === "ringing" && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-slate-900/95 border-2 border-red-500/80 backdrop-blur-xl shadow-2xl rounded-2xl p-4 w-80 text-foreground flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-red-500">
                  <AvatarImage src={callerAvatar} alt={callerName} />
                  <AvatarFallback className="bg-red-500 text-white font-bold">SJ</AvatarFallback>
                </Avatar>
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="destructive" className="text-[9px] uppercase px-1.5 py-0">
                    Client Emergency
                  </Badge>
                </div>
                <h4 className="text-sm font-bold mt-0.5">{callerName}</h4>
                <p className="text-[11px] text-muted-foreground">{callerRole}</p>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-[11px] text-red-200">
              🚨 Urgent call regarding <strong>{clientName}</strong> pricing dispute.
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleRejectCall}
                className="w-1/2 flex items-center justify-center gap-1.5 text-xs"
              >
                <PhoneOff className="h-3.5 w-3.5" />
                <span>Dismiss</span>
              </Button>
              <Button 
                size="sm" 
                onClick={handleAnswerCall}
                className="w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 text-xs animate-pulse"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Answer Call</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Connected Emergency Room Modal */}
      {(callState === "connected" || callState === "resolved") && (
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent className="max-w-xl bg-slate-950/95 border border-red-500/40 text-foreground backdrop-blur-2xl">
            <DialogHeader className="border-b border-border/60 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-10 w-10 border border-primary/40">
                    <AvatarImage src={callerAvatar} alt={callerName} />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-base flex items-center gap-2">
                      <span>{callerName}</span>
                      <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/40 bg-emerald-500/10 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        <span>{formatTime(callSeconds)}</span>
                      </Badge>
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      Live Crisis Comms • Client: {clientName}
                    </DialogDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => (voice.isSpeaking ? voice.stop() : voice.speak(crisisAudioText))}
                    className="text-xs flex items-center gap-1 text-muted-foreground"
                  >
                    {voice.isSpeaking ? <Volume2 className="h-4 w-4 text-emerald-400 animate-pulse" /> : <VolumeX className="h-4 w-4" />}
                    <span>{voice.isSpeaking ? "Speaking" : "Muted"}</span>
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Crisis Briefing Card */}
              <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Immediate Situation Report:</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed italic">
                  "{crisisAudioText}"
                </p>
              </div>

              {/* Tactical Question */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Your Strategic Decision (Damage Control):
                </h4>

                <div className="space-y-2">
                  {[
                    "Option A: Tell Jenny to stand firm, refuse the $4 price, and demand customers pay the full $18.",
                    "Option B: Honor the $4 price for the 4 people currently at the counter as a one-time courtesy, offer a free sample, and fix the CMS price to $18 immediately.",
                    "Option C: Tell the customers that the website developer made a stupid mistake and it's not Jenny's fault."
                  ].map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={callState === "resolved"}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start gap-2.5 ${
                        selectedResponse === idx
                          ? idx === 1
                            ? "bg-emerald-950/40 border-emerald-500 text-emerald-200"
                            : "bg-red-950/40 border-red-500 text-red-200"
                          : "bg-card/60 border-border/70 hover:border-primary/50 text-foreground"
                      }`}
                    >
                      <span className="font-bold text-primary shrink-0">[{idx + 1}]</span>
                      <span className="leading-relaxed">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Alert */}
              {feedback && (
                <div className={`p-3 rounded-lg text-xs leading-relaxed border ${
                  selectedResponse === 1 
                    ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                    : "bg-red-950/30 border-red-500/40 text-red-300"
                }`}>
                  {feedback}
                </div>
              )}
            </div>

            <DialogFooter className="border-t border-border/60 pt-3 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {callState === "resolved" ? "🏆 Crisis resolved • Portfolio score updated" : "Select an option to advise your client"}
              </span>

              {callState === "resolved" ? (
                <Button 
                  onClick={() => {
                    voice.stop();
                    onResolved();
                    onClose();
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Resume SEO Flight</span>
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRejectCall}
                  className="text-xs text-muted-foreground"
                >
                  Hang Up Call
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
