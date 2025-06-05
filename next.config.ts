import type { NextConfig } from "next";

export default {
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		reactCompiler: true,
	},
} satisfies NextConfig;
