import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateAccountDto } from './dto/create-account.dto';
import { PrismaService } from 'src/common/providers/prisma/prisma.service';
import { encrypt } from 'src/utils/helper';

const selectAccountData = {
  id: true,
  username: true,
  nickname: true,
  telephone: true,
  email: true,
  position: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  roles: {
    include: {
      role: true
    }
  },
  salt: false,
  password: false
};

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

    const { password: encryptPassword, salt } = await encrypt(password);
    console.log(encryptPassword, salt);
    return this.prisma.account.create({
      data: {
        username,
        password: encryptPassword,
        salt,
        ...rest,
        roles: {
          create: roleIds.map(roleId => ({
            roleId: roleId
          }))
        }
      },
      select: selectAccountData
    });
  }

  async findAll() {
    return this.prisma.account.findMany({
      select: selectAccountData
    });
  }

  findOne(id: number) {
    return this.prisma.account.findUnique({
      where: {
        id: id
      },
      select: selectAccountData
    });
  }

  update(id: number, updateAccountDto: Prisma.AccountUpdateInput) {
    return this.prisma.account.update({
      where: {
        id: id
      },
      data: updateAccountDto
    });
  }

  remove(id: number) {
    return this.prisma.account.delete({
      where: {
        id: id
      }
    });
  }
}
