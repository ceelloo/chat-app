import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const UserAvatar = ({
	src,
	...props
}: React.ComponentProps<typeof Avatar> & { src?: string | null }) => {
	return (
		<Avatar {...props}>
			<AvatarFallback>👤</AvatarFallback>
			{src ? (
				<AvatarImage src={src} />
			) : (
				<>
					<AvatarImage src="./dark.png" className="dark:hidden block" />
					<AvatarImage src="./white.png" className="dark:block hidden" />
				</>
			)}
		</Avatar>
	);
};
