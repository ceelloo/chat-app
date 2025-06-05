import { UserAvatar } from "@/components/user-avatar";
import { User } from "better-auth";

export const ProfileHeader = ({ user }: { user: User }) => {
	return (
		<header className="p-6 border rounded-lg flex gap-10 shadow-md">
			<UserAvatar className="size-24" src={user.image} />
			<div className="flex-1 text-center sm:text-left">
				<div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
					<h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
				</div>
				<p className="text-muted-foreground mb-2">{user.email}</p>
				<p className="text-sm text-muted-foreground">
					Member since{" "}
					{user.createdAt.toLocaleDateString("en-US", {
						day: "numeric",
						month: "long",
					})}
				</p>
			</div>
		</header>
	);
};
