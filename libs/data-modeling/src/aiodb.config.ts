import { defineConfig } from "drizzle-kit";
import env from "./env";

export default defineConfig({
	schema: "libs/data-modeling/src/drizzle-schema/aiodb-schema.ts",
	out: "libs/data-modeling/src/aiodb/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	verbose: true,
	strict: true,
});
