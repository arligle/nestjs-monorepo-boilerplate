import { AppController } from "./core/app/app.controller";
import { DrizzleModule } from "./core/drizzle/drizzle.module";
import { UsersModule } from "./modules/users/users.module";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import Joi from "joi";

const imports = [
  /***
   * 全局注册配置模块，并接受一个配置对象,配置对象来自于.env文件，也可以来自于系统环境变量
   * 配置对象中的值会被注入到ConfigService中，然后可以通过ConfigService.get()方法获取
   * 配置对象被Joi校验，校验失败会抛出异常
   */
  ConfigModule.forRoot({
    validationSchema: Joi.object({
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
    }),
  }),
  /***
   * 全局注册数据库模块，并进行异步配置，这种方式允许在应用启动时动态地配置数据库连接参数。
   * useFactory方法接受一个ConfigService类型的参数，通过它可以获取配置对象中的值
   */
  DrizzleModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      host: configService.get("POSTGRES_HOST"),
      port: configService.get("POSTGRES_PORT"),
      user: configService.get("POSTGRES_USER"),
      password: configService.get("POSTGRES_PASSWORD"),
      database: configService.get("POSTGRES_DB"),
    }),
  }),

  UsersModule,
];

@Module({
  imports,
  controllers: [AppController],
  providers: [],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
