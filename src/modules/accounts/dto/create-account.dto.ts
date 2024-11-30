import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsMobilePhone, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ description: '登录名', example: 'admin', required: true })
  @IsNotEmpty()
  @Length(5, 10, { message: 'userName长度应在5到10个字符之间' })
  readonly username: string;

  @ApiProperty({ description: '昵称', example: '管理员', required: false })
  @IsNotEmpty()
  @IsString()
  readonly nickname: string;

  @ApiProperty({ description: '密码', example: 'Abc123456', required: true })
  @IsNotEmpty()
  @MinLength(6, { message: '密码长度应大于6位' })
  readonly password: string;

  @ApiProperty({ description: '手机号', example: '13800138000', required: false })
  @IsMobilePhone('zh-CN')
  readonly telephone?: string;

  @ApiProperty({ description: '邮箱', example: 'admin.example.com', required: false })
  @IsEmail()
  readonly email?: string;

  @ApiProperty({ description: '职位', example: '管理员', required: false })
  @IsString()
  readonly position?: string;

  @ApiProperty({ description: '角色IDS', example: [1, 2], required: true })
  @IsArray()
  readonly roleIds: number[];
}
