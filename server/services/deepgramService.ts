// Deepgram High-Performance Voice Service using Deepgram API v1
const apiKey = process.env.DEEPGRAM_API_KEY || process.env.VITE_DEEPGRAM_API_KEY || "";

export class DeepgramVoiceService {
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = Boolean(apiKey && apiKey !== "apiKEY");
    if (this.isAvailable) {
      console.log("Deepgram Voice Service initialized with API Key.");
    } else {
      console.log("Deepgram API Key not configured or placeholder detected. Ready for key configuration.");
    }
  }

  /**
   * Check if Deepgram is configured
   */
  public hasDeepgram(): boolean {
    const key = process.env.DEEPGRAM_API_KEY || process.env.VITE_DEEPGRAM_API_KEY || "";
    return Boolean(key && key !== "apiKEY");
  }

  /**
   * Convert Text to Lifelike Speech using Deepgram Aura (TTS)
   * Voice models: 'aura-asteria-en' (female/Sarah), 'aura-orion-en' (male/Atlas), 'aura-arcas-en', 'aura-luna-en'
   */
  public async generateSpeech(text: string, voice: string = "aura-orion-en"): Promise<Buffer | null> {
    const key = process.env.DEEPGRAM_API_KEY || process.env.VITE_DEEPGRAM_API_KEY || "";
    if (!key || key === "apiKEY") {
      console.warn("Cannot generate Deepgram speech: missing or placeholder API key");
      return null;
    }

    try {
      const url = `https://api.deepgram.com/v1/speak?model=${encodeURIComponent(voice)}&encoding=mp3`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Token ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`Deepgram TTS HTTP Error (${response.status}):`, errText);
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error("Deepgram TTS Generation Error:", error);
      return null;
    }
  }

  /**
   * Transcribe Audio Buffer using Deepgram Nova-2 (STT)
   */
  public async transcribeAudio(audioBuffer: Buffer, mimetype: string = "audio/webm"): Promise<string | null> {
    const key = process.env.DEEPGRAM_API_KEY || process.env.VITE_DEEPGRAM_API_KEY || "";
    if (!key || key === "apiKEY") {
      console.warn("Cannot transcribe with Deepgram: missing or placeholder API key");
      return null;
    }

    try {
      const url = "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true";
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Token ${key}`,
          "Content-Type": mimetype
        },
        body: audioBuffer
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`Deepgram STT HTTP Error (${response.status}):`, errText);
        return null;
      }

      const data = await response.json();
      const transcript = data.results?.channels?.[0]?.alternatives?.[0]?.transcript;
      return transcript || "";
    } catch (error) {
      console.error("Deepgram STT Error:", error);
      return null;
    }
  }

  /**
   * Get Voice Agent Configuration with Director Atlas system instructions
   */
  public getVoiceAgentConfig(missionContext?: string) {
    return {
      agentId: process.env.DEEPGRAM_AGENT_ID || "krechet-director-atlas",
      projectId: process.env.DEEPGRAM_PROJECT_ID || "1add87dc-1582-4d89-9a7d-d2cee44bf542",
      name: "Director Atlas",
      voice: "aura-orion-en",
      model: "nova-2",
      prompt: `You are Director Atlas, the Lead Flight Instructor and Marketing Director at Krechet Academy (AI Marketing Flight Simulator).
You are conducting a live conversational training debrief with a Marketing Cadet.
Your tone is professional, encouraging, sharp, and grounded in real-world performance marketing (CAC, ROAS, Quality Score, Heading hierarchy, and Negative keywords).
Keep your spoken responses concise (1-3 sentences per turn) so the student has room to respond naturally.
${missionContext ? `Current Mission Context: ${missionContext}` : ""}`
    };
  }
}

export const deepgramService = new DeepgramVoiceService();
