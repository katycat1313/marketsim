import React, { useState } from 'react';
import { 
  Globe, 
  Lock, 
  RotateCw, 
  Smartphone, 
  Monitor, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SeoPageContent {
  title: string;
  metaDescription: string;
  headings: {
    tag: string;
    content: string;
  }[];
  body: string;
  images: {
    src: string;
    alt: string;
  }[];
  links: {
    href: string;
    text: string;
    isInternal: boolean;
  }[];
  schemaMarkup?: string;
}

interface WebsitePreviewProps {
  content: SeoPageContent;
  industry: string;
  difficulty: string;
}

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({ content, industry, difficulty }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'live' | 'serp'>('live');

  // Industry-specific theme styling & assets
  const getIndustryTheme = () => {
    switch (industry.toLowerCase()) {
      case 'e-commerce':
      case 'coffee':
        return {
          brandName: "Jenny's Artisan Java",
          tagline: "Small-Batch Organic Arabica Roastery",
          accentColor: "from-amber-600 to-amber-800",
          buttonBg: "bg-amber-600 hover:bg-amber-700 text-white",
          heroBg: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1200",
          items: [
            { name: "Ethiopian Yirgacheffe (Organic)", price: "$19.50", desc: "Notes of bergamot, lemon blossom, and wild honey.", img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400" },
            { name: "Colombian Supremo Dark Roast", price: "$18.00", desc: "Rich dark chocolate, roasted hazelnut, and caramel finish.", img: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&q=80&w=400" },
            { name: "Guatemalan Antigua Reserve", price: "$21.00", desc: "Full-bodied single origin with smoky spice and cocoa.", img: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400" }
          ],
          ctaText: "Order Fresh Beans",
          locationText: "Morgantown, WV"
        };
      case 'healthcare':
      case 'dental':
        return {
          brandName: "BrightSmile Family Dentistry",
          tagline: "Gentle, Modern Dental Care for All Ages",
          accentColor: "from-cyan-600 to-blue-700",
          buttonBg: "bg-blue-600 hover:bg-blue-700 text-white",
          heroBg: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200",
          items: [
            { name: "Preventative Cleanings & Exams", price: "Covered by Insurance", desc: "Gentle ultrasonic cleaning and comprehensive digital diagnostics.", img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400" },
            { name: "Invisalign & Clear Aligners", price: "From $99/mo", desc: "Straighten your smile discreetly with custom 3D aligners.", img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=400" },
            { name: "Emergency Dental Care", price: "Same-Day Visits", desc: "Fast pain relief for broken teeth, toothaches, and dental trauma.", img: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=400" }
          ],
          ctaText: "Book Appointment",
          locationText: "Morgantown, WV"
        };
      case 'real estate':
      case 'luxury':
        return {
          brandName: "Premier Luxury Properties",
          tagline: "Exclusive Waterfront & Mountain Estates",
          accentColor: "from-slate-900 via-indigo-950 to-slate-900",
          buttonBg: "bg-amber-500 hover:bg-amber-600 text-black font-bold",
          heroBg: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
          items: [
            { name: "The Overlook at Cheat Lake", price: "$1,850,000", desc: "5 Bed, 6 Bath • 6,400 Sq Ft with private boat dock.", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400" },
            { name: "Mountain View Modern Villa", price: "$2,200,000", desc: "Floor-to-ceiling glass, infinity pool, 12-acre private lot.", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=400" },
            { name: "Historic Downtown Penthouse", price: "$975,000", desc: "Exposed brick, private rooftop terrace, concierge services.", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400" }
          ],
          ctaText: "Schedule VIP Tour",
          locationText: "Cheat Lake / Morgantown, WV"
        };
      case 'saas':
      case 'b2b':
      case 'security':
      case 'software':
        return {
          brandName: "CloudVault Enterprise Security",
          tagline: "Zero-Trust Data Protection & Compliance Platform",
          accentColor: "from-indigo-900 via-slate-900 to-purple-950",
          buttonBg: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold",
          heroBg: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
          items: [
            { name: "Zero-Trust Identity Shield", price: "Enterprise Tier", desc: "Automated biometric authentication, role-based access, and real-time anomaly detection.", img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400" },
            { name: "SOC-2 Compliance Automation", price: "$499/mo", desc: "Continuous audit readiness and automated evidence collection across 40+ cloud tools.", img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400" },
            { name: "Cloud API Threat Interceptor", price: "Custom Volume", desc: "Sub-millisecond WAF packet inspection with AI DDoS mitigation.", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400" }
          ],
          ctaText: "Book Live Demo (15m)",
          locationText: "San Francisco, CA & Global Cloud"
        };
      case 'enterprise':
      case 'capstone':
      case 'omnichannel':
        return {
          brandName: "Apex Global Fitness & Performance",
          tagline: "Smart Connected Equipment & Precision Nutrition",
          accentColor: "from-red-950 via-zinc-950 to-slate-950",
          buttonBg: "bg-red-600 hover:bg-red-700 text-white font-bold",
          heroBg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200",
          items: [
            { name: "Apex Pro Sensor Rowing Machine", price: "$1,499", desc: "Interactive 24-inch 4K touchscreen with real-time biometric drag coaching.", img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400" },
            { name: "Metabolic Precision GPS Tracker", price: "$299", desc: "Continuous glucose, lactate, and VO2-max telemetry wrist module.", img: "https://images.unsplash.com/photo-1510519138197-06b8f2a08407?auto=format&fit=crop&q=80&w=400" },
            { name: "Apex Elite VIP Coaching Tier", price: "$89/mo", desc: "Weekly video audits with Olympian trainers and registered sports dietitians.", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400" }
          ],
          ctaText: "Claim $200 Launch Bundle",
          locationText: "Global Direct-to-Consumer"
        };
      default:
        return {
          brandName: "Artisan Growth Co.",
          tagline: "Premium Craft & Local Services",
          accentColor: "from-emerald-700 to-teal-900",
          buttonBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
          heroBg: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
          items: [
            { name: "Core Premium Service", price: "$150", desc: "Full comprehensive service with lifetime guarantee.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400" }
          ],
          ctaText: "Get Started",
          locationText: "Morgantown, WV"
        };
    }
  };

  const theme = getIndustryTheme();
  const h1Heading = content.headings?.find(h => h.tag.toLowerCase() === 'h1')?.content || content.title;
  const otherHeadings = content.headings?.filter(h => h.tag.toLowerCase() !== 'h1') || [];

  return (
    <div className="space-y-4">
      {/* Top Browser Toolbar & Viewport Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-secondary/80 backdrop-blur-md p-3 rounded-xl border border-border/80 text-xs">
        {/* Browser URL bar */}
        <div className="flex items-center gap-2 bg-background/90 px-3 py-1.5 rounded-lg border border-border flex-1 max-w-md">
          <Lock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="font-mono text-muted-foreground truncate text-[11px]">
            https://www.{theme.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
          </span>
          <RotateCw className="h-3 w-3 text-muted-foreground ml-auto hover:text-foreground cursor-pointer" />
        </div>

        {/* Viewport & Tab Toggles */}
        <div className="flex items-center gap-2">
          <div className="bg-background rounded-lg p-0.5 border border-border flex">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                activeTab === 'live' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🖥️ Live Website View
            </button>
            <button
              onClick={() => setActiveTab('serp')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                activeTab === 'serp' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🔍 Google SERP Preview
            </button>
          </div>

          <div className="bg-background rounded-lg p-0.5 border border-border flex">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded transition ${viewMode === 'desktop' ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}
              title="Desktop View"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded transition ${viewMode === 'mobile' ? 'bg-secondary text-foreground' : 'text-muted-foreground'}`}
              title="Mobile Smartphone View"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Website Frame */}
      {activeTab === 'serp' ? (
        /* Google SERP Snippet Preview */
        <div className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>Google Search Live Snippet Inspection</span>
            <Badge variant="outline" className="text-[10px]">Desktop & Mobile Preview</Badge>
          </div>

          <div className="p-5 rounded-xl bg-background border border-border/80 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <div className="h-4 w-4 rounded-full bg-secondary flex items-center justify-center font-bold text-[9px]">G</div>
              <span>https://www.{theme.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</span>
            </div>

            <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
              {content.title || `${theme.brandName} | Official Website`}
            </h3>

            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {content.metaDescription || "Order fresh artisan roasted coffee beans online or visit our Morgantown cafe today. Free local pickup available."}
            </p>

            <div className="flex items-center gap-4 pt-1 text-[11px] text-emerald-500 font-medium">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current text-amber-400" /> 4.9 (128 reviews)
              </span>
              <span>• Free Pickup Available</span>
              <span>• Morgantown, WV</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-secondary/40 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Title Length: <strong className={content.title.length > 60 ? "text-rose-400" : "text-emerald-400"}>{content.title.length}/60 chars</strong></span>
            <span>Meta Length: <strong className={content.metaDescription.length > 160 ? "text-rose-400" : "text-emerald-400"}>{content.metaDescription.length}/160 chars</strong></span>
          </div>
        </div>
      ) : (
        /* Live High-Fidelity Website Mockup */
        <div className={`mx-auto transition-all duration-300 ${
          viewMode === 'mobile' ? 'max-w-sm rounded-[36px] border-8 border-slate-800 shadow-2xl p-0 overflow-hidden' : 'w-full rounded-2xl border border-border shadow-2xl overflow-hidden'
        }`}>
          <div className="bg-background text-foreground min-h-[600px] flex flex-col font-sans">
            
            {/* Top Announcement Bar */}
            <div className="bg-gradient-to-r from-amber-600 via-primary to-emerald-600 text-black font-extrabold text-[10px] py-1 px-4 text-center tracking-wide flex items-center justify-center gap-2">
              <Sparkles className="h-3 w-3 fill-current" />
              <span>Free Local Pickup in Morgantown & Free Shipping on Orders Over $35!</span>
            </div>

            {/* Main Header / Nav */}
            <header className="bg-card/90 backdrop-blur-md border-b border-border/60 px-5 py-3.5 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-sm shadow">
                  ☕
                </div>
                <div>
                  <span className="font-extrabold text-sm tracking-tight text-foreground">{theme.brandName}</span>
                  <span className="hidden sm:block text-[9px] text-muted-foreground">{theme.locationText}</span>
                </div>
              </div>

              {viewMode === 'desktop' && (
                <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-muted-foreground">
                  <span className="text-foreground hover:text-primary cursor-pointer">Menu & Beans</span>
                  <span className="hover:text-foreground cursor-pointer">Our Roastery</span>
                  <span className="hover:text-foreground cursor-pointer">Wholesale & Catering</span>
                  <span className="hover:text-foreground cursor-pointer">Visit Us</span>
                </nav>
              )}

              <Button size="sm" className={`text-xs font-bold shadow-md ${theme.buttonBg}`}>
                <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                {theme.ctaText}
              </Button>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-12 md:py-16 px-6 bg-gradient-to-br from-card via-background to-secondary/30 border-b border-border/60">
              <div className="max-w-3xl space-y-4 relative z-10">
                <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/30 text-[11px] font-semibold">
                  ⭐ 100% Organic Arabica • Small Batch Roasted
                </Badge>

                {/* The Live H1 Headline */}
                <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                  {h1Heading}
                </h1>

                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {content.body ? content.body.slice(0, 180) : "We hand-roast small-batch organic Arabica beans every single morning in Morgantown, delivering unparalleled richness, crema, and flavor directly to your cup."}...
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button size="lg" className={`text-xs font-bold ${theme.buttonBg} shadow-lg`}>
                    {theme.ctaText}
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                  <Button variant="outline" size="lg" className="text-xs font-semibold border-border">
                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-rose-400" />
                    Get Directions (Morgantown)
                  </Button>
                </div>

                {/* Social Proof Badges */}
                <div className="flex items-center gap-6 pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-current text-amber-400" />
                    <span className="font-bold text-foreground">4.9/5</span> (128+ Reviews)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>USDA Certified Organic</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Product / Services Grid */}
            <section className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    {otherHeadings[0]?.content || "Featured Fresh Roasts & Offerings"}
                  </h2>
                  <p className="text-xs text-muted-foreground">Roasted to order in Morgantown • Shipped within 24 hours</p>
                </div>
                <Badge variant="outline" className="text-xs">3 Single Origins</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {theme.items.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-border bg-card overflow-hidden shadow hover:border-primary/50 transition group">
                    <div className="h-36 overflow-hidden relative">
                      <img 
                        src={item.img} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                      />
                      <span className="absolute top-2 right-2 bg-black/70 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {item.price}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-xs text-foreground">{item.name}</h3>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                      <Button size="sm" variant="outline" className="w-full text-xs h-7 mt-2 border-border hover:bg-primary/10">
                        Add to Order
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer / Location Info */}
            <footer className="mt-auto bg-card border-t border-border p-6 text-xs text-muted-foreground space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="font-bold text-foreground block mb-1">{theme.brandName}</span>
                  <p className="text-[11px]">Handcrafted small-batch coffee in the heart of Morgantown, WV.</p>
                </div>
                <div className="space-y-1 text-[11px]">
                  <span className="font-bold text-foreground block mb-1">Hours & Location</span>
                  <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-rose-400" /> 142 High Street, Morgantown, WV 26505</p>
                  <p className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-amber-400" /> Mon-Sat: 7:00 AM - 6:00 PM</p>
                </div>
                <div className="space-y-1 text-[11px]">
                  <span className="font-bold text-foreground block mb-1">Contact & Inquiries</span>
                  <p className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-emerald-400" /> (304) 555-JAVA</p>
                  <p className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-cyan-400" /> hello@jennysartisanjava.com</p>
                </div>
              </div>
              <div className="border-t border-border/50 pt-3 text-center text-[10px]">
                © {new Date().getFullYear()} {theme.brandName}. All rights reserved. Designed for Krechet Academy Simulator.
              </div>
            </footer>

          </div>
        </div>
      )}
    </div>
  );
};

export default WebsitePreview;