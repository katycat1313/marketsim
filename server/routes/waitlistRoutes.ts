import { Express, Request, Response } from "express";

export interface WaitlistLead {
  id: string;
  name: string;
  email: string;
  userType: "Small Business Owner" | "Career Marketer / Student" | "Agency Owner" | "Other";
  businessName?: string;
  createdAt: string;
}

const inMemoryWaitlist: WaitlistLead[] = [
  {
    id: "lead-1",
    name: "Alex Rivera",
    email: "alex@example.com",
    userType: "Small Business Owner",
    businessName: "Rivera Artisan Bakery",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const registerWaitlistRoutes = (app: Express) => {
  // Submit new early-bird pre-order / waitlist lead
  app.post("/api/waitlist", (req: Request, res: Response) => {
    try {
      const { name, email, userType, businessName } = req.body;

      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Please provide a valid email address." });
      }

      const existing = inMemoryWaitlist.find(l => l.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.json({
          success: true,
          position: inMemoryWaitlist.indexOf(existing) + 42,
          message: "You are already registered on the VIP list!"
        });
      }

      const newLead: WaitlistLead = {
        id: `lead-${Date.now()}`,
        name: name || "Growth Cadet",
        email: email.trim().toLowerCase(),
        userType: userType || "Small Business Owner",
        businessName: businessName || "",
        createdAt: new Date().toISOString()
      };

      inMemoryWaitlist.push(newLead);
      const position = inMemoryWaitlist.length + 42; // Fun social proof offset

      res.json({
        success: true,
        position,
        message: `Welcome aboard! You are #${position} on the VIP Beta Access list.`
      });
    } catch (err: any) {
      console.error("Error saving waitlist lead:", err);
      res.status(500).json({ error: "Failed to reserve spot." });
    }
  });

  // Get total count of waitlist subscribers
  app.get("/api/waitlist/stats", (_req: Request, res: Response) => {
    res.json({
      totalVIPs: inMemoryWaitlist.length + 42,
      recentSignups: inMemoryWaitlist.slice(-5)
    });
  });
};
