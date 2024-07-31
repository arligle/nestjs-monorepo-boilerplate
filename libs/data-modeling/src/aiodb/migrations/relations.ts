import { relations } from "drizzle-orm/relations";
import {
	resource,
	role_permission,
	role,
	user_permissions,
	user_role,
	organizations,
	users,
} from "./schema";

export const resourceRelations = relations(resource, ({ one, many }) => ({
	resource: one(resource, {
		fields: [resource.parentId],
		references: [resource.id],
		relationName: "resource_parentId_resource_id",
	}),
	resources: many(resource, {
		relationName: "resource_parentId_resource_id",
	}),
	role_permissions: many(role_permission),
	user_permissions: many(user_permissions),
}));

export const role_permissionRelations = relations(
	role_permission,
	({ one }) => ({
		resource: one(resource, {
			fields: [role_permission.resourceId],
			references: [resource.id],
		}),
		role: one(role, {
			fields: [role_permission.roleId],
			references: [role.id],
		}),
	}),
);

export const roleRelations = relations(role, ({ many }) => ({
	role_permissions: many(role_permission),
	user_roles: many(user_role),
}));

export const user_permissionsRelations = relations(
	user_permissions,
	({ one }) => ({
		resource: one(resource, {
			fields: [user_permissions.resourceId],
			references: [resource.id],
		}),
	}),
);

export const user_roleRelations = relations(user_role, ({ one }) => ({
	role: one(role, {
		fields: [user_role.roleId],
		references: [role.id],
	}),
}));

export const usersRelations = relations(users, ({ one }) => ({
	organization: one(organizations, {
		fields: [users.organization_id],
		references: [organizations.id],
	}),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
	users: many(users),
}));
