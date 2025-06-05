import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "./auth";

export const conversationTable = sqliteTable("conversation", {
	id: text("id").primaryKey(),
});

export type Conversation = typeof conversationTable.$inferSelect & {
	participants: Participant[];
};

export const participantTable = sqliteTable("participant", {
	conversationId: text("conversation_id")
		.references(() => conversationTable.id)
		.notNull(),
	userId: text("user_id")
		.references(() => userTable.id)
		.notNull(),
});

export type Participant = typeof participantTable.$inferSelect;

export const messageTable = sqliteTable("message", {
	id: text("id").primaryKey(),
	conversationId: text("conversation_id")
		.references(() => conversationTable.id)
		.notNull(),
	senderId: text("sender_id")
		.references(() => userTable.id)
		.notNull(),
	content: text("content").notNull(),
	sentAt: integer("sent_at", { mode: "timestamp" }).notNull(),
});

export type Message = typeof messageTable.$inferSelect;
