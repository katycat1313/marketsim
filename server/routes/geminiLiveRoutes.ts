import type { Express, Request, Response } from "express";

export function registerGeminiLiveRoutes(app: Express) {
  // Check Gemini Live status & available instructor voices
  app.get("/api/gemini/status", (_req: Request, res: Response) => {
    const apiKey = process.env.GEMINI_LIVE_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    const hasKey = Boolean(apiKey && apiKey.trim().length > 10);

    res.json({
      enabled: hasKey,
      model: "gemini-3.8-live",
      endpoint: "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained",
      voices: [
        { id: "Aoede", name: "Sarah Jenkins (Warm & Articulate Mentor)", gender: "female" },
        { id: "Puck", name: "Marcus Vance (Energetic & Dynamic Coach)", gender: "male" },
        { id: "Charon", name: "Director Atlas (Executive & Authoritative)", gender: "male" },
        { id: "Kore", name: "Elena Rostova (Strategic & Methodical VP)", gender: "female" },
        { id: "Fenrir", name: "Action-Oriented Director", gender: "male" }
      ]
    });
  });

  // Mint a secure, short-lived Ephemeral Token for client-side WebSocket streaming
  app.post("/api/gemini/live-token", async (_req: Request, res: Response) => {
    try {
      const apiKey = process.env.GEMINI_LIVE_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey.trim().length < 10) {
        return res.status(503).json({ 
          error: "Google Gemini API key is not configured in server environment (.env)" 
        });
      }

      const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      const newSessionExpireTime = new Date(Date.now() + 2 * 60 * 1000).toISOString();

      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/auth_tokens", {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey.trim(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          uses: 1,
          expireTime: expireTime,
          newSessionExpireTime: newSessionExpireTime
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to generate Gemini ephemeral token:", response.status, errorText);
        return res.status(response.status).json({ 
          error: "Could not create ephemeral token from Gemini API", 
          details: errorText 
        });
      }

      const data = await response.json();
      const rawName = data.name || "";
      const token = rawName.startsWith("auth_tokens/") 
        ? rawName.replace("auth_tokens/", "") 
        : rawName;

      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      return res.json({
        token,
        model: "models/gemini-3.8-live",
        endpoint: "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained",
        expiresAt: expireTime
      });
    } catch (err: any) {
      console.error("Gemini Live Token Route Error:", err);
      return res.status(500).json({ 
        error: "Internal server error while minting Gemini Live token", 
        message: err.message 
      });
    }
  });
}
