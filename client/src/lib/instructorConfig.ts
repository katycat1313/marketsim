export interface InstructorConfig {
  preferredInstructor: "atlas" | "sarah" | "auto";
  teachingStyle: "drill_sergeant" | "supportive" | "executive" | "witty";
  voiceEnabledByDefault: boolean;
  voiceModel: string;
  hasCustomBusiness: boolean;
  businessName: string;
  industry: string;
  location: string;
  websiteUrl: string;
  primaryOffer: string;
  targetAudience: string;
  uniqueAdvantage: string;
}

export const DEFAULT_INSTRUCTOR_CONFIG: InstructorConfig = {
  preferredInstructor: "auto",
  teachingStyle: "drill_sergeant",
  voiceEnabledByDefault: false,
  voiceModel: "aura-orion-en",
  hasCustomBusiness: false,
  businessName: "",
  industry: "",
  location: "",
  websiteUrl: "",
  primaryOffer: "",
  targetAudience: "",
  uniqueAdvantage: ""
};

const STORAGE_KEY = "krechet_instructor_config";

export function getInstructorConfig(): InstructorConfig {
  if (typeof window === "undefined") return DEFAULT_INSTRUCTOR_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INSTRUCTOR_CONFIG;
    return { ...DEFAULT_INSTRUCTOR_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_INSTRUCTOR_CONFIG;
  }
}

export function saveInstructorConfig(config: Partial<InstructorConfig>): InstructorConfig {
  if (typeof window === "undefined") return DEFAULT_INSTRUCTOR_CONFIG;
  try {
    const current = getInstructorConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch storage event so other components immediately update
    window.dispatchEvent(new CustomEvent("instructor-config-updated", { detail: updated }));
    return updated;
  } catch (err) {
    console.error("Failed to save instructor config:", err);
    return DEFAULT_INSTRUCTOR_CONFIG;
  }
}

/**
 * Returns active instructor details given a track (e.g. 'seo' vs 'ads') and user preferences
 */
export function getActiveInstructor(track: "seo" | "ads" | "general" = "general") {
  const config = getInstructorConfig();
  
  let useSarah = false;
  if (config.preferredInstructor === "sarah") {
    useSarah = true;
  } else if (config.preferredInstructor === "atlas") {
    useSarah = false;
  } else {
    // Auto mode: Sarah for SEO / CMS, Atlas for Ads / Search auctions
    useSarah = track === "seo";
  }

  if (useSarah) {
    return {
      id: "sarah",
      name: "Sarah Jenkins",
      role: "Content & SEO Technical Lead",
      voice: "aura-asteria-en",
      gender: "female",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
      teachingStyle: config.teachingStyle,
      config
    };
  }

  return {
    id: "atlas",
    name: "Director Atlas",
    role: "Lead Performance Flight Director",
    voice: "aura-orion-en",
    gender: "male",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    teachingStyle: config.teachingStyle,
    config
  };
}
