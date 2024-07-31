import { AppController } from "./core/app/app.controller";
import { AuthModule } from "./core/auth/auth.module";
import { DrizzleModule } from "@aio/nest-drizzle/drizzle.module";
import { UsersModule } from "./modules/users/users.module";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
// 不要转为默认导入，否则会导致ConfigService无法注入
import * as Joi from "joi";

const imports = [
	/***
	 * 全局注册配置模块，并接受一个配置对象,配置对象来自于.env文件，也可以来自于系统环境变量
	 * 配置对象中的值会被注入到ConfigService中，然后可以通过ConfigService.get()方法获取
	 * 配置对象被Joi校验，校验失败会抛出异常
	 */
	ConfigModule.forRoot({
		isGlobal: true,
		// envFilePath: '.env',
		validationSchema: Joi.object({
			DB_HOST: Joi.string().required(),
			DB_PORT: Joi.number().required(),
			DB_USER: Joi.string().required(),
			DB_PASSWORD: Joi.string().required(),
			DB_NAME: Joi.string().required(),
		}),
	}),
	/***
	 * 全局注册数据库模块，并进行异步配置，这种方式允许在应用启动时动态地配置数据库连接参数。
	 * useFactory方法接受一个ConfigService类型的参数，通过它可以获取配置对象中的值
	 */
	DrizzleModule.forRootAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory:
			(configService: ConfigService) => ({
				host: configService.get("DB_HOST"),
				port: configService.get("DB_PORT"),
				user: configService.get("DB_USER"),
				password: configService.get("DB_PASSWORD"),
				database: configService.get("DB_NAME"),
			}),
	}),
	AuthModule,
	UsersModule,
];

@Module({
	imports,
	controllers: [AppController],
	providers: [],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
