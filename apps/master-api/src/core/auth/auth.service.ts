import { tokenExpiresInDate } from "../app/app.constants";
import { CustomResponse } from "../app/app.response";
import {
	createInDatabase,
	existsInDatabase,
} from "../drizzle/db-access-methods";
// biome-ignore lint/style/useImportType: <explanation>
import { DrizzleService } from "../drizzle/drizzle.service";
import { drizzleSchema } from "@aio/data-modeling/drizzle-schema/aiodb-schema";
import {
	ConflictException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { comparePassword, hashPassword } from "../../utils/hash.password";
// biome-ignore lint/style/useImportType: <explanation>
import { JwtUtility } from "../../utils/jwt.service";
import type { AuthBaseDto } from "../../dto/auth.dto";
// import { drizzle } from 'drizzle-orm/node-postgres';

@Injectable()
export class AuthService {
	constructor(
		private readonly databaseService: DrizzleService,
		private readonly jwtService: JwtUtility,
	) { }

	db = this.databaseService.database;

	/**
	 * 通过检查用户是否已经存在来注册新用户，
	 * 对密码进行哈希处理，并将用户保存到数据库中。
	 *
	 * @param {AuthBaseDto} body -包含电子邮件和密码的数据传输对象。
	 * @param {Request} req -Express 请求对象。
	 * @param {Response} res -Express 响应对象。
	 * @returns {Promise<Response>} -带有创建的用户数据的 HTTP 响应。
	 * @throws {ConflictException} -如果用户已存在于数据库中。
	 */
	async userCreate(body: AuthBaseDto, req: Request, res: Response): responseT {
		const { email, password } = body;
		console.log(body.password)

		// 检查用户是否存在
		const userExists: boolean = await existsInDatabase({
			column: "email",
			database: this.db,
			table: drizzleSchema.users,
			value: email,
		});

		// 如果用户存在，则抛出错误
		if (userExists) throw new ConflictException("User already exists");

		// 密码哈希
		const hashedPassword = await hashPassword(password, 12);

		// 在数据库中创建用户
		const user = await createInDatabase({
			database: this.db,
			table: drizzleSchema.users,
			values: { email, password: hashedPassword },
		});

		// 创建并返回响应
		const response = CustomResponse({
			data: {
				id: user.id as string,
				email: user.email as string,
			},
			message: "user created",
			path: req.path,
			statusCode: HttpStatus.CREATED,
		});
		return res.status(response.statusCode).json(response);
	}

	/**
	 * 通过验证凭据并生成 JWT 令牌来登录用户。
	 *
	 * @param {AuthBaseDto} body -包含电子邮件和密码的数据传输对象。
	 * @param {Request} req -Express 请求对象。
	 * @param {Response} res -Express 响应对象。
	 * @returns {Promise<Response>} -带有 JWT 令牌的 HTTP 响应。
	 * @throws {UnauthorizedException} -如果凭据无效。
	 * @throws {InternalServerErrorException} -如果令牌生成失败。
	 */
	async signin(body: AuthBaseDto, req: Request, res: Response): responseT {
		const { email, password } = body;

		// 检查用户是否存在
		const userExists: any = await existsInDatabase({
			column: "email",
			database: this.db,
			table: drizzleSchema.users,
			value: email,
		});

		// 如果用户不存在，则抛出错误
		if (!userExists) throw new UnauthorizedException("邮箱匹配失败!");

		// 从数据库获取用户详细信息
		const { id: userId, email: userEmail, password: userPassword } = userExists;

		// 比较密码
		const isMatch = await comparePassword(password, userPassword as string);
		// 如果密码不匹配，则抛出错误
		if (!isMatch) throw new UnauthorizedException("密码匹配失败！");

		// 生成 JWT 令牌
		const payload = { id: userId, email: userEmail };
		const token = await this.jwtService.sign(payload);

		// 如果没有生成token，则抛出错误
		if (!token)
			throw new InternalServerErrorException("Failed to generate token");

		// 在 cookie 中设置 JWT 令牌
		res.cookie("user_credentials", token, {
			httpOnly: true,
			secure: true,
			expires: tokenExpiresInDate,
		});

		// set jwt in headers
		res.setHeader("Authorization", `Bearer ${token}`);

		// 创建并返回响应
		const response = CustomResponse({
			data: token,
			message: "user logged in",
			path: req.path,
			statusCode: HttpStatus.OK,
		});
		return res.status(response.statusCode).json(response);
	}

	/**
	 * 通过清除身份验证 cookie 并删除授权标头来注销用户。
	 *
	 * @param {Request} req -Express 请求对象。
	 * @param {Response} res -Express 响应对象。
	 * @returns {Promise<Response>} -确认用户已注销的 HTTP 响应。
	 */
	async signout(req: Request, res: Response): responseT {
		res.clearCookie("user_credentials"); // 清除 cookie 中的 jwt 令牌
		res.setHeader("Authorization", ""); // clear jwt token in headers

		// 创建并返回响应
		const response = CustomResponse({
			data: null,
			message: "user logged out",
			path: req.path,
			statusCode: HttpStatus.OK,
		});
		return res.status(response.statusCode).json(response);
	}
}

type responseT = Promise<Response<any, Record<string, any>>>;
