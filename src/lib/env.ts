import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
	server: {
		DB_FILE_NAME: z.string(),
		GITHUB_CLIENT_ID: z.string(),
		GITHUB_SECRET: z.string(),
	},
	runtimeEnv: {
		DB_FILE_NAME: process.env.DB_FILE_NAME,
		GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		GITHUB_SECRET: process.env.GITHUB_SECRET,
	},
});
