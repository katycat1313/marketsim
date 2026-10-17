import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Strips markdown symbols, asterisks, hashtags, emojis, and LaTeX notation so 
 * text-to-speech (TTS) engines speak naturally without saying "star star", 
 * "bullet point", or reading raw code punctuation.
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

    // 3. Remove bold / italics asterisks and underscores (prevent "star star" in speech)
    .replace(/\*\*\*([^*]+)\*\*\*/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/___([^_]+)___/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")

    // 4. Remove code blocks and inline backticks
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")

    // 5. Remove markdown headers (# Header)
    .replace(/^#{1,6}\s+/gm, "")

    // 6. Remove bullet symbols, arrows, warning icons, and common emojis
    .replace(/[👉⚠️🛡️💼☕🚀🎯📊💡📈💰🔥✨]/gu, "")
    .replace(/^[\s]*[•\-\*]\s+/gm, "") // bullet points at start of lines

    // 7. Clean up quotes and brackets
    .replace(/[\[\]]/g, "")

    // 8. Normalize spacing and punctuation pauses
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,?!])/g, "$1")
    .replace(/\.\s*\./g, ".")
    .trim();
}
