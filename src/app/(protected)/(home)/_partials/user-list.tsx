"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { useSetAtom } from "jotai";
import { UserPlus2 } from "lucide-react";
import { GetUsers } from "./action";
import { isNewConversationAtom, selectedUserAtom } from "./atom";

export const UserList = ({ users }: { users: GetUsers }) => {
	const setIsNewConversation = useSetAtom(isNewConversationAtom);
	const setSelectedUser = useSetAtom(selectedUserAtom);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<UserPlus2 />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-80">
				<DropdownMenuLabel className="text-center font-bold">
					New conversation
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{users.length !== 0 ? (
					users.map((user) => (
						<DropdownMenuItem
							className="font-bold"
							key={user.id}
							onClick={() => {
								setIsNewConversation(true);
								setSelectedUser(user);
							}}
						>
							<UserAvatar src={user.image} />
							{user.name}
						</DropdownMenuItem>
					))
				) : (
					<DropdownMenuLabel className="text-center">
						No users found.
					</DropdownMenuLabel>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
