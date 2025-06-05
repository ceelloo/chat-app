import {
	GetConversationById,
	sendMessage as serverSendMessage,
} from "@/app/(protected)/(home)/_partials/action";
import { useCallback, useEffect, useRef, useState } from "react";
import { type Socket, io } from "socket.io-client";

let socket: Socket | null = null;

const initSocket = () => {
	if (!socket) {
		socket = io("http://localhost:3000", {
			transports: ["websocket"],
		});

		socket.on("connect", () => console.log("[Socket connected]", socket?.id));
		socket.on("disconnect", (reason) =>
			console.log("[Socket disconnected]", reason),
		);
	}
	return socket;
};

export function useWs(
	conversationId: string,
	initialMessages: GetConversationById["messages"],
) {
	const [messages, setMessages] = useState(initialMessages);
	const hasJoined = useRef(false);

	// Initialize socket once
	useEffect(() => {
		initSocket();
	}, []);

	// Handle room joining and message listening
	useEffect(() => {
		if (!conversationId || !socket || hasJoined.current) return;

		// Join room
		socket.emit("join-room", conversationId);
		hasJoined.current = true;

		// Listen for new messages
		const handleNewMessage = (data: { message: any }) => {
			setMessages((prev) => [...prev, data.message]);
		};

		socket.on("new-message", handleNewMessage);

		// Cleanup
		return () => {
			socket?.off("new-message", handleNewMessage);
			socket?.emit("leave-room", conversationId);
			hasJoined.current = false;
		};
	}, [conversationId]);

	// Send message function
	const sendMessage = useCallback(
		async (content: string) => {
			try {
				const savedMessage = await serverSendMessage(conversationId, content);
				socket?.emit("send-message", {
					convId: conversationId,
					message: savedMessage,
				});
			} catch (error) {
				console.error("Failed to send message:", error);
			}
		},
		[conversationId],
	);

	return { messages, sendMessage };
}
