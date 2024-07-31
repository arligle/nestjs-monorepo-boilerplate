import { drizzleSchema } from "@aio/data-modeling/drizzle-schema/aiodb-schema";
import { Inject, Injectable } from "@nestjs/common";
import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";
import { CONNECTION_POOL } from "./drizzle.module-definition";

@Injectable()
export class DrizzleService {
	public database: NodePgDatabase<typeof drizzleSchema>;
	constructor(@Inject(CONNECTION_POOL) private readonly pool: Pool) {
		this.database = drizzle(this.pool, { schema: drizzleSchema });
	}
}

/***
 * 把DrizzleService定义为一个可以被注入的类，这是NestJS依赖注入系统的工作原理和机制。
 * 在这个类的构造函数中@Inject装饰器接受一个字符串参数，它是连接到DrizzleService的连接池的标识符。
 * 这个类有一个公开的属性db，是一个泛型，指向了DrizzleORM的NodePgDatabase类型，
 * 并接收了连接池和从外部定义的schema作为参数。
 * 这个类可以被注入到其他类中，并用于访问DrizzleORM的API。
 * 它的db属性值就是一个drizzle客户端
 */
