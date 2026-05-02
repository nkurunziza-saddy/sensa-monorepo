import alchemy from "alchemy";
import { Nextjs, Worker } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/server/.env" });

const app = await alchemy("sensa-monorepo");

export const server = await Worker("server", {
  cwd: "../../apps/server",
  entrypoint: "src/index.ts",
  compatibility: "node",
  bindings: {
    DATABASE_URL: alchemy.secret.env.DATABASE_URL!,
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL!,
    GEMINI_API_KEY: alchemy.secret.env.GEMINI_API_KEY!,
    GROQ_API_KEY: alchemy.secret.env.GROQ_API_KEY!,
    GOOGLE_CLIENT_ID: alchemy.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: alchemy.secret.env.GOOGLE_CLIENT_SECRET!,
  },
  dev: {
    port: 3000,
  },
});

export const web = await Nextjs("web", {
  cwd: "../../apps/web",
  build: {
    env: {
      NEXT_PUBLIC_SERVER_URL: server.url,
    },
  },
});

console.log(`Server -> ${server.url}`);
console.log(`Web -> ${web.url}`);

await app.finalize();
