import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Sparkles, Scale, AlertCircle, Lock, BookOpen } from "lucide-react";

export function LegalDisclosuresModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("simulation");

  const openWithTab = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(true);
  };

  return (
    <>
      {/* Footer Navigation Links */}
      <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-muted-foreground/80 my-3">
        <button
          type="button"
          onClick={() => openWithTab("simulation")}
          className="hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          Simulation Disclosures
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => openWithTab("ai-voice")}
          className="hover:text-primary transition-colors underline-offset-4 hover:underline flex items-center gap-1"
        >
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span>AI Voice & Data Disclosure</span>
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => openWithTab("terms")}
          className="hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          Terms of Service
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => openWithTab("privacy")}
          className="hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          Privacy Policy
        </button>
      </div>

      {/* Disclosures Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto border-border/80 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-400" />
              <span>Krechet Academy Disclosures & Legal Compliance</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Official disclosures regarding simulation modeling, artificial intelligence, and educational terms.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
            <TabsList className="grid grid-cols-4 w-full text-xs">
              <TabsTrigger value="simulation" className="text-[11px] sm:text-xs">
                Simulation
              </TabsTrigger>
              <TabsTrigger value="ai-voice" className="text-[11px] sm:text-xs">
                AI Voice
              </TabsTrigger>
              <TabsTrigger value="terms" className="text-[11px] sm:text-xs">
                Terms
              </TabsTrigger>
              <TabsTrigger value="privacy" className="text-[11px] sm:text-xs">
                Privacy
              </TabsTrigger>
            </TabsList>

            {/* Simulation Disclosure */}
            <TabsContent value="simulation" className="space-y-3 text-xs leading-relaxed text-foreground/90 mt-4">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-300">Educational Simulation Environment</h4>
                  <p className="text-[11px] text-amber-200/90 mt-0.5">
                    Krechet Academy is an interactive training and flight-simulator-style platform. No real advertising budget is charged during student drills.
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-sm text-foreground">1. Synthetic Client Accounts & Bidding</h4>
              <p>
                All client scenarios (including Jenny Miller and Jenny's Artisan Java), advertising budgets, Quality Scores, CPC auctions, and conversion metrics are calculated by our proprietary simulation engine. While modeled on real-world algorithms (Google Ads AdRank, Meta Ads auction thresholds, and GA4 telemetry), training simulations do not place live ads on external search engines or social media networks.
              </p>

              <h4 className="font-bold text-sm text-foreground">2. Results & Earnings Disclaimer (FTC Compliance)</h4>
              <p>
                Simulation performance, verified portfolio badges, and case study exports are credentials demonstrating course comprehension. Krechet Academy does not guarantee job placement, client acquisition, employment, or specific financial earnings. Results depend on individual execution and market conditions.
              </p>
            </TabsContent>

            {/* AI Voice & Audio Processing */}
            <TabsContent value="ai-voice" className="space-y-3 text-xs leading-relaxed text-foreground/90 mt-4">
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-indigo-300">Real-Time AI Voice Processing Disclosure</h4>
                  <p className="text-[11px] text-indigo-200/90 mt-0.5">
                    Live voice interactions are powered by multimodal conversational AI models (Google Gemini Live & Deepgram).
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-sm text-foreground">1. Real-Time Audio Streaming</h4>
              <p>
                When you activate the microphone for classroom discussions or crisis drills, audio is streamed securely over encrypted WebSockets (TLS/WSS) to our inference servers. Audio is processed transiently to generate real-time Socratic responses and evaluate learning milestones. Audio streams are not sold or used for public training.
              </p>

              <h4 className="font-bold text-sm text-foreground">2. Socratic Verification & Human-in-the-Loop</h4>
              <p>
                The AI Coach is trained to guide, challenge, and test your marketing reasoning. Students are encouraged to audit and verify all AI recommendations. AI-generated text or strategies should always be cross-referenced with your verified business data.
              </p>
            </TabsContent>

            {/* Terms of Service */}
            <TabsContent value="terms" className="space-y-3 text-xs leading-relaxed text-foreground/90 mt-4">
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/80 flex items-start gap-2">
                <Scale className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Academic Enrollment & Access Terms</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Guidelines governing course progression, sequential level gating, and platform subscriptions.
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-sm text-foreground">1. Week 1 Free Access</h4>
              <p>
                Week 1 (Jenny's Artisan Java & Foundation Briefing) is provided free of charge with no credit card required at registration. Access to subsequent weeks, advanced simulations, and portfolio verification requires enrollment in Course 1 or Course 2.
              </p>

              <h4 className="font-bold text-sm text-foreground">2. Payment & Continuity Billing</h4>
              <p>
                Course 1 ($59) grants lifetime access to Foundation modules. Course 2 ($199/month) provides continuous access to the Creative AI Suite, agency client twin injection, and weekly crisis drills. Subscriptions may be canceled at any time via your account portal with zero cancellation fees.
              </p>
            </TabsContent>

            {/* Privacy Policy */}
            <TabsContent value="privacy" className="space-y-3 text-xs leading-relaxed text-foreground/90 mt-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2">
                <Lock className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-emerald-300">Data Privacy & Security Standards</h4>
                  <p className="text-[11px] text-emerald-200/90 mt-0.5">
                    Your account security and payment details are handled under strict industry compliance standards.
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-sm text-foreground">1. Payment Processing Security</h4>
              <p>
                All credit card transactions are handled directly by Stripe. Krechet Academy never stores, views, or logs full payment card numbers or CVV codes on our servers. All checkouts are protected by TLS 1.3 encryption and 3D Secure authentication.
              </p>

              <h4 className="font-bold text-sm text-foreground">2. Personal Data Protection</h4>
              <p>
                We only collect your name, email, and simulation progression data to track course completion and issue verified credentials. We will never sell, rent, or trade your personal information to third-party marketing brokers.
              </p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
