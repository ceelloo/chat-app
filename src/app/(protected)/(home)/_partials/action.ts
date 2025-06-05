"use server";

import { getSession } from "@/lib/auth";
import { genId } from "@/lib/id";
import { db } from "@/server/db";
import {
	conversationTable,
	messageTable,
	participantTable,
	userTable,
} from "@/server/schemas";
import { and, eq, inArray, ne, notInArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const getUsers = async () => {
	const auth = await getSession();
	if (!auth?.session) redirect("/sign-in");

	const userConversationIds = await db
		.select({ conversationId: participantTable.conversationId })
		.from(participantTable)
		.where(eq(participantTable.userId, auth.user.id));

	const conversationIds = userConversationIds.map((c) => c.conversationId);
	let excludeIds: string[] = [];

	if (conversationIds.length > 0) {
		const realtedUserIds = await db
			.selectDistinct({ userId: participantTable.userId })
			.from(participantTable)
			.where(
				and(
					inArray(participantTable.conversationId, conversationIds),
					ne(participantTable.userId, auth.user.id),
				),
			);

		excludeIds = realtedUserIds.map((r) => r.userId);
	}

	const users = await db
		.select({
			id: userTable.id,
			name: userTable.name,
			email: userTable.email,
			image: userTable.image,
		})
		.from(userTable)
		.where(
			and(
				ne(userTable.id, auth.user.id),
				excludeIds.length > 0
					? notInArray(userTable.id, excludeIds)
					: undefined,
			),
		);

	return users;
};

export type GetUsers = Awaited<ReturnType<typeof getUsers>>;

export const getConversations = async () => {
	const auth = await getSession();
	if (!auth?.session) redirect("/sign-in");

	const conversations = await db
		.select({
			conversationId: conversationTable.id,
			user: {
				id: userTable.id,
				name: userTable.name,
				email: userTable.email,
				image: userTable.image,
			},
		})
		.from(conversationTable)
		.innerJoin(
			participantTable,
			eq(conversationTable.id, participantTable.conversationId),
		)
		.innerJoin(userTable, eq(participantTable.userId, userTable.id))
		.where(and(ne(participantTable.userId, auth.user.id)));

	return conversations ?? [];
};

export type GetConversations = Awaited<ReturnType<typeof getConversations>>;

export const getConversationById = async (id: string) => {
	const auth = await getSession();
	if (!auth?.session) redirect("/sign-in");

	const conversation = await db
		.select()
		.from(conversationTable)
		.where(eq(conversationTable.id, id))
		.get();

	if (!conversation) {
		throw new Error("Conversation not found");
	}

	const participant = await db
		.select({
			id: userTable.id,
			name: userTable.name,
			email: userTable.email,
			image: userTable.image,
		})
		.from(participantTable)
		.innerJoin(userTable, eq(participantTable.userId, userTable.id))
		.where(
			and(
				eq(participantTable.conversationId, id),
				ne(participantTable.userId, auth.user.id),
			),
		)
		.get();

	if (!participant) {
		throw new Error("Participant not found");
	}

	const messages = await db
		.select()
		.from(messageTable)
		.where(eq(messageTable.conversationId, id))
		.orderBy(messageTable.sentAt);

	return {
		...conversation,
		participant,
		messages,
	};
};

export type GetConversationById = Awaited<
	ReturnType<typeof getConversationById>
>;

export const sendMessage = async (conversationId: string, content: string) => {
	const auth = await getSession();
	if (!auth?.session) redirect("/sign-in");

	const [message] = await db
		.insert(messageTable)
		.values({
			id: genId(),
			senderId: auth.user.id,
			conversationId: conversationId,
			content: content,
			sentAt: new Date(),
		})
		.returning();

	revalidatePath(`/${conversationId}`);

	return message;
};

export const createConversation = async (
	participantId: string,
	content: string,
) => {
	const auth = await getSession();
	if (!auth?.session) redirect("/sign-in");

	const [conversation] = await db
		.insert(conversationTable)
		.values({
			id: genId(),
		})
		.returning();

	await db.insert(participantTable).values([
		{
			userId: auth.user.id,
			conversationId: conversation.id,
		},
		{
			userId: participantId,
			conversationId: conversation.id,
		},
	]);

	await sendMessage(conversation.id, content);

	redirect(`/${conversation.id}`);
};
