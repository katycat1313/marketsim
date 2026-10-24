import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Strips markdown symbols, asterisks, hashtags, emojis, and LaTeX notation so 
 * text-to-speech (TTS) engines speak naturally without saying "star star", 
 * "bullet point", or reading raw code punctuation.
 * Also expands acronyms and injects sentence pauses so the AI voice does not rush or skip words.
 */
export function cleanTextForSpeech(rawText: string): string {
  if (!rawText) return "";

  return rawText
    // 1. Convert specific math / auction formulas into natural spoken words
    .replace(/\$\$CPC\s*=\s*\\frac\{[^}]+\}\{[^}]+\}\s*\+\s*\\?\$?0?\.01\$\$/gi, "Cost Per Click equals Competitor Ad Rank divided by your Quality Score, plus one cent.")
    .replace(/\$LTV\s*\/\s*CAC\s*>\s*3\.0\$/gi, "Lifetime Value to Customer Acquisition Cost ratio greater than three point zero")
    .replace(/\$\$([^\$]+)\$\$/g, "$1") // general block math
    .replace(/\$([^\$]+)\$/g, "$1") // general inline math
    
    // 2. Remove markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")

    // 3. Ensure headings end with a period and space so voice pauses naturally
    .replace(/^#{1,6}\s*(.*?)$/gm, "$1. ")

    // 4. Ensure bullet points end with a period and space
    .replace(/^[\s]*[•\-\*]\s*(.*?)$/gm, "$1. ")
    .replace(/^(\d+)\.\s*(.*?)$/gm, "$1. ")

    // 5. Expand marketing acronyms into full natural words for articulate enunciation
    .replace(/\bAOV\b/g, "Average Order Value")
    .replace(/\bCAC\b/g, "Customer Acquisition Cost")
    .replace(/\bROAS\b/g, "Return on Ad Spend")
    .replace(/\bCVR\b/g, "Conversion Rate")
    .replace(/\bCTR\b/g, "Click Through Rate")
    .replace(/\bCPC\b/g, "Cost Per Click")
    .replace(/\bCPA\b/g, "Cost Per Acquisition")
    .replace(/\bLTV\b/g, "Lifetime Value")
    .replace(/\bCRO\b/g, "Conversion Rate Optimization")
    .replace(/\bICP\b/g, "Ideal Customer Profile")
    .replace(/\bGA4\b/g, "Google Analytics 4")
    .replace(/\bPPC\b/g, "Pay Per Click")
    .replace(/\bSEO\b/g, "S.E.O.")
    .replace(/\be\.g\.,?\s*/gi, "for example, ")
    .replace(/\bi\.e\.,?\s*/gi, "that is, ")
    .replace(/\bvs\.?\s*/gi, "versus ")

    // 6. Remove bold / italics asterisks and underscores (prevent "star star" in speech)
    .replace(/\*\*\*([^*]+)\*\*\*/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/___([^_]+)___/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")

    // 7. Remove code blocks and inline backticks
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")

    // 8. Clean up symbols, arrows, warning icons, and common emojis
    .replace(/[👉⚠️🛡️💼☕🚀🎯📊💡📈💰🔥✨🛠️📝🏆🔬🏢👥🎙️]/gu, "")
    .replace(/[\[\]]/g, "")

    // 9. Normalize spacing and punctuation pauses
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, ". ")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,?!])/g, "$1")
    .replace(/\.{2,}/g, ".")
    .replace(/\.\s*\./g, ". ")
    .trim();
}
