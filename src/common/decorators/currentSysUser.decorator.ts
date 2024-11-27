import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentSysUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  console.log(request.user, 'request.user');
  console.log(request.currentUser, 'request.currentUser');
  return request.user;
});
