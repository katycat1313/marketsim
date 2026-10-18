import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Phone, PhoneOff, AlertTriangle, ShieldCheck, Sparkles, Volume2, VolumeX, CheckCircle2, Clock, Lightbulb, Activity, Sliders } from "lucide-react";
import { useDeepgramVoice } from "@/hooks/useDeepgramVoice";
import { CrisisScenario } from "@/lib/crisisScenarios";

export interface CrisisOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
  spokenResolution?: string;
}

const DEFAULT_CRISIS_OPTIONS: CrisisOption[] = [
  {
    text: "Option A: Tell Jenny to stand firm, refuse the $4 price, and demand customers pay the full $18.",
    isCorrect: false,
    feedback: "❌ Rookie mistake. Telling angry in-store customers to pay full price when your website made the error creates furious 1-star Yelp and Google Maps reviews that cost thousands to fix."
  },
  {
    text: "Option B: Honor the $4 price for the 4 people currently at the counter as a one-time courtesy, offer a free sample, and fix the CMS price to $18 immediately.",
    isCorrect: true,
    feedback: "✅ Exactly right. In client management, honoring the promo for the 4 people currently in the store turns a PR disaster into word-of-mouth loyalty. The immediate CMS fix stops future loss.",
    spokenResolution: "Brilliant call. Jenny just texted me—she honored the $4 for those four customers and offered a free pour-over. They were super understanding and even promised to leave a positive review! Great job staying calm under pressure."
  },
  {
    text: "Option C: Tell the customers that the website developer made a stupid mistake and it's not Jenny's fault.",
    isCorrect: false,
    feedback: "❌ Never blame staff or interns to customers. It looks unprofessional and destroys customer trust in Jenny's brand."
  }
];

