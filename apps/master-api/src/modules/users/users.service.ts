import {
	extractFieldsInDatabase,
} from "../../core/drizzle/db-access-methods";
// biome-ignore lint/style/useImportType: <受Nestjs机制约束，不能使用import type>
import { DrizzleService } from "../../core/drizzle/drizzle.service";
import { drizzleSchema } from "@aio/data-modeling/drizzle-schema/aiodb-schema";
import {
	Injectable,
} from "@nestjs/common";


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


}
