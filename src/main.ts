import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 会自动删除未列入白名单的属性（验证类中没有使用装饰器的属性）
      forbidNonWhitelisted: true, // 当传入了一个没有声明的参数，会抛出异常，而不是自动删除，结合whitelist使用
      transform: false, // 自动转换参数类型，例如将字符串转换为数字
      disableErrorMessages: process.env.NODE_ENV === 'production' // 生产环境不提示具体的错误信息
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
