import { Sidebar } from "@/components/sidebar";

export default function ({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-svh w-full">
			<Sidebar />
			{children}
		</div>
	);
}
