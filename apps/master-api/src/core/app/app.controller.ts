import { Controller, Get, Render } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
@ApiTags("首页")
@Controller()
export class AppController {
  // constructor() { }

  @Get()
  @Render("index")
  home() {
    return { message: "这是一个内部使用的模版项目" };
  }
  // TODO:
  // @UseGuards(SignupDisableGuard)
  // @UseGuards(FirstUserSignupDisableGuard)
  // @Post('signup')
  // async signup(@Body() appSignUpDto: AppSignupDto, @Res({ passthrough: true }) response: Response) {
  //   return this.authService.signup(appSignUpDto, response);
  // }
}
