import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
// biome-ignore lint/style/useImportType: <受Nestjs机制约束，不能使用import type>
import { UsersService } from "./users.service";
@ApiTags("用户")
@Controller("users")
export class UsersController {
	constructor(private usersService: UsersService) { }
	/**
	 * 从数据库中检索所有用户。
	 *
	 * @returns {Promise<any[]>} -解析为用户对象数组的Promise。
	 */
	@Get()
	async findAll(): Promise<any[]> {
		return await this.usersService.findAll();
	}
}
