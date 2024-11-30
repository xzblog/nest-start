import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { basicAuthOptions, generateSwaggerApi } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 参数校验
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 会自动删除未列入白名单的属性（验证类中没有使用装饰器的属性）
      forbidNonWhitelisted: true, // 当传入了一个没有声明的参数，会抛出异常，而不是自动删除，结合whitelist使用
      transform: false, // 自动转换参数类型，例如将字符串转换为数字
      disableErrorMessages: process.env.NODE_ENV === 'production' // 生产环境不提示具体的错误信息
    })
  );

  app.setGlobalPrefix('api');
  generateSwaggerApi(app, {
    route: 'api-doc',
    title: '接口文档',
    description: '接口文档',
    version: 'v1.0.0'
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
