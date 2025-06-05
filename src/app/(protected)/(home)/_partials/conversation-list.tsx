"use client";

import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GetConversations, GetUsers } from "./action";
import { UserList } from "./user-list";

interface ConversationListProps {
	users: GetUsers;
	conversations: GetConversations;
}

export const ConversationList = ({
	users,
	conversations,
}: ConversationListProps) => {
	const { id } = useParams<{ id: string }>();

	return (
		<div className="flex flex-col w-80 border-r">
			<header className="flex justify-between p-4">
				<div className="flex items-end gap-1">
					<Image
						className="invert dakr:invert-0"
						src="./celio.svg"
						width={40}
						height={40}
						alt="celio"
					/>

					<h1 className="text-2xl font-bold">Chat</h1>
				</div>
				<UserList users={users} />
			</header>
			<div className="flex flex-col p-2 gap-4">
				{conversations.map((conv, idx) => (
					<Link
						href={conv.conversationId}
						className={cn(
							"flex gap-2 border rounded-md p-2 cursor-default hover:bg-muted",
							conv.conversationId === id ? "bg-muted" : null,
						)}
						key={idx}
					>
						<UserAvatar className="size-10" src={conv.user.image} />
						<div>
							<h1 className="font-bold">{conv.user.name}</h1>
							<p className="text-sm">{conv.user.email}</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};
