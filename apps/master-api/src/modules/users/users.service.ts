import {
	existsInDatabase,
	extractFieldsInDatabase,
} from "@aio/nest-drizzle/db-access-methods";
// biome-ignore lint/style/useImportType: <受Nestjs机制约束，不能使用import type>
import { DrizzleService } from "@aio/nest-drizzle/drizzle.service";
import { drizzleSchema } from "@aio/data-modeling/drizzle-schema/aiodb-schema";
import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import type { Request } from "express";

@Injectable()
export class UsersService {
	constructor(private readonly drizzleService: DrizzleService) { }
	db = this.drizzleService.database;
	table = drizzleSchema.users;

	/**
	 * Retrieves all users from the database.
	 *
	 * @returns {Promise<any[]>} - A promise that resolves to an array of user objects with selected fields.
	 */
	async findAll(): Promise<any[]> {
		// extract fields id and email from database
		return await extractFieldsInDatabase({
			database: this.db,
			fields: {
				id: this.table.id,
				email: this.table.email,
				firstName: this.table.first_name,
				lastName: this.table.last_name,
			},
			table: this.table,
		});
	}

	/**
	 * Retrieves a single user from the database by ID.
	 *
	 * @param {string} id - The ID of the user to retrieve.
	 * @param {Request} req - The Express request object.
	 * @returns {Promise<any>} - A promise that resolves to the user object if found.
	 * @throws {NotFoundException} - If the user is not found in the database.
	 * @throws {ForbiddenException} - If the authenticated user is not authorized to access the requested user.
	 */

	async findOne(id: string, req: Request): Promise<any> {
		// check if user exists in database
		const user = await existsInDatabase({
			column: "id",
			database: this.db,
			table: this.table,
			value: id,
		});

		// if user does not exist, throw error
		if (!user) throw new NotFoundException("User not found");

		// check if user is authorized
		const decodedUser = req.user as { id: string; email: string };

		// if the requested user is not the authorized user, throw error
		if (user.id !== decodedUser.id)
			throw new ForbiddenException("User not found");

		// remove the password from the user object
		user.password = undefined;

		// return the current user
		return user;
	}


}
