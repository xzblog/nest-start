import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './modules/accounts/accounts.module';
import { RolesModule } from './modules/roles/roles.module';
import { PrismaModule } from './providers/prisma/prisma.module';
@Module({
  imports: [PrismaModule, AccountsModule, RolesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
