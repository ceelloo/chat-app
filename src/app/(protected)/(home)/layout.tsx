import { getConversations, getUsers } from "./_partials/action";
import { ConversationList } from "./_partials/conversation-list";

export default async function ({ children }: { children: React.ReactNode }) {
	const conversations = await getConversations();
	const users = await getUsers();

	return (
		<>
			<ConversationList conversations={conversations} users={users} />
			{children}
		</>
	);
}
