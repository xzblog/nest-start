import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.auth.dto';
import { encrypt } from 'src/utils/helper';
import { PrismaService } from 'src/common/providers/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  // async validateUser(username: string, password: string): Promise<any> {
  //   const user = await this.accountsService.findByName(username);
  //   if (!user) {
  //     return null;
  //   }
  //   const { password: pass, salt, ...result } = user;
  //   const { password: encryptStr } = await encrypt(password, salt);
  //   console.log(encryptStr, 'encryptStr');
  //   return encryptStr === pass ? result : null;
  // }

  async validateUser(username: string, password: string) {
    const user = await this.prisma.account.findUnique({
      where: { username }
    });
    if (!user) {
      return null;
    }
    const { password: pass, salt, ...rest } = user;
    const { password: encryptStr } = await encrypt(password, salt);
    return encryptStr === pass ? rest : null;
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    const payload = { username: user.username, sub: user.id };
    return {
      ...user,
      accessToken: this.jwtService.sign(payload)
    };
  }
}
