import { db } from "@/server/db";
import * as schema from "@/server/schemas";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { headers } from "next/headers";
import { env } from "./env";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
		schema: {
			user: schema.userTable,
			session: schema.sessionTable,
			...schema,
		},
	}),
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_SECRET,
		},
	},
});

export const getSession = async () => {
	return auth.api.getSession({ headers: await headers() });
};
