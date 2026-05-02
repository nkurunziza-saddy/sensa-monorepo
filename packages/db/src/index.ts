import { neon } from "@neondatabase/serverless";
import { env } from "@sensa-monorepo/env/server";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema/index";

let _db: any;

export const getDb = () => {
  if (!_db) {
    const url = env.DATABASE_URL;
    if (!url) {
      // In development or validation, we might not have the URL yet.
      // We return a dummy to allow the script to load, but it will fail if actually called.
      console.warn("DATABASE_URL not found during initialization. Database access will fail if called.");
      return drizzle(neon("https://placeholder-if-not-set.com"), { schema });
    }
    const sql = neon(url);
    _db = drizzle(sql, { schema });
  }
  return _db;
};

// Use a Proxy to keep the 'db' export compatible with existing code while being lazy
export const db = new Proxy({} as any, {
  get(_, prop) {
    return (getDb() as any)[prop];
  }
});
