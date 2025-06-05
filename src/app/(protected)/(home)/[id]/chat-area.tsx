"use client";
import { Time } from "@/components/time";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import { useWs } from "@/hooks/use-ws";
import { User } from "better-auth";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GetConversationById } from "../_partials/action";

export const ChatArea = ({
	conversation,
	user,
}: {
	conversation: GetConversationById;
	user: User;
}) => {
	const [content, setContent] = useState<string>("");
	const { messages, sendMessage } = useWs(
		conversation.id,
		conversation.messages,
	);
	const bottomRef = useRef<HTMLDivElement>(null);
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (isInitialLoad) {
			setTimeout(() => {
				bottomRef.current?.scrollIntoView({ behavior: "auto" });
				setIsInitialLoad(false);
			}, 100);
		} else {
			bottomRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, isInitialLoad]);

	const scrollToBottom = () => {
		if (scrollAreaRef.current) {
			const scrollContainer = scrollAreaRef.current.querySelector(
				"[data-radix-scroll-area-viewport]",
			);
			if (scrollContainer) {
				scrollContainer.scrollTop = scrollContainer.scrollHeight;
			}
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const timer = setTimeout(() => {
			scrollToBottom();
		}, 150);

		return () => clearTimeout(timer);
	}, [messages]);

	return (
		<div className="flex-1 flex flex-col">
			<div className="h-14 border-b w-full flex items-center px-4 gap-2">
				<UserAvatar src={conversation.participant?.image} />
				<div className="flex-1 flex items-center gap-2 justify-start">
					<h1 className="font-bold">{conversation.participant?.name}</h1>
				</div>
			</div>
			<ScrollArea
				className="flex-1 flex flex-col gap-4 p-2 h-[80vh]"
				ref={scrollAreaRef}
			>
				{messages.map((msg, idx) => (
					<div
						className={`flex my-4 ${
							msg.senderId === user.id ? "justify-end" : "justify-start"
						}`}
						key={idx}
					>
						<div className="flex flex-col max-w-xs lg:max-w-2xl">
							<div
								className={`px-4 py-1 rounded-lg border-2 ${
									msg.senderId === user.id
										? "bg-green-200 border-green-600"
										: "bg-zinc-100 border-zinc-800"
								}`}
							>
								<p className="text-sm leading-relaxed">{msg.content}</p>
							</div>
							<Time
								date={msg.sentAt}
								className={`text-xs mt-1 ${
									msg.senderId === user.id ? "text-end" : "text-start"
								}`}
							/>
						</div>
					</div>
				))}
				<div ref={bottomRef} />
			</ScrollArea>
			<form
				onSubmit={async (e: React.FormEvent) => {
					e.preventDefault();
					sendMessage(content);
					setContent("");
				}}
				className="p-2 border-t flex gap-4"
			>
				<Input
					type="text"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
				<Button
					className="bg-emerald-600 hover:bg-emerald-800"
					disabled={!content}
				>
					<Send />
				</Button>
			</form>
		</div>
	);
};
