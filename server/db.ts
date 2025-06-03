import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon database connection
neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = false;

// Get database URL from environment or use Replit's PostgreSQL URL
const DATABASE_URL = process.env.DATABASE_URL || `postgresql://postgres:postgres@localhost:5432/postgres`;

export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  ssl: false
});
export const db = drizzle({ client: pool, schema });