import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, Account } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(createAccountDto: CreateAccountDto) {
    const { username, password, roleIds, ...rest } = createAccountDto;
    const existingAccount = await this.prisma.account.findUnique({
      where: { username }
    });

    if (existingAccount) {
      throw new ConflictException('用户已存在');
    }

    return this.prisma.account.create({
      data: {
        username: username,
        password: password,
        ...rest,
        roles: {
          create: roleIds.map((roleId) => ({
            roleId: roleId
          }))
        }
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.account.findMany({
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  findOne(id: number): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: {
        id: id
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  update(id: number, updateAccountDto: Prisma.AccountUpdateInput): Promise<Account> {
    return this.prisma.account.update({
      where: {
        id: id
      },
      data: updateAccountDto
    });
  }

  remove(id: number): Promise<Account> {
    return this.prisma.account.delete({
      where: {
        id: id
      }
    });
  }
}
