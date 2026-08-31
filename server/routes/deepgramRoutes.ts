import type { Express, Request, Response } from "express";
import { deepgramService } from "../services/deepgramService";

export function registerDeepgramRoutes(app: Express) {
  // Check Deepgram availability status
  app.get("/api/deepgram/status", (req: Request, res: Response) => {
    const isConfigured = deepgramService.hasDeepgram();
    res.json({
      enabled: isConfigured,
      voices: [
        { id: "aura-orion-en", name: "Director Atlas (Executive Authority)", gender: "male" },
        { id: "aura-asteria-en", name: "Sarah Jenkins (Performance Lead)", gender: "female" },
        { id: "aura-arcas-en", name: "Marcus Vance (Creative Lead)", gender: "male" },
        { id: "aura-luna-en", name: "Elena Rostova (VP Marketing)", gender: "female" }
      ],
      model: "nova-2"
    });
  });

  // Text-To-Speech (Aura)
  app.post("/api/deepgram/speak", async (req: Request, res: Response) => {
    try {
      const { text, voice = "aura-orion-en" } = req.body;

      if (!text || typeof text !== "string") {
        return res.status(400).json({ error: "Text is required for speech synthesis" });
      }

      if (!deepgramService.hasDeepgram()) {
        return res.status(503).json({ error: "Deepgram API key not configured" });
      }

      const audioBuffer = await deepgramService.generateSpeech(text, voice);
      if (!audioBuffer) {
        return res.status(500).json({ error: "Failed to generate audio stream from Deepgram" });
      }

      res.setHeader("Content-Type", "audio/mp3");
      res.setHeader("Content-Length", audioBuffer.length);
      res.send(audioBuffer);
    } catch (error) {
      console.error("Deepgram speak route error:", error);
      res.status(500).json({ error: "Internal server error during speech generation" });
    }
  });

  // Voice Agent Configuration
  app.get("/api/deepgram/agent-config", (req: Request, res: Response) => {
    const context = (req.query.context as string) || "";
    const config = deepgramService.getVoiceAgentConfig(context);
    res.json(config);
  });

  console.log("Deepgram Voice Agent & Aura TTS routes registered");
}
