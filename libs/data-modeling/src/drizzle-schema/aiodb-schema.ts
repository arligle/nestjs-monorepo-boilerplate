// biome-ignore lint/style/useImportType: <explanation>
import { InferSelectModel } from "drizzle-orm";
import { articles, organizations, role, users } from "./schema";
import * as relations from "./relations";

export const drizzleSchema = {
	users,
	organizations,
	articles,
	role,
};

export const drizzleRelations = relations;

export type User = InferSelectModel<typeof users>;
export type Organization = InferSelectModel<typeof organizations>;
