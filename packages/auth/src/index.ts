import { db } from "@sensa-monorepo/db";
import * as schema from "@sensa-monorepo/db/schema/auth";
import { env } from "@sensa-monorepo/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

let _auth: any;

export const getAuth = () => {
  if (!_auth) {
    _auth = betterAuth({
      database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
      }),
      trustedOrigins: [env.CORS_ORIGIN || "*"],
      emailAndPassword: {
        enabled: true,
      },
      secret: env.BETTER_AUTH_SECRET || "placeholder-secret-for-validation",
      baseURL: env.BETTER_AUTH_URL || "http://localhost:3000",
      advanced: {
        defaultCookieAttributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
        },
      },
    });
  }
  return _auth;
};

// Use a Proxy to keep the 'auth' export compatible with existing code while being lazy
export const auth = new Proxy({} as any, {
  get(_, prop) {
    const instance = getAuth();
    const value = (instance as any)[prop];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
