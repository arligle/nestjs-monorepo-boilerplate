import { ResponseMessage } from "../app/app.response";
import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request, Response } from "express";
// biome-ignore lint/style/useImportType: <注意：装饰器不能使用 import type>
import { AuthBaseDto } from "../../dto/auth.dto";
// biome-ignore lint/style/useImportType: <注意：需要使用装饰器，以及存在注入机制，所以不能使用 import type>
import { AuthService } from "./auth.service";

@ApiTags("认证")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	/**
	 * 注册新用户。
	 *
	 * 参数：
	 * -`body {AuthBaseDto}`：包含电子邮件和密码的数据传输对象。
	 *
	 * 返回：
	 * -`201 {Promise<Response>}`：带有创建的用户数据的 HTTP 响应。
	 *
	 * @param {AuthBaseDto} body -包含电子邮件和密码的数据传输对象。
	 * @param {Request} req -Express 请求对象。
	 * @param {Response} res -Express 响应对象。
	 * @returns {Promise<Response>} -带有创建的用户数据的 HTTP 响应。
	 */
	@Post("register")
	@ApiOperation({ summary: '注册新用户' })
	@ResponseMessage('User created') // custom response message for interceptor
	signup(@Body() body: AuthBaseDto, @Req() req: Request, @Res() res: Response): Promise<Response> {
		return this.authService.userCreate(body, req, res);
	}

	/**
	 * 登录现有用户。
	 *
	 * 参数：
	 * -`body {AuthBaseDto}`：包含电子邮件和密码的数据传输对象。
	 *
	 * 返回：
	 * -`200 {Promise<Response>}`：带有 JWT 令牌的 HTTP 响应。
	 *
	 * @param {AuthBaseDto} body -包含电子邮件和密码的数据传输对象。
	 * @param {Request} req -Express 请求对象。
	 * @param {Response} res -Express 响应对象。
	 * @returns {Promise<Response>} -带有 JWT 令牌的 HTTP 响应。
	 */
	@Post("login")
	@ResponseMessage("User logged in")
	signin(@Body() body: AuthBaseDto, @Req() req: Request, @Res() res: Response): Promise<Response> {
		return this.authService.signin(body, req, res);
	}

	/**
	 * 注销当前用户。
	 *
	 * 返回：
	 * -`200 {Promise<Response>}`：确认用户已注销的 HTTP 响应。
	 *
	 * @param {Request} req -Express 请求对象。
	 * @param {Response} res -Express 响应对象。
	 * @returns {Promise<Response>} -确认用户已注销的 HTTP 响应。
	 */
	@Get("signout")
	signout(@Req() req: Request, @Res() res: Response): Promise<Response> {
		return this.authService.signout(req, res);
	}
}
