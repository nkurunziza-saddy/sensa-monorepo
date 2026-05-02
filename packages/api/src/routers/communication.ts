import { eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "../index";
import { db } from "@sensa-monorepo/db";
import { conversation, message } from "@sensa-monorepo/db/schema/index";
import { nanoid } from "nanoid";

export const communicationRouter = router({
  createConversation: publicProcedure
    .input(z.object({ title: z.string().optional() }).optional())
    .mutation(async ({ input }) => {
      const id = nanoid();
      const [newConversation] = await db
        .insert(conversation)
        .values({
          id,
          title: input?.title,
        })
        .returning();
      return newConversation;
    }),

  getConversation: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const result = await db.query.conversation.findFirst({
      where: eq(conversation.id, input.id),
    });
    return result;
  }),

  addMessage: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        inputModality: z.enum(["speech", "text", "gesture"]),
        outputModality: z.enum(["text", "audio", "haptic"]),
        content: z.string(),
        confidence: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const id = nanoid();
      const [newMessage] = await db
        .insert(message)
        .values({
          id,
          conversationId: input.conversationId,
          inputModality: input.inputModality,
          outputModality: input.outputModality,
          content: input.content,
          confidence: input.confidence,
        })
        .returning();
      return newMessage;
    }),

  listMessages: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ input }) => {
      const results = await db.query.message.findMany({
        where: eq(message.conversationId, input.conversationId),
        orderBy: (message, { asc }) => [asc(message.createdAt)],
      });
      return results;
    }),
});
