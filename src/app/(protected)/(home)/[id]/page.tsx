import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getConversationById } from "../_partials/action";
import { ChatArea } from "./chat-area";

export default async function ({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const auth = await getSession();
	if (!auth?.session) redirect("/sign-in");

	const conversation = await getConversationById((await params).id);

	return <ChatArea conversation={conversation} user={auth.user} />;
}
