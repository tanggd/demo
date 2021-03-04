import { Controller, Get, Inject, Post, Provide, Query } from '@midwayjs/decorator';
import { Context } from 'egg';
import { UserService } from '../service/user';

@Provide()
// @Controller('/api')
@Controller('/nacos.provide.nodejs.test')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/getUser')
  @Post('/get_user')
  async getUser(@Query() uid) {
    const user = await this.userService.getUser({ uid });
    return {
      code: 200,
      success: true,
      message: 'OK',
      data: user
    };
  }
}
