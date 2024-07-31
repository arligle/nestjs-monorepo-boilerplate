import { tokenSecret } from "../app/app.constants";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { UserAuthPayload } from "./auth.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				ExtractJwt.fromAuthHeaderAsBearerToken(), // 从标头中提取令牌
				JwtStrategy.extractTokenFromCookies, // 从 cookie 中提取令牌
			]),
			ignoreExpiration: false,
			secretOrKey: tokenSecret,
		});
	}

	private static extractTokenFromCookies(request: Request): string | null {
		if (!request?.cookies?.user_credentials) return null;

		return request.cookies.user_credentials;
	}

	async validate(payload: {
		id: string;
		email: string;
	}): Promise<UserAuthPayload> {
		return payload;
	}
}
