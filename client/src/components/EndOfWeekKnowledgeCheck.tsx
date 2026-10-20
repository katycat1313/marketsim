import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Bot,
  UserCheck,
  ShieldAlert,
  Loader2,
  FileCheck,
  Building2,
  Coffee,
  HelpCircle,
  ExternalLink
} from "lucide-react";
import { useClientAgency } from "@/context/ClientAgencyContext";

export function EndOfWeekKnowledgeCheck() {
  const { client } = useClientAgency();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [mcAnswers, setMcAnswers] = useState<Record<string, string>>({
    q1: "",
    q2: "",
    q3: ""
  });

  const [reasoningAnswers, setReasoningAnswers] = useState({
    q1: "",
    q2: ""
  });

  // Audit Results State
  const [auditResult, setAuditResult] = useState<any>(null);

  const handleMcSelect = (qId: string, val: string) => {
    setMcAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleReasoningChange = (qId: "q1" | "q2", val: string) => {
    setReasoningAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const isFormComplete =
    mcAnswers.q1 &&
    mcAnswers.q2 &&
    mcAnswers.q3 &&
    reasoningAnswers.q1.trim().length >= 20 &&
    reasoningAnswers.q2.trim().length >= 20;

  const handleSubmitAudit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/client/audit-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          week: client?.timeline.currentWeek || 1,
          multipleChoiceAnswers: mcAnswers,
          reasoningAnswers
        })
      });
      const data = await res.json();
      setAuditResult(data);
    } catch (err) {
      console.error("Audit submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAuditResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-7 text-xs font-semibold gap-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
        >
          <Award className="h-3.5 w-3.5" />
          <span>Week 1 Agency Audit & Review</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                <Coffee className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">
                  Week 1 Agency Audit & Competency Verification
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Account: <strong>Jenny's Artisan Java & Roastery</strong> • Rigor Standard: Uncheatable Practitioner Check
                </DialogDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10">
              AI Authenticity Auditor Active
            </Badge>
          </div>
        </DialogHeader>

        {/* Audit Results Screen */}
        {auditResult ? (
          <div className="space-y-6 py-2">
            {/* Approval Banner */}
            {auditResult.isApproved ? (
              <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                        Agency Competency Approved: Level 1 Specialist
                      </h3>
                      <Badge className="bg-emerald-600 text-white text-[11px]">
                        Authentic Human Practitioner
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {auditResult.practitionerFeedback}
                    </p>
                  </div>
                </div>

                {/* Credential Card */}
                {auditResult.credential && (
                  <div className="mt-4 p-4 rounded-lg bg-background/90 border border-emerald-500/30 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">Official Agency Credential</span>
                      <span>Verified: {new Date(auditResult.verifiedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {auditResult.credential.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Client Account: <strong>{auditResult.credential.accountAudited}</strong>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {auditResult.credential.skillsVerified.map((skill: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-[10px] py-0 px-2 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          ✓ {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-rose-600 dark:text-rose-400">
                        Audit Flagged: Revision Required
                      </h3>
                      <Badge variant="destructive" className="text-[11px]">
                        AI Template / Insufficient Grounding
                      </Badge>
                    </div>
                    <p className="text-xs text-foreground mt-1 font-medium">
                      {auditResult.practitionerFeedback}
                    </p>
                  </div>
                </div>

                {/* Audit Flags */}
                {auditResult.auditFlags && auditResult.auditFlags.length > 0 && (
                  <div className="mt-3 p-3 rounded-lg bg-background/80 border border-border text-xs space-y-1.5">
                    <div className="font-semibold text-rose-500 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Specific Items Flagged by Auditor:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {auditResult.auditFlags.map((flag: string, idx: number) => (
                        <li key={idx}><span className="text-foreground">{flag}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Multiple Choice Breakdown */}
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/60 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Scenario Knowledge Score: {auditResult.mcScore} / {auditResult.mcTotal} ({auditResult.mcPercentage}%)
              </h4>
              <div className="space-y-2 text-xs pt-1">
                {Object.entries(auditResult.mcDetails).map(([key, item]: [string, any], idx) => (
                  <div key={key} className="flex items-start gap-2 p-2 rounded bg-background/60 border border-border/40">
                    {item.correct ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-medium text-foreground">Scenario {idx + 1}</div>
                      <div className="text-muted-foreground text-[11px] mt-0.5">{item.explanation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {!auditResult.isApproved ? (
                <Button onClick={handleReset} className="text-xs">
                  Revise Reasoning & Re-Submit
                </Button>
              ) : (
                <Button onClick={() => setOpen(false)} className="text-xs bg-emerald-600 hover:bg-emerald-700">
                  Return to Agency Client Hub
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Submission Form */
          <div className="space-y-6 py-2">
            {/* Uncheatable Auditor Notice */}
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs">
              <Bot className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-muted-foreground">
                <strong className="text-foreground">Why this audit exists:</strong> Employers value certificates that prove genuine thinking. Our AI Authenticity Auditor flags generic ChatGPT clichés (like <em>"in today's digital landscape"</em> or <em>"plays a pivotal role"</em>) and requires direct answers grounded in Jenny's coffee roastery metrics.
              </div>
            </div>

            {/* PART 1: MULTIPLE CHOICE SCENARIOS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</span>
                <h3 className="text-sm font-bold text-foreground">Part 1: Campaign Interconnection Scenarios</h3>
              </div>

              {/* Scenario 1 */}
              <div className="space-y-2 p-3.5 rounded-lg bg-secondary/30 border border-border/50">
                <Label className="text-xs font-medium leading-relaxed">
                  1. How did optimizing Jenny's coffee roastery SEO on-page score directly reduce her Google Paid Search CPC?
                </Label>
                <RadioGroup value={mcAnswers.q1} onValueChange={(v) => handleMcSelect("q1", v)} className="space-y-2 pt-1 text-xs">
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="a" id="mc-1-a" className="mt-0.5" />
                    <Label htmlFor="mc-1-a" className="font-normal text-muted-foreground leading-snug cursor-pointer">
                      A) Google gave a direct coupon discount because Jenny added 5 external backlinks.
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="b" id="mc-1-b" className="mt-0.5" />
                    <Label htmlFor="mc-1-b" className="font-normal text-foreground leading-snug cursor-pointer font-medium">
                      B) Better on-page SEO improved Landing Page Experience, which raised Quality Score from 5 to 9, unlocking a ~50% discount in the Google Ad auction.
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="c" id="mc-1-c" className="mt-0.5" />
                    <Label htmlFor="mc-1-c" className="font-normal text-muted-foreground leading-snug cursor-pointer">
                      C) SEO rankings automatically delete competitor ads from the search engine result page.
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Scenario 2 */}
              <div className="space-y-2 p-3.5 rounded-lg bg-secondary/30 border border-border/50">
                <Label className="text-xs font-medium leading-relaxed">
                  2. Why did our agency require 95% statistical significance (p &lt; 0.05) before deploying the A/B test winner?
                </Label>
                <RadioGroup value={mcAnswers.q2} onValueChange={(v) => handleMcSelect("q2", v)} className="space-y-2 pt-1 text-xs">
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="a" id="mc-2-a" className="mt-0.5" />
                    <Label htmlFor="mc-2-a" className="font-normal text-muted-foreground leading-snug cursor-pointer">
                      A) A/B test software refuses to let websites update unless 1,000,000 people have clicked.
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="b" id="mc-2-b" className="mt-0.5" />
                    <Label htmlFor="mc-2-b" className="font-normal text-muted-foreground leading-snug cursor-pointer">
                      B) Because Jenny's roastery is closed on weekends, so conversion rates are naturally zero.
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="c" id="mc-2-c" className="mt-0.5" />
                    <Label htmlFor="mc-2-c" className="font-normal text-foreground leading-snug cursor-pointer font-medium">
                      C) To ensure the +28.6% conversion lift was caused by the new copy/offer and not random sample noise.
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Scenario 3 */}
              <div className="space-y-2 p-3.5 rounded-lg bg-secondary/30 border border-border/50">
                <Label className="text-xs font-medium leading-relaxed">
                  3. After deploying the winning A/B test variant, what drove the reduction in Jenny's Blended Customer Acquisition Cost (CAC)?
                </Label>
                <RadioGroup value={mcAnswers.q3} onValueChange={(v) => handleMcSelect("q3", v)} className="space-y-2 pt-1 text-xs">
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="a" id="mc-3-a" className="mt-0.5" />
                    <Label htmlFor="mc-3-a" className="font-normal text-foreground leading-snug cursor-pointer font-medium">
                      A) Higher website conversion rate converted existing ad traffic into more paid orders without needing extra ad budget.
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="b" id="mc-3-b" className="mt-0.5" />
                    <Label htmlFor="mc-3-b" className="font-normal text-muted-foreground leading-snug cursor-pointer">
                      B) Meta and Google dropped their minimum ad spend requirements to $0.
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* PART 2: STRATEGIC REASONING CHECK */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">2</span>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Part 2: Strategic Reasoning (Audited by AI Authenticity Checker)</h3>
                  <p className="text-[11px] text-muted-foreground">Answer in 2-3 sentences of direct practitioner reasoning. Mention Jenny's coffee roastery context.</p>
                </div>
              </div>

              {/* Written Q1 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reasoning-1" className="text-xs font-medium">
                    Question 1: Explain the hypothesis behind your A/B test headline/offer. Why did you predict it would outperform Jenny's original "Coffee Beans For Sale"?
                  </Label>
                  <span className={`text-[10px] ${reasoningAnswers.q1.trim().split(/\s+/).filter(Boolean).length >= 15 ? 'text-emerald-500 font-semibold' : 'text-muted-foreground'}`}>
                    {reasoningAnswers.q1.trim().split(/\s+/).filter(Boolean).length} words (min 15)
                  </span>
                </div>
                <Textarea
                  id="reasoning-1"
                  placeholder="e.g., Jenny's original headline was too generic and didn't mention her fresh roast date or small-batch quality. By testing an offer highlighting fresh roast delivery and a 15% first-bag discount, we addressed buyer skepticism and gave an immediate incentive to purchase."
                  value={reasoningAnswers.q1}
                  onChange={(e) => handleReasoningChange("q1", e.target.value)}
                  rows={3}
                  className="text-xs"
                />
              </div>

              {/* Written Q2 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reasoning-2" className="text-xs font-medium">
                    Question 2: Jenny asks why she should keep spending money on Google Paid Search when her Organic SEO traffic is growing. How do you explain the synergy to her?
                  </Label>
                  <span className={`text-[10px] ${reasoningAnswers.q2.trim().split(/\s+/).filter(Boolean).length >= 15 ? 'text-emerald-500 font-semibold' : 'text-muted-foreground'}`}>
                    {reasoningAnswers.q2.trim().split(/\s+/).filter(Boolean).length} words (min 15)
                  </span>
                </div>
                <Textarea
                  id="reasoning-2"
                  placeholder="e.g., Paid search captures high-intent customers who are searching 'buy organic coffee online' right now, while SEO builds compounding long-term traffic. Furthermore, the strong SEO landing page gives us a 9/10 Quality Score, cutting our Google Ads cost-per-click nearly in half."
                  value={reasoningAnswers.q2}
                  onChange={(e) => handleReasoningChange("q2", e.target.value)}
                  rows={3}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="border-t border-border pt-3">
          {!auditResult ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] text-muted-foreground">
                All scenarios and minimum 15 words per reasoning required.
              </span>
              <Button
                onClick={handleSubmitAudit}
                disabled={!isFormComplete || isSubmitting}
                className="text-xs font-semibold gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Auditing Response...</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="h-3.5 w-3.5" />
                    <span>Submit for Agency Audit</span>
                  </>
                )}
              </Button>
            </div>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
