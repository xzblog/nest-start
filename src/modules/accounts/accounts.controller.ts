import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentSysUser } from 'src/common/decorators/currentSysUser.decorator';
import { AccountEntity } from './entities/account.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('系统账户管理')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiOperation({ summary: '创建账户' })
  @ApiResponse({
    status: 201,
    description: '返回创建的账户信息',
    schema: {
      example: {
        username: 'admin',
        nickname: '管理员',
        telephone: '13800138000'
      }
    }
  })
  @Post()
  create(@Body() createAccountDto: CreateAccountDto): Promise<AccountEntity> {
    return this.accountsService.create(createAccountDto);
  }

  @ApiOperation({ summary: '获取账户列表' })
  @ApiResponse({
    status: 200,
    description: '返回账户列表',
    isArray: true
  })
  @Get()
  findAll(): Promise<AccountEntity[]> {
    return this.accountsService.findAll();
  }

  @ApiOperation({ summary: '获取当前登录用户信息' })
  @Get('currentUser')
  getCurrentUser(@CurrentSysUser() account: any): Promise<AccountEntity | null> {
    return this.accountsService.findOne(account.id);
  }

  @ApiOperation({ summary: '根据ID获取账户详情' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<AccountEntity | null> {
    console.log(id, id);
    return this.accountsService.findOne(id);
  }

  @ApiOperation({ summary: '更新账户信息' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto): Promise<AccountEntity> {
    return this.accountsService.update(Number(id), updateAccountDto);
  }

  @ApiOperation({ summary: '删除账户' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<AccountEntity> {
    return this.accountsService.remove(id);
  }
}
