"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/user-avatar";
import { useAtomValue } from "jotai";
import { Send } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { createConversation } from "./_partials/action";
import { isNewConversationAtom, selectedUserAtom } from "./_partials/atom";

export default function () {
	const selectedUser = useAtomValue(selectedUserAtom);
	const isNewConversation = useAtomValue(isNewConversationAtom);
	const [content, setContent] = useState<string>("");

	if (selectedUser && isNewConversation) {
		return (
			<div className="flex-1 flex flex-col">
				<div className="h-16 border-b w-full flex items-center px-4">
					<div className="flex-1 flex items-center gap-2 justify-start">
						<UserAvatar src={selectedUser?.image} />
						<h1 className="font-bold">{selectedUser.name}</h1>
					</div>
					<div className="flex-1 flex justify-end">
						<Badge variant="destructive" className="px-4 py-1">
							<div className="p-1 rounded-full bg-red-800" />
							Offline
						</Badge>
					</div>
				</div>
				<div className="flex-1 flex flex-col gap-4 p-2"></div>
				<form
					onSubmit={async (e: React.FormEvent) => {
						e.preventDefault();
						await createConversation(selectedUser.id, content);
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
	}

	return (
		<div className="flex-1 flex flex-col items-center justify-center">
			<Image
				className="invert dark:invert-0"
				src="./celio.svg"
				width={100}
				height={100}
				alt="celio"
			/>
			<h1 className="text-xl">Chat App for Laptop.</h1>
		</div>
	);
}
