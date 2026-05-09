import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            group: { select: { id: true, name: true, status: true, subscriptionType: true } },
          },
        },
        _count: { select: { payments: true, groupsOwned: true } },
      },
    })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async updateProfile(userId: string, data: { fullName?: string; email?: string; avatar?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    })
  }
}
