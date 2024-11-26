import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, ParseArrayPipe } from '@nestjs/common';
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

  @Get('delete')
  deleteByIds(@Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[]) {
    return `Del users ${ids}`;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Account | null> {
    console.log(id, id);
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto): Promise<Account> {
    return this.accountsService.update(Number(id), updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Account> {
    return this.accountsService.remove(id);
  }
}
