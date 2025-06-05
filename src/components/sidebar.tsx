"use client";

import { authClient } from "@/lib/auth-client";
import { LogOut, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";

export const Sidebar = () => {
	return (
		<div className="border-r p-3">
			<div className="flex flex-col h-full justify-between">
				<div className="flex flex-col gap-2">
					<Link
						href="/"
						className={buttonVariants({ variant: "outline", size: "icon" })}
					>
						<MessageCircle />
					</Link>
					<Link
						href="/profile"
						className={buttonVariants({ variant: "outline", size: "icon" })}
					>
						<User />
					</Link>
				</div>
				<div className="flex flex-col">
					<Button
						size="icon"
						variant="destructive"
						onClick={() =>
							authClient.signOut({
								fetchOptions: {
									onSuccess: () => window.location.reload(),
								},
							})
						}
					>
						<LogOut />
					</Button>
				</div>
			</div>
		</div>
	);
};
