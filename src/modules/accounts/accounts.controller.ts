import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  findAll(): Promise<Account[]> {
    return this.accountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Account | null> {
    return this.accountsService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto): Promise<Account> {
    return this.accountsService.update(Number(id), updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Account> {
    return this.accountsService.remove(Number(id));
  }
}
