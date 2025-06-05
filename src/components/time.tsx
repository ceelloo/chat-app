"use client";

import { useEffect, useState } from "react";

interface TimeProps extends React.ComponentProps<"span"> {
	date: Date;
}

export const Time = ({ date, ...props }: TimeProps) => {
	const [time, setTime] = useState("");

	useEffect(() => {
		const local = new Date(date).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
		setTime(local);
	}, [date]);

	return <span {...props}>{time}</span>;
};
