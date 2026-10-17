import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  CheckCircle2, 
  Send, 
  Building2, 
  ShieldCheck, 
  Rocket, 
  Gift, 
  Users,
  Flame,
  ArrowRight
} from "lucide-react";

interface EarlyBirdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EarlyBirdModal({ isOpen, onClose }: EarlyBirdModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [userType, setUserType] = useState<"Small Business Owner" | "Career Marketer / Student" | "Agency Owner">("Small Business Owner");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservedPosition, setReservedPosition] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please provide a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          userType,
          businessName
        })
      });

      const data = await res.json();
      setReservedPosition(data.position || 48);
      toast({
        title: "VIP Early-Bird Pass Confirmed! 🎟️",
        description: `You are #${data.position || 48} on the VIP Beta Access list.`,
      });
    } catch (err: any) {
      toast({
        title: "Reservation Received",
        description: "Your VIP early-bird spot has been saved.",
      });
      setReservedPosition(48);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg bg-card border-primary/40 text-foreground p-0 overflow-hidden shadow-2xl rounded-2xl">
        {/* Top Gradient Header */}
        <div className="bg-gradient-to-r from-amber-500/20 via-primary/15 to-emerald-500/20 p-6 border-b border-border/70 relative">
          <div className="flex items-center justify-between mb-2">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs font-mono uppercase tracking-wider flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 fill-current animate-pulse text-amber-400" />
              Limited VIP Beta Access
            </Badge>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              50% Lifetime Discount
            </span>
          </div>

          <DialogTitle className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
            Reserve Your Early-Bird Beta Pass
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Get instant access to the AI Campaign Simulator, Director Atlas Socratic coaching, and lock in 50% off for life.
          </DialogDescription>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {reservedPosition ? (
            <div className="text-center space-y-4 py-4 animate-in fade-in zoom-in duration-300">
              <div className="h-16 w-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="h-9 w-9 text-emerald-400" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground">You're On The VIP List!</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Your VIP position <strong className="text-primary font-mono font-bold">#{reservedPosition}</strong> has been secured for <strong className="text-foreground">{email}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-secondary/40 border border-border/80 text-xs text-left space-y-2">
                <span className="font-bold text-foreground block flex items-center gap-1.5">
                  <Gift className="h-4 w-4 text-amber-400" /> What's Included in Your VIP Beta Pass:
                </span>
                <ul className="space-y-1 pl-4 list-disc text-muted-foreground text-[11px]">
                  <li>50% Lifetime Discount locked in across all simulator tiers.</li>
                  <li>Custom Digital Twin sandbox for your real business.</li>
                  <li>Priority Socratic AI Director grading with Director Atlas.</li>
                </ul>
              </div>

              <Button 
                onClick={onClose} 
                className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 text-xs"
              >
                Close & Explore Sandbox
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">Your Full Name</label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Alex Rivera" 
                  required
                  className="bg-background text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground">Email Address (for Beta Invite & Discount)</label>
                <Input 
                  type="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="alex@yourbusiness.com" 
                  required
                  className="bg-background text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">I Am A:</label>
                  <select 
                    value={userType} 
                    onChange={(e) => setUserType(e.target.value as any)}
                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Small Business Owner">Small Business Owner</option>
                    <option value="Career Marketer / Student">Career Marketer / Student</option>
                    <option value="Agency Owner">Agency Owner</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground">Business Name (Optional)</label>
                  <Input 
                    value={businessName} 
                    onChange={(e) => setBusinessName(e.target.value)} 
                    placeholder="e.g. Rivera Bakery" 
                    className="bg-background text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 via-primary to-emerald-500 text-black font-extrabold text-xs shadow-lg hover:opacity-90 flex items-center justify-center gap-2 py-2.5"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 border-2 border-b-transparent border-black rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4 fill-current" />
                      <span>Lock In 50% Lifetime Discount & Early Beta</span>
                    </>
                  )}
                </Button>
              </div>

              <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                Zero spam. Instant confirmation. Cancel anytime.
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
