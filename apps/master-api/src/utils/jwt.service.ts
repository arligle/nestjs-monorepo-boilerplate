import { tokenExpiresInSeconds, tokenSecret } from "../core/app/app.constants";
import { Injectable } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <explanation>
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtUtility {
	constructor(private readonly jwtService: JwtService) {}

	// sign JWT payload
	public sign(payload: Record<string, any>): Promise<string> {
		return this.jwtService.signAsync(payload, {
			secret: tokenSecret,
			expiresIn: tokenExpiresInSeconds,
			algorithm: "HS256",
		});
	}

	// verify JWT token
	public verify(token: string): Record<string, any> {
		try {
			return this.jwtService.verify(token);
		} catch (error) {
			// throw error if token is invalid
			throw new Error("Invalid token");
		}
	}
}
