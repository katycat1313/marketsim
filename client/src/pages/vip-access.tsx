import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, CheckCircle2, Lock, ArrowRight, Loader2, KeyRound } from "lucide-react";
import Logo from "@/components/Logo";

export default function VipAccessPage() {
  const [, navigate] = useLocation();
  const { setUser } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [vipData, setVipData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Custom password setup state
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    // Read ?pass= or ?token= or ?code= from URL
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("pass") || searchParams.get("token") || searchParams.get("code");

    if (!token) {
      setError("No VIP Pass token provided in URL. Please check your invitation link.");
      setLoading(false);
      return;
    }

    const authenticateVip = async () => {
      try {
        const res = await fetch(`/api/auth/vip/${encodeURIComponent(token)}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Invalid or expired VIP invitation pass.");
        }

        const data = await res.json();
        setVipData(data);

        // Instant 1-Click Login into AuthContext & LocalStorage
        if (setUser && data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        toast({
          title: `Welcome, ${data.name}!`,
          description: "Your VIP Reviewer Pass is active. All simulations, casework, and AI interview tools are unlocked.",
        });

        // Delay redirect slightly so user sees the welcome state, or let them set a password
        setTimeout(() => {
          setLoading(false);
        }, 1200);
      } catch (err: any) {
        setError(err.message || "Failed to activate VIP Pass.");
        setLoading(false);
      }
    };

    authenticateVip();
  }, [setUser, toast]);

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Please enter at least 6 characters.",
        variant: "destructive"
      });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/vip-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: vipData.user.email,
          newPassword
        })
      });

      if (!res.ok) throw new Error("Failed to save password.");
      
      setPasswordSaved(true);
      toast({
        title: "Permanent Password Saved!",
        description: "You can now log in anytime using this email and password.",
      });
    } catch (err: any) {
      toast({
        title: "Error saving password",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleEnterPlatform = () => {
    const dest = vipData?.targetLanding || "/dashboard";
    navigate(dest);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {loading ? (
          <Card className="border-amber-500/20 bg-slate-900/90 backdrop-blur text-center p-8">
            <CardContent className="pt-6 space-y-4">
              <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
              <h2 className="text-xl font-bold text-white">Activating VIP Reviewer Pass...</h2>
              <p className="text-sm text-slate-400">Authenticating access and unlocking client casework & AI tools.</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-red-500/30 bg-slate-900 text-center p-6">
            <CardHeader>
              <CardTitle className="text-red-400">VIP Pass Error</CardTitle>
              <CardDescription className="text-slate-400">{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/login")} variant="outline" className="w-full">
                Go to Standard Login
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-amber-500/30 bg-slate-900/95 shadow-2xl shadow-amber-500/10">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Welcome, {vipData?.name}!
              </CardTitle>
              <CardDescription className="text-amber-400/90 font-medium">
                VIP Reviewer Pass Activated • Full Access Unlocked
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <div className="bg-slate-950/60 rounded-lg p-3 border border-slate-800 text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Reviewer:</span>
                  <span className="font-semibold text-white">{vipData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Access Tier:</span>
                  <span className="font-semibold text-emerald-400">All-Access Premium Pass</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Casework:</span>
                  <span className="font-semibold text-amber-300">{vipData?.targetLanding}</span>
                </div>
              </div>

              {!showPasswordSetup ? (
                <div className="space-y-3 pt-2">
                  <Button 
                    onClick={handleEnterPlatform} 
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold h-11"
                  >
                    Enter Platform Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setShowPasswordSetup(true)}
                    className="w-full text-xs text-slate-400 hover:text-white"
                  >
                    <KeyRound className="w-3.5 h-3.5 mr-1.5" />
                    Want to set your own password? Click here
                  </Button>
                </div>
              ) : passwordSaved ? (
                <div className="space-y-3 pt-2 text-center">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Permanent Password Saved
                  </div>
                  <Button 
                    onClick={handleEnterPlatform} 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold h-11"
                  >
                    Continue to Casework <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSavePassword} className="space-y-3 pt-2">
                  <div className="space-y-1 text-left">
                    <label className="text-xs text-slate-300 font-medium">Create Permanent Password:</label>
                    <Input
                      type="password"
                      placeholder="Enter at least 6 characters..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-slate-950 border-slate-700 text-white text-sm"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={savingPassword}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm"
                  >
                    {savingPassword ? "Saving..." : "Save Password & Enter"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleEnterPlatform}
                    className="w-full text-xs text-slate-400"
                  >
                    Skip for now & enter directly &rarr;
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
