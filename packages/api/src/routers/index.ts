import { protectedProcedure, publicProcedure, router } from "../index";
import { communicationRouter } from "./communication";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  communication: communicationRouter,
});
export type AppRouter = typeof appRouter;
