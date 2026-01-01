import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local (Next.js convention)
config({ path: resolve(process.cwd(), ".env.local") });
// Also try .env as fallback
config({ path: resolve(process.cwd(), ".env") });

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});

