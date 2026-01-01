import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import "dotenv/config";

// Initialize database connection with Neon
// During build, DATABASE_URL may not be set, so we handle it gracefully
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // Return a dummy URL during build - actual runtime will have the real URL
    // This allows the build to complete without a real database connection
    if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
      // Only in local production build, use dummy URL
      return "postgresql://dummy:dummy@localhost:5432/dummy";
    }
    throw new Error("DATABASE_URL is not set. Please set your Neon database URL in your environment variables.");
  }
  return url;
}

// Create connection pool for Neon
const client = postgres(getDatabaseUrl(), {
  max: 1, // Neon serverless works best with connection pooling
});

export const db = drizzle(client, { schema });

