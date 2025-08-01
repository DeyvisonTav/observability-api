import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schema: "./src/database/schemas/index.ts",
  out: "./src/database/migrations",
  casing: "snake_case",
});