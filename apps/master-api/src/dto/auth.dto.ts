import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Length,
	Matches,
} from "class-validator";


export class AuthBaseDto {
	/**
	 * - User's email address
	 * - Must be a valid email address
	 * @example "user@example.com"
	 */

	@IsNotEmpty()
	@IsString()
	@IsEmail()
	public readonly email: string;

	/**
	 * - User's password
	 * - Must be between 8 and 64 characters
	 * - Must contain at least one uppercase letter, one lowercase letter, and one number or special character
	 * @example "Secure!123, Passw0rd#, Pass word1!"
	 */
	@IsNotEmpty()
	@IsString()
	@Length(8, 64, { message: "密码必须介于 8 到 64 个字符之间" })
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			"密码太弱。它必须至少包含 1 个大写字母、1 个小写字母和 1 个数字或特殊字符。",
	})
	public readonly password: string;
}
