import type { CloudflareEnv } from "./src/server";

declare global {
  type Env = CloudflareEnv;
}

declare module "cloudflare:workers" {
  export const env: CloudflareEnv;
}
