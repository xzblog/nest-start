import {
  IsArray,
  IsDateString,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  Length,
  MinLength
} from 'class-validator';

export class CreateAccountDto {
  @Length(5, 10, { message: 'userName长度应在5到10个字符之间' })
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly nickname: string;

  @IsNotEmpty()
  @MinLength(6, { message: '密码长度应大于6位' })
  readonly password: string;

  @IsMobilePhone('zh-CN')
  readonly telephone?: string;

  @IsEmail()
  readonly email?: string;

  @IsString()
  readonly position?: string;

  @IsArray()
  readonly roleIds?: number[];
}
