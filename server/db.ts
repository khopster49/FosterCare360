import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Get database URL from environment or use Replit's PostgreSQL URL
const DATABASE_URL = process.env.DATABASE_URL || `postgresql://${process.env.REPL_OWNER}:${process.env.REPL_OWNER}@${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co:5432/${process.env.REPL_SLUG}`;

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });