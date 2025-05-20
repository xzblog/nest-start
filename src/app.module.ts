import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './modules/accounts/accounts.module';
import { RolesModule } from './modules/roles/roles.module';
import { PrismaModule } from './common/providers/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation-schema';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema, // 添加校验Schema
      validationOptions: {
        allowUnknown: true, // 允许存在未在校验Schema中定义的变量
        abortEarly: false, // 收集所有错误后再抛出，而不是遇到第一个错误就终止
      },
    }
    ),
    PrismaModule,
    AccountsModule,
    RolesModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
