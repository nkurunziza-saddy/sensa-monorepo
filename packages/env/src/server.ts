// For Cloudflare Workers, env is accessed via cloudflare:workers module
// Types are defined in env.d.ts based on your alchemy.run.ts bindings

import { env as cfEnv } from "cloudflare:workers";

export interface CloudflareEnv {
  DATABASE_URL: string;
  CORS_ORIGIN: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GEMINI_API_KEY: string;
  GROQ_API_KEY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

export const env = cfEnv as unknown as CloudflareEnv;
