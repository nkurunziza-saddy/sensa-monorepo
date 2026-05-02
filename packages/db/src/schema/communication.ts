import { pgTable, text, timestamp, real } from "drizzle-orm/pg-core";

export const conversation = pgTable("conversation", {
  id: text("id").primaryKey(),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const message = pgTable("message", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversation.id, { onDelete: "cascade" }),
  inputModality: text("input_modality").notNull(),
  outputModality: text("output_modality").notNull(),
  content: text("content").notNull(),
  confidence: real("confidence"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
