import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.warn(
    "[Warning] DATABASE_URL not set. Running with local development fallback database URL.",
  );
}

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/marketsim";
export const pool = new Pool({ connectionString });
export const db = drizzle({ client: pool, schema });
