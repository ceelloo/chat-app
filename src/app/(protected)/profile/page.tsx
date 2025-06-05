import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileHeader } from "./_partials/header";

export default async function () {
	const auth = await getSession();
	if (!auth?.session) redirect("/sign-in");

	return (
		<section className="size-full py-20 px-64 gap-6 flex flex-col">
			<ProfileHeader user={auth.user} />
		</section>
	);
}
