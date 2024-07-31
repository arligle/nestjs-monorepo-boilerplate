import { Global, Module } from "@nestjs/common";
import { Pool } from "pg";
import {
	CONNECTION_POOL,
	ConfigurableDatabaseModule,
	DATABASE_OPTIONS,
} from "./drizzle.module-definition";
import { DrizzleService } from "./drizzle.service";
import type { DatabaseOptions } from "./options";

@Global()
@Module({
	exports: [DrizzleService],
	providers: [
		DrizzleService,
		{
			provide: CONNECTION_POOL,
			inject: [DATABASE_OPTIONS],
			useFactory: (databaseOptions: DatabaseOptions) => {
				return new Pool({
					host: databaseOptions.host,
					port: databaseOptions.port,
					user: databaseOptions.user,
					password: databaseOptions.password,
					database: databaseOptions.database,
				});
			},
		},
	],
})
export class DrizzleModule extends ConfigurableDatabaseModule {}
