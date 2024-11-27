import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/providers/prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRoleDto: Prisma.RoleCreateInput): Promise<Role> {
    return this.prisma.role.create({
      data: createRoleDto
    });
  }

  findAll(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  findOne(id: number): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { id }
    });
  }

  update(id: number, updateRoleDto: Prisma.RoleUpdateInput): Promise<Role> {
    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto
    });
  }

  remove(id: number): Promise<Role> {
    return this.prisma.role.delete({
      where: { id }
    });
  }
}
