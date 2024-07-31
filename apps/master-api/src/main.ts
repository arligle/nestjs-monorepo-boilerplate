import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "node:path";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ResponseInterceptor } from "./core/app/app.response";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const port = process.env.PORT || 4000;
	// globals
	const prefix = "api/v1";
	app.setGlobalPrefix(prefix);
	// 全局管道
	// app.useGlobalPipes(new ValidationPipe());
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);
	// 全局拦截器
	const reflector = new Reflector();
	app.useGlobalInterceptors(new ResponseInterceptor(reflector));
	// MVC 行代码只是把目录设置为服务器的静态资源目录,并不符拷贝代码到 dist
	// 注意：__dirname指的是编译后的 main.js 文件所在目录，
	// 就是 dist/apps/master-api/main.js
	app.useStaticAssets(join(__dirname, "..", "public"));
	app.setBaseViewsDir(join(__dirname, "..", "views"));
	app.setViewEngine("hbs");
	// 确保程序安全地关闭
	app.enableShutdownHooks();
	// cors
	app.enableCors();
	// swagger config
	const options = new DocumentBuilder()
		.setTitle("NestJS Monorepo")
		.setDescription("集成了Casl 和 hbs模版")
		.setVersion("1.0")
		.addOAuth2()
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup("api/docs", app, document);

	await app.listen(port);
	Logger.log(
		`🚀 Application is running on: http://localhost:${port}/${prefix}`,
	);
}
bootstrap();
