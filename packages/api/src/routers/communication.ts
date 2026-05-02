import { eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure, router } from "../index";
import { db } from "@sensa-monorepo/db";
import { conversation, message } from "@sensa-monorepo/db/schema/index";
import { nanoid } from "nanoid";
import { env } from "@sensa-monorepo/env/server";

export const communicationRouter = router({
  getElevenLabsToken: publicProcedure.query(async () => {
    const agentId = env.ELEVENLABS_AGENT_ID;
    const apiKey = env.ELEVENLABS_API_KEY;

    if (!agentId || !apiKey) {
      throw new Error("ELEVENLABS_AGENT_ID or ELEVENLABS_API_KEY is not set");
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": apiKey,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to get signed URL from ElevenLabs");
    }

    const data = (await response.json()) as { signed_url: string };
    return data.signed_url;
  }),

  assistant: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      const apiKey = env.GROQ_API_KEY;
      if (!apiKey) throw new Error("GROQ_API_KEY is not set");

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are Sensa, a peaceful accessibility assistant. Provide concise, helpful responses to help users communicate.",
            },
            {
              role: "user",
              content: input.message,
            },
          ],
          temperature: 0.5,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("Groq Error:", err);
        throw new Error("Groq API error");
      }

      const data = (await response.json()) as any;
      const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";
      return reply.trim();
    }),

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
