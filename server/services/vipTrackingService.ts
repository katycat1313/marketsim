import fs from "fs";
import path from "path";
import { VIP_CREATORS, VipCreator } from "./vipCreators";

export interface VipClickRecord {
  token: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  specialty: string;
  targetLanding: string;
  clicks: number;
  firstClickedAt?: string;
  lastClickedAt?: string;
  lastIp?: string;
  lastUserAgent?: string;
  hasSetPassword: boolean;
  history: Array<{
    timestamp: string;
    ip?: string;
    userAgent?: string;
  }>;
}

const STORAGE_FILE = path.join(process.cwd(), "server", "data", "vip_clicks.json");

class VipTrackingService {
  private records: Map<string, VipClickRecord> = new Map();

  constructor() {
    this.initialize();
  }

  private initialize() {
    // 1. Seed all 25 VIP creators from catalog
    for (const creator of VIP_CREATORS) {
      this.records.set(creator.token.toLowerCase(), {
        token: creator.token,
        name: creator.name,
        firstName: creator.firstName,
        lastName: creator.lastName,
        email: creator.email,
        organization: creator.organization,
        specialty: creator.specialty,
        targetLanding: creator.targetLanding,
        clicks: 0,
        hasSetPassword: false,
        history: []
      });
    }

    // 2. Load persistent file if it exists
    try {
      if (fs.existsSync(STORAGE_FILE)) {
        const raw = fs.readFileSync(STORAGE_FILE, "utf8");
        const parsed: Record<string, Partial<VipClickRecord>> = JSON.parse(raw);
        for (const [token, data] of Object.entries(parsed)) {
          const existing = this.records.get(token.toLowerCase());
          if (existing) {
            existing.clicks = data.clicks || existing.clicks;
            existing.firstClickedAt = data.firstClickedAt || existing.firstClickedAt;
            existing.lastClickedAt = data.lastClickedAt || existing.lastClickedAt;
            existing.lastIp = data.lastIp || existing.lastIp;
            existing.lastUserAgent = data.lastUserAgent || existing.lastUserAgent;
            existing.hasSetPassword = data.hasSetPassword ?? existing.hasSetPassword;
            existing.history = Array.isArray(data.history) ? data.history : existing.history;
          }
        }
      }
    } catch (err) {
      console.warn("Could not load vip_clicks.json, using clean tracking state:", err);
    }
  }

  private persist() {
    try {
      const dir = path.dirname(STORAGE_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const data: Record<string, VipClickRecord> = {};
      for (const [token, record] of this.records.entries()) {
        data[token] = record;
      }
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
      console.warn("Could not save vip_clicks.json to disk:", err);
    }
  }

  public recordClick(token: string, ip?: string, userAgent?: string): VipClickRecord | null {
    const key = token.toLowerCase().trim();
    let record = this.records.get(key);

    // If not found by direct token, check by email
    if (!record) {
      for (const r of this.records.values()) {
        if (r.email.toLowerCase() === key) {
          record = r;
          break;
        }
      }
    }

    if (!record) return null;

    const now = new Date().toISOString();
    record.clicks += 1;
    if (!record.firstClickedAt) {
      record.firstClickedAt = now;
    }
    record.lastClickedAt = now;
    record.lastIp = ip || "unknown";
    record.lastUserAgent = userAgent || "unknown";
    record.history.unshift({
      timestamp: now,
      ip,
      userAgent
    });

    // Keep history capped at 50 per creator
    if (record.history.length > 50) {
      record.history = record.history.slice(0, 50);
    }

    this.persist();
    return record;
  }

  public recordPasswordSet(email: string): boolean {
    const key = email.toLowerCase().trim();
    for (const r of this.records.values()) {
      if (r.email.toLowerCase() === key) {
        r.hasSetPassword = true;
        this.persist();
        return true;
      }
    }
    return false;
  }

  public getSummary() {
    const list = Array.from(this.records.values());
    const totalCreators = list.length;
    const clickedCreators = list.filter(r => r.clicks > 0);
    const openedCount = clickedCreators.length;
    const unopenedCount = totalCreators - openedCount;
    const totalClicks = list.reduce((acc, r) => acc + r.clicks, 0);
    const passwordSetCount = list.filter(r => r.hasSetPassword).length;
    const openRatePercent = totalCreators > 0 ? parseFloat(((openedCount / totalCreators) * 100).toFixed(1)) : 0;

    // Sort: Clicked first (most recent first), then unopened alphabetically
    const sorted = [...list].sort((a, b) => {
      if (a.clicks > 0 && b.clicks === 0) return -1;
      if (a.clicks === 0 && b.clicks > 0) return 1;
      if (a.clicks > 0 && b.clicks > 0) {
        const timeA = a.lastClickedAt ? new Date(a.lastClickedAt).getTime() : 0;
        const timeB = b.lastClickedAt ? new Date(b.lastClickedAt).getTime() : 0;
        return timeB - timeA;
      }
      return a.name.localeCompare(b.name);
    });

    return {
      totalCreators,
      openedCount,
      unopenedCount,
      totalClicks,
      passwordSetCount,
      openRatePercent,
      creators: sorted
    };
  }
}

export const vipTrackingService = new VipTrackingService();
