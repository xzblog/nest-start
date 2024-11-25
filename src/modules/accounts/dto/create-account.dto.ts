export class CreateAccountDto {
  readonly username: string;

  readonly nickname: string;

  readonly telephone: string;

  readonly email: string;

  readonly position?: string;

  readonly roleIds?: number[];

  readonly password: string;
}
