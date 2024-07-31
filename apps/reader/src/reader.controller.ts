import { Controller, Get } from "@nestjs/common";
// biome-ignore lint/style/useImportType: <受Nestjs机制约束，不能使用import type>
import { ReaderService } from "./reader.service";

@Controller()
export class ReaderController {
	constructor(private readonly readerService: ReaderService) {}

	@Get()
	getHello(): string {
		return this.readerService.getHello();
	}
}