// -------------------------------------------------------------
// Interactive Action Drill 1: Campaign Audit Diagnostic (Boss)
// -------------------------------------------------------------
function CampaignAuditAction({
  hint,
  onSuccess,
  isResolved
}: {
  hint?: string;
  onSuccess: (feedbackText: string, speech: string) => void;
  isResolved: boolean;
}) {
  const [mobileBidReduction, setMobileBidReduction] = useState(0);
  const [matchType, setMatchType] = useState<"broad" | "phrase_exact">("broad");
  const [selectedNegatives, setSelectedNegatives] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableNegatives = ["-free", "-diy", "-cheap", "-jobs", "-dentures", "-wholesale"];

  const toggleNegative = (kw: string) => {
    if (selectedNegatives.includes(kw)) {
      setSelectedNegatives(selectedNegatives.filter(k => k !== kw));
    } else {
      setSelectedNegatives([...selectedNegatives, kw]);
    }
  };

  const handleApplyFix = () => {
    if (mobileBidReduction > -40) {
      setErrorMsg("⚠️ Atlas: Mobile is still bleeding cash! Reduce Mobile bid adjustment by at least -50% to choke off the wasted spend.");
      return;
    }
    if (matchType !== "phrase_exact") {
      setErrorMsg("⚠️ Atlas: Broad match is still leaking into junk searches! Switch keyword match strategy to Phrase & Exact match.");
      return;
    }
    if (selectedNegatives.length < 3) {
      setErrorMsg("⚠️ Atlas: You haven't deployed enough negative shields! Add at least 3 negative keywords to filter unqualified search terms.");
      return;
    }

    setErrorMsg(null);
    onSuccess(
      `✅ Diagnostic Masterclass! You dropped mobile bids by ${Math.abs(mobileBidReduction)}% to choke off the $410 leak, shifted to phrase/exact match to stop junk queries, and shielded against ${selectedNegatives.join(", ")}. Blended CPA instantly normalized to $18!`,
      "That's exactly what I wanted to see! You cut the mobile bleed in half, locked down match types, and shielded the negatives. Telemetry shows CPA dropping straight to eighteen dollars. Outstanding diagnostic work!"
    );
  };

  return (
    <div className="space-y-3.5">
      {/* Telemetry Table */}
      <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-amber-400" />
            Live Device Telemetry
          </span>
          <span className="text-[10px] text-red-400 font-mono">⚠️ $95 Blended CPA</span>
        </div>
        <div className="grid grid-cols-5 text-[10px] font-mono text-muted-foreground border-b border-white/10 pb-1">
          <span>Device</span>
          <span className="text-right">Clicks</span>
          <span className="text-right">Spend</span>
          <span className="text-right">Calls</span>
          <span className="text-right">CPA</span>
        </div>
        <div className="space-y-1 text-[11px] font-mono">
          <div className="grid grid-cols-5 text-emerald-400">
            <span>Desktop</span>
            <span className="text-right">90</span>
            <span className="text-right">$180</span>
            <span className="text-right">12</span>
            <span className="text-right font-bold">$15 (Great)</span>
          </div>
          <div className="grid grid-cols-5 text-red-400 bg-red-950/30 px-1 py-0.5 rounded">
            <span>Mobile</span>
            <span className="text-right">320</span>
            <span className="text-right">$410</span>
            <span className="text-right">1</span>
            <span className="text-right font-bold">$410 (BLEED)</span>
          </div>
          <div className="grid grid-cols-5 text-muted-foreground">
            <span>Tablet</span>
            <span className="text-right">10</span>
            <span className="text-right">$15</span>
            <span className="text-right">0</span>
            <span className="text-right">$15</span>
          </div>
        </div>
      </div>

      {hint && (
        <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-200 flex items-start gap-2">
          <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <span><strong>Boss Clue:</strong> {hint}</span>
        </div>
      )}

      {/* Interactive Controls */}
      <div className="p-3.5 rounded-xl border border-white/10 bg-slate-900/60 space-y-3">
        {/* Control 1: Mobile Bid Adjustment */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-foreground">1. Mobile Device Bid Adjustment:</span>
            <span className={`font-mono font-bold ${mobileBidReduction <= -40 ? "text-emerald-400" : "text-amber-400"}`}>
              {mobileBidReduction}%
            </span>
          </div>
          <Slider
            value={[mobileBidReduction]}
            min={-100}
            max={0}
            step={5}
            disabled={isResolved}
            onValueChange={(val) => setMobileBidReduction(val[0])}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>-100% (Shut Off)</span>
            <span className="text-emerald-400">-50% (Recommended)</span>
            <span>0% (Current Bleed)</span>
          </div>
        </div>

        {/* Control 2: Keyword Match Strategy */}
        <div>
          <div className="text-xs font-semibold text-foreground mb-1.5">2. Keyword Match Type Policy:</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isResolved}
              onClick={() => setMatchType("broad")}
              className={`p-2 rounded-lg border text-left text-xs transition-all ${
                matchType === "broad" ? "bg-red-950/30 border-red-500 text-red-200" : "bg-card/40 border-border/60 text-muted-foreground"
              }`}
            >
              <div className="font-bold">Broad Match (Current)</div>
              <div className="text-[10px] opacity-80">High volume, junk queries</div>
            </button>
            <button
              type="button"
              disabled={isResolved}
              onClick={() => setMatchType("phrase_exact")}
              className={`p-2 rounded-lg border text-left text-xs transition-all ${
                matchType === "phrase_exact" ? "bg-emerald-950/30 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50" : "bg-card/40 border-border/60 text-muted-foreground"
              }`}
            >
              <div className="font-bold text-emerald-300">Phrase & Exact Match (Shielded)</div>
              <div className="text-[10px] opacity-80">High intent, zero search waste</div>
            </button>
          </div>
        </div>

        {/* Control 3: Negative Keywords */}
        <div>
          <div className="text-xs font-semibold text-foreground mb-1.5">3. Deploy Negative Keyword Shields (Pick 3+):</div>
          <div className="flex flex-wrap gap-1.5">
            {availableNegatives.map((neg) => {
              const active = selectedNegatives.includes(neg);
              return (
                <button
                  key={neg}
                  type="button"
                  disabled={isResolved}
                  onClick={() => toggleNegative(neg)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    active
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold"
                      : "bg-card/40 border-border/70 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {active ? `✓ ${neg}` : `+ ${neg}`}
                </button>
              );
            })}
          </div>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/40 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {!isResolved && (
          <Button
            onClick={handleApplyFix}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 shadow-lg mt-2 flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Apply Corrective Changes & Report to Atlas</span>
          </Button>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Interactive Action Drill 2: Persona & Budget Allocation (Client)
// -------------------------------------------------------------
function PersonaStrategyAction({
  hint,
  onSuccess,
  isResolved
}: {
  hint?: string;
  onSuccess: (feedbackText: string, speech: string) => void;
  isResolved: boolean;
}) {
  const [googleSearch, setGoogleSearch] = useState(250);
  const [linkedIn, setLinkedIn] = useState(100);
  const [metaRetargeting, setMetaRetargeting] = useState(50);
  const [tiktok, setTiktok] = useState(0);
  const [hook, setHook] = useState("6 AM Executive Orthopedic & Recovery: Zero-Wait Care for Managing Partners");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const total = googleSearch + linkedIn + metaRetargeting + tiktok;

  const handleApplyStrategy = () => {
    if (total !== 400) {
      setErrorMsg(`⚠️ Total allocated budget is $${total}. You must allocate exactly the $400 weekly budget.`);
      return;
    }
    if (tiktok > 20) {
      setErrorMsg("⚠️ Dr. Reed: TikTok burns our razor-thin $400 on casual scrollers. High-earning corporate partners looking for executive care aren't booking from TikTok! Set TikTok to $0.");
      return;
    }
    if (googleSearch < 200 || linkedIn < 80) {
      setErrorMsg("⚠️ Dr. Reed: Thin budgets require concentrated commercial intent. Put at least $200 in Google Search and $80 in LinkedIn to reach decision-makers when pain occurs.");
      return;
    }

    setErrorMsg(null);
    onSuccess(
      "✅ Elite Channel Strategy! You focused 88% of the $400 budget on High-Intent Google Search and B2B LinkedIn targeting, with zero wasted on generic consumer video. Executive booking pipeline projected at 4.2x ROAS!",
      "I love this strategy! Focusing our four hundred dollars on high-intent search and LinkedIn means every single dollar is aimed straight at executives with active buying intent. Let's launch this immediately!"
    );
  };

  return (
    <div className="space-y-3.5">
      {/* Persona Hook */}
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-foreground">1. Executive Persona Hook & Value Proposition:</div>
        <input
          type="text"
          value={hook}
          disabled={isResolved}
          onChange={(e) => setHook(e.target.value)}
          className="w-full text-xs p-2.5 rounded-lg bg-slate-900 border border-white/10 text-foreground"
          placeholder="e.g. 6 AM Concierge Sessions • Zero Wait Time • Executive Recovery"
        />
      </div>

      {hint && (
        <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-200 flex items-start gap-2">
          <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <span><strong>Strategy Clue:</strong> {hint}</span>
        </div>
      )}

      {/* Budget Allocation Controls */}
      <div className="p-3.5 rounded-xl border border-white/10 bg-slate-900/60 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-primary" />
            2. Channel Budget Allocation ($400 Weekly Cap):
          </span>
          <Badge
            variant="outline"
            className={`font-mono text-xs ${
              total === 400 ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" : "text-red-400 border-red-500/40 bg-red-500/10"
            }`}
          >
            Total: ${total} / $400
          </Badge>
        </div>

        {/* Channel 1: Google Search */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-foreground">Google High-Intent Search:</span>
            <span className="font-mono text-emerald-400 font-bold">${googleSearch}</span>
          </div>
          <Slider
            value={[googleSearch]}
            min={0}
            max={400}
            step={10}
            disabled={isResolved}
            onValueChange={(val) => setGoogleSearch(val[0])}
          />
        </div>

        {/* Channel 2: LinkedIn Ads */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-foreground">LinkedIn B2B Sponsored Content:</span>
            <span className="font-mono text-blue-400 font-bold">${linkedIn}</span>
          </div>
          <Slider
            value={[linkedIn]}
            min={0}
            max={400}
            step={10}
            disabled={isResolved}
            onValueChange={(val) => setLinkedIn(val[0])}
          />
        </div>

        {/* Channel 3: Meta Retargeting */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-foreground">Meta Website Visitor Retargeting:</span>
            <span className="font-mono text-purple-400 font-bold">${metaRetargeting}</span>
          </div>
          <Slider
            value={[metaRetargeting]}
            min={0}
            max={400}
            step={10}
            disabled={isResolved}
            onValueChange={(val) => setMetaRetargeting(val[0])}
          />
        </div>

        {/* Channel 4: TikTok Consumer Video */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-foreground">TikTok Consumer Influencer:</span>
            <span className={`font-mono font-bold ${tiktok > 0 ? "text-red-400" : "text-muted-foreground"}`}>${tiktok}</span>
          </div>
          <Slider
            value={[tiktok]}
            min={0}
            max={400}
            step={10}
            disabled={isResolved}
            onValueChange={(val) => setTiktok(val[0])}
          />
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/40 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {!isResolved && (
          <Button
            onClick={handleApplyStrategy}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 shadow-lg mt-2 flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Submit Strategy Brief to Dr. Evelyn Reed</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export interface EmergencyCrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolved: () => void;
  scenario?: CrisisScenario;
  callerName?: string;
  callerRole?: string;
  callerAvatar?: string;
  callerVoice?: string;
  clientName?: string;
  urgencyBadge?: string;
  crisisAudioText?: string;
  situationReportTitle?: string;
  tacticalQuestion?: string;
  options?: CrisisOption[];
  resolutionSummary?: string;
}

export function EmergencyCrisisModal({
  isOpen,
  onClose,
  onResolved,
  scenario,
  callerName: propCallerName,
  callerRole: propCallerRole,
  callerAvatar: propCallerAvatar,
  callerVoice: propCallerVoice,
  clientName: propClientName,
  urgencyBadge: propUrgencyBadge,
  crisisAudioText: propCrisisAudioText,
  situationReportTitle: propSituationReportTitle,
  tacticalQuestion: propTacticalQuestion,
  options: propOptions,
  resolutionSummary: propResolutionSummary,
}: EmergencyCrisisModalProps) {
  const callerName = scenario?.callerName || propCallerName || "Sarah Jenkins";
  const callerRole = scenario?.callerRole || propCallerRole || "Lead Account Director";
  const callerAvatar = scenario?.callerAvatar || propCallerAvatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400";
  const callerVoice = scenario?.callerVoice || propCallerVoice || "aura-asteria-en";
  const clientName = scenario?.clientName || propClientName || "Jenny's Artisan Java";
  const urgencyBadge = scenario?.urgencyBadge || propUrgencyBadge || "Client Emergency";
  const crisisAudioText = scenario?.crisisAudioText || propCrisisAudioText || "Hey, stop what you're doing for a second. Jenny just called me in a total panic. Her barista has four customers arguing at the register right now because an old test promo on the site says whole bean bags are $4 instead of $18! We need to handle this immediately before she gets slammed with one-star reviews on Google Maps. What's the best damage-control response?";
  const situationReportTitle = scenario?.situationReportTitle || propSituationReportTitle || "Immediate Situation Report:";
  const tacticalQuestion = scenario?.tacticalQuestion || propTacticalQuestion || "Your Strategic Decision (Damage Control):";
  const options = scenario?.options || propOptions || DEFAULT_CRISIS_OPTIONS;
  const resolutionSummary = scenario?.resolutionSummary || propResolutionSummary || "🏆 Crisis resolved • Portfolio score updated";

  const [callState, setCallState] = useState<"ringing" | "connected" | "de-escalation" | "resolved">("ringing");
  const [callSeconds, setCallSeconds] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state whenever modal is opened or scenario changes
  useEffect(() => {
    if (isOpen) {
      setCallState("ringing");
      setCallSeconds(0);
      setSelectedResponse(null);
      setFeedback(null);
    }
  }, [isOpen, scenario?.id]);

  const voice = useDeepgramVoice({
    defaultVoice: callerVoice as any
  });

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
    voice.speak(crisisAudioText, callerVoice);
  };

  const handleRejectCall = () => {
    voice.stop();
    onClose();
  };

  const handleSelectOption = (idx: number) => {
    setSelectedResponse(idx);
    const chosen = options[idx];
    if (!chosen) return;

    if (chosen.isCorrect) {
      setFeedback(chosen.feedback);
      if (chosen.spokenResolution) {
        voice.speak(chosen.spokenResolution, callerVoice);
      }
      setCallState("resolved");
    } else {
      setFeedback(chosen.feedback);
    }
  };

  const handleActionSuccess = (feedbackText: string, speechText: string) => {
    setFeedback(feedbackText);
    voice.speak(speechText, callerVoice);
    setCallState("resolved");
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
                  <AvatarFallback className="bg-red-500 text-white font-bold">{callerName.split(' ').map(w => w[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="destructive" className="text-[9px] uppercase px-1.5 py-0 font-bold">
                    {urgencyBadge}
                  </Badge>
                </div>
                <h4 className="text-sm font-bold mt-0.5">{callerName}</h4>
                <p className="text-[11px] text-muted-foreground">{callerRole}</p>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-[11px] text-red-200">
              🚨 Urgent incoming call regarding <strong>{clientName}</strong>
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
                    onClick={() => (voice.isSpeaking ? voice.stop() : voice.speak(crisisAudioText, callerVoice))}
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
                  <span>{situationReportTitle}</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed italic">
                  "{crisisAudioText}"
                </p>
              </div>

              {/* Tactical Question or Interactive Action */}
              {scenario?.interactiveType === "campaign_audit" ? (
                <CampaignAuditAction
                  hint={scenario.hint}
                  isResolved={callState === "resolved"}
                  onSuccess={handleActionSuccess}
                />
              ) : scenario?.interactiveType === "persona_strategy" ? (
                <PersonaStrategyAction
                  hint={scenario.hint}
                  isResolved={callState === "resolved"}
                  onSuccess={handleActionSuccess}
                />
              ) : (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {tacticalQuestion}
                  </h4>

                  <div className="space-y-2">
                    {options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={callState === "resolved"}
                        className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start gap-2.5 ${
                          selectedResponse === idx
                            ? option.isCorrect
                              ? "bg-emerald-950/40 border-emerald-500 text-emerald-200 font-medium"
                              : "bg-red-950/40 border-red-500 text-red-200"
                            : "bg-card/60 border-border/70 hover:border-primary/50 text-foreground"
                        }`}
                      >
                        <span className="font-bold text-primary shrink-0">[{idx + 1}]</span>
                        <span className="leading-relaxed">{option.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback Alert */}
              {feedback && (
                <div className={`p-3 rounded-lg text-xs leading-relaxed border ${
                  selectedResponse !== null && options[selectedResponse]?.isCorrect || callState === "resolved"
                    ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                    : "bg-red-950/30 border-red-500/40 text-red-300"
                }`}>
                  {feedback}
                </div>
              )}
            </div>

            <DialogFooter className="border-t border-border/60 pt-3 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {callState === "resolved" ? resolutionSummary : scenario?.interactiveType ? "Apply the corrective adjustments above" : "Select an option to advise your client"}
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
                  <span>Resume Campaign Workbench</span>
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
