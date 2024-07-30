import { Controller, Get, Render } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
// import { AppService } from './app.service';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) { }
  @Get()
  @Render("index")
  home() {
    return { message: "这是一个内部使用的模版项目" };
  }
  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
}
