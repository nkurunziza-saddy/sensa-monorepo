import { trpcServer } from "@hono/trpc-server";
import { createContext } from "@sensa-monorepo/api/context";
import { appRouter } from "@sensa-monorepo/api/routers/index";
import { auth } from "@sensa-monorepo/auth";
import { env } from "@sensa-monorepo/env/server";
import { communicationRoutes } from "./routes/communication";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api", communicationRoutes);

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  }),
);

app.get("/", (c) => {
  return c.text("OK");
});

export default app;
