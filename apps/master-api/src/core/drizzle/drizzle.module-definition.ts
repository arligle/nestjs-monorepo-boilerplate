import { ConfigurableModuleBuilder } from "@nestjs/common";
import type { DatabaseOptions } from "./options";

export const CONNECTION_POOL = "CONNECTION_POOL";

export const {
	ConfigurableModuleClass: ConfigurableDatabaseModule,
	MODULE_OPTIONS_TOKEN: DATABASE_OPTIONS,
} = new ConfigurableModuleBuilder<DatabaseOptions>()
	.setClassMethodName("forRoot")
	.build();

/***
 * ConfigurableModuleBuilder是NestJS提供的一个工具，用于构建可配置的模块。
 * 这个构建器通过泛型 <DatabaseOptions> 指定了配置选项的类型。
 * .setClassMethodName('forRoot') 指定了一个方法名 forRoot，这是一个常见的模式，用于在根模块中配置服务，确保服务是全局可用的。
 * .build() 方法构建并返回一个对象，这个对象包含两个属性：ConfigurableModuleClass 和 MODULE_OPTIONS_TOKEN
 * ConfigurableModuleClass 被重命名为 ConfigurableDatabaseModule，这是一个类，可以用于NestJS模块系统中，以便于导入和配置数据库模块。
 * MODULE_OPTIONS_TOKEN 被重命名为 DATABASE_OPTIONS，这是一个标识符，用于在NestJS的依赖注入系统中标识模块的配置选项。
 */
