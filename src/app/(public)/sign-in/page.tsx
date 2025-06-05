"use client";

import GitHub from "@/components/github";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function () {
	const signIn = async () => {
		await authClient.signIn.social({ provider: "github" });
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col items-center">
				<Image
					className="invert dark:invert-0"
					src="./celio.svg"
					width={50}
					height={50}
					alt="celio"
				/>
				<h1 className="text-xl font-bold">Welcome to Chat</h1>
				<p>sign in bellow</p>
			</div>
			<form action={signIn}>
				<Button size="lg">
					<GitHub />
					Continue with GitHub
				</Button>
			</form>
		</div>
	);
}
