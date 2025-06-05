import { createServer } from "node:http";
import next from "next";
import { NextServerOptions } from "next/dist/server/next";
import { Server } from "socket.io";

const config = {
	dev: process.env.NODE_ENV !== "production",
	hostname: "localhost",
	port: 3000,
	turbo: true,
} satisfies NextServerOptions & { turbo?: boolean; turbopack?: boolean };

const app = next(config);
const handler = app.getRequestHandler();

app.prepare().then(() => {
	const httpServer = createServer(handler);
	const io = new Server(httpServer, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket) => {
		console.log(`[[client connected ${socket.id}]]`);

		socket.onAny((event, ...args) => {
			console.log(`[${socket.id}] Event received:`, event, args);
		});

		socket.on("join-room", (convId: string) => {
			socket.join(convId);
			console.log(`Socket ${socket.id} joined room ${convId}`);
		});

		socket.on(
			"send-message",
			({ convId, message }: { convId: string; message: string }) => {
				console.log(`Sending message to room ${convId}: ${message}`);
				io.to(convId).emit("new-message", {
					message,
				});
			},
		);

		socket.on("disconnect", (reason) => {
			console.log(`[[client disconnected ${socket.id}]] Reason:`, reason);
		});
	});

	httpServer
		.once("error", (err) => {
			console.error(err);
			process.exit(1);
		})
		.listen(config.port, () => {
			console.log(`> Ready on http://${config.hostname}:${config.port}`);
		});
});
