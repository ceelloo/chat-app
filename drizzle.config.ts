import { env } from "@/lib/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/server/schemas/*.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: env.DB_FILE_NAME,
	},
});
