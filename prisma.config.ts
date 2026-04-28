import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";

// Manually load .env so Prisma CLI picks up DATABASE_URL
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
});
