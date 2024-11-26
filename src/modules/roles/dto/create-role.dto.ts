import { IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly key: string;

  @IsString()
  readonly remark: string;
}
