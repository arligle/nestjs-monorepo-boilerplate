import {
	pgTable,
	pgEnum,
	serial,
	text,
	uniqueIndex,
	index,
	foreignKey,
	varchar,
	timestamp,
	unique,
	uuid,
	boolean,
	smallint,
} from "drizzle-orm/pg-core";

export const dimension_unit = pgEnum("dimension_unit", ["count", "percent"]);
export const event_handlers_target_enum = pgEnum("event_handlers_target_enum", [
	"page",
	"component",
	"data_query",
	"table_column",
	"table_action",
]);
export const layput_type = pgEnum("layput_type", ["desktop", "mobile"]);
export const scope = pgEnum("scope", ["local", "global"]);
export const source = pgEnum("source", [
	"signup",
	"invite",
	"google",
	"git",
	"workspace_signup",
]);
export const status = pgEnum("status", [
	"invited",
	"verified",
	"active",
	"archived",
]);
export const type = pgEnum("type", ["static", "default", "sample"]);
export const variable_type = pgEnum("variable_type", ["client", "server"]);

export const articles = pgTable("articles", {
	id: serial("id").primaryKey().notNull(),
	title: text("title"),
	content: text("content"),
});

export const resource = pgTable(
	"resource",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		name: varchar("name", { length: 191 }).notNull(),
		description: varchar("description", { length: 191 }).notNull(),
		createdAt: timestamp("createdAt", { mode: "string" }).notNull(),
		updatedAt: timestamp("updatedAt", { mode: "string" }).notNull(),
		parentId: varchar("parentId", { length: 191 }),
	},
	(table) => {
		return {
			name_key: uniqueIndex("resource_name_key").using("btree", table.name),
			parentId_fkey: index("resource_parentId_fkey").using(
				"btree",
				table.parentId,
			),
			resource_parentId_fkey: foreignKey({
				columns: [table.parentId],
				foreignColumns: [table.id],
				name: "resource_parentId_fkey",
			}),
		};
	},
);

export const role_permission = pgTable(
	"role_permission",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		resourceId: varchar("resourceId", { length: 191 })
			.notNull()
			.references(() => resource.id),
		permission: varchar("permission", { length: 255 }).notNull(),
		createdAt: timestamp("createdAt", { mode: "string" }).notNull(),
		updatedAt: timestamp("updatedAt", { mode: "string" }).notNull(),
		roleId: varchar("roleId", { length: 191 }).references(() => role.id),
	},
	(table) => {
		return {
			resourceId_fkey: index("role_permission_resourceId_fkey").using(
				"btree",
				table.resourceId,
			),
			roleId_fkey: index("role_permission_roleId_fkey").using(
				"btree",
				table.roleId,
			),
		};
	},
);

export const role = pgTable(
	"role",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		profileId: varchar("profileId", { length: 191 }).notNull(),
		name: varchar("name", { length: 191 }).notNull(),
		description: varchar("description", { length: 191 }).notNull(),
		createdAt: timestamp("createdAt", { mode: "string" }).notNull(),
		updatedAt: timestamp("updatedAt", { mode: "string" }).notNull(),
	},
	(table) => {
		return {
			name_key: uniqueIndex("role_name_key").using("btree", table.name),
			profileId_key: uniqueIndex("role_profileId_key").using(
				"btree",
				table.profileId,
			),
		};
	},
);

export const user_permissions = pgTable(
	"user_permissions",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		userId: varchar("userId", { length: 191 }).notNull(),
		permission: varchar("permission", { length: 255 }).notNull(),
		resourceId: varchar("resourceId", { length: 191 })
			.notNull()
			.references(() => resource.id),
		createdAt: timestamp("createdAt", { mode: "string" }).notNull(),
		updatedAt: timestamp("updatedAt", { mode: "string" }).notNull(),
	},
	(table) => {
		return {
			resourceId_fkey: index("user_permissions_resourceId_fkey").using(
				"btree",
				table.resourceId,
			),
		};
	},
);

export const user_role = pgTable(
	"user_role",
	{
		id: varchar("id", { length: 191 }).primaryKey().notNull(),
		userId: varchar("userId", { length: 191 }).notNull(),
		createdAt: timestamp("createdAt", { mode: "string" }).notNull(),
		updatedAt: timestamp("updatedAt", { mode: "string" }).notNull(),
		roleId: varchar("roleId", { length: 191 }).references(() => role.id),
	},
	(table) => {
		return {
			roleId_fkey: index("user_role_roleId_fkey").using("btree", table.roleId),
			userId_key: uniqueIndex("user_role_userId_key").using(
				"btree",
				table.userId,
			),
		};
	},
);

export const organizations = pgTable(
	"organizations",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		name: varchar("name"),
		domain: varchar("domain"),
		created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
		updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
		enable_sign_up: boolean("enable_sign_up").default(false).notNull(),
		inherit_sso: boolean("inherit_sso").default(true).notNull(),
		slug: varchar("slug", { length: 50 }),
	},
	(table) => {
		return {
			name_organizations_unique: unique("name_organizations_unique").on(
				table.name,
			),
			slug_organizations_unique: unique("slug_organizations_unique").on(
				table.slug,
			),
		};
	},
);

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	nice_name: varchar("nice_name"),
	first_name: varchar("first_name"),
	last_name: varchar("last_name"),
	email: varchar("email"),
	password_digest: varchar("password_digest"),
	invitation_token: varchar("invitation_token"),
	forgot_password_token: varchar("forgot_password_token"),
	created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
	updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
	role: varchar("role").default("").notNull(),
	avatar_id: uuid("avatar_id"),
	password_retry_count: smallint("password_retry_count").default(0).notNull(),
	company_size: varchar("company_size"),
	company_name: varchar("company_name"),
	phone_number: varchar("phone_number"),
	organization_id: uuid("organization_id").references(() => organizations.id, {
		onDelete: "cascade",
	}),
	status: status("status").default("invited").notNull(),
	source: source("source").default("invite").notNull(),
	password: varchar("password"),
});
