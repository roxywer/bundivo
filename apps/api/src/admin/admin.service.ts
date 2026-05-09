import { Injectable, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RealtimeGateway } from '../realtime/realtime.gateway'

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private realtime: RealtimeGateway,
  ) {}

  private async assertAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (user?.role !== 'ADMIN') throw new ForbiddenException('Admin access required')
  }

  async getStats(userId: string) {
    await this.assertAdmin(userId)

    const [totalUsers, totalGroups, activeGroups, fundedGroups, revenue, failedPayments, pendingGroups] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.group.count(),
        this.prisma.group.count({ where: { status: 'ACTIVE' } }),
        this.prisma.group.count({ where: { status: 'FUNDED' } }),
        this.prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
        this.prisma.payment.count({ where: { status: 'FAILED' } }),
        this.prisma.group.count({ where: { status: 'FORMING' } }),
      ])

    return {
      totalUsers,
      totalGroups,
      activeGroups,
      fundedGroups,
      totalRevenue: revenue._sum.amount || 0,
      failedPayments,
      pendingActivations: fundedGroups,
      pendingGroups,
    }
  }

  async getAllUsers(userId: string, page = 1, limit = 20) {
    await this.assertAdmin(userId)
    const skip = (page - 1) * limit
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { memberships: true, payments: true } } },
      }),
      this.prisma.user.count(),
    ])
    return { users, total, page, limit }
  }

  async getAllGroups(userId: string, page = 1, limit = 20) {
    await this.assertAdmin(userId)
    const skip = (page - 1) * limit
    const [groups, total] = await Promise.all([
      this.prisma.group.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: { select: { id: true, fullName: true, phone: true } },
          _count: { select: { members: true } },
        },
      }),
      this.prisma.group.count(),
    ])
    return { groups, total, page, limit }
  }

  async getAllPayments(userId: string, page = 1, limit = 20) {
    await this.assertAdmin(userId)
    const skip = (page - 1) * limit
    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, fullName: true, phone: true } },
          group: { select: { id: true, name: true } },
        },
      }),
      this.prisma.payment.count(),
    ])
    return { payments, total, page, limit }
  }

  async activateGroup(userId: string, groupId: string) {
    await this.assertAdmin(userId)
    const group = await this.prisma.group.update({
      where: { id: groupId },
      data: { status: 'ACTIVE' },
    })
    this.realtime.emitToGroup(groupId, 'group_activated', {
      groupId,
      message: 'Your group has been activated! Check your email for the Spotify invite.',
      status: 'ACTIVE',
    })
    return group
  }

  async promoteUser(userId: string, targetId: string) {
    await this.assertAdmin(userId)
    return this.prisma.user.update({
      where: { id: targetId },
      data: { role: 'ADMIN' },
    })
  }

  async getAllSubscriptions(userId: string, page = 1, limit = 20) {
    await this.assertAdmin(userId)
    const skip = (page - 1) * limit
    const [subscriptions, total] = await Promise.all([
      this.prisma.subscription.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          group: { select: { id: true, name: true, subscriptionType: true, status: true, _count: { select: { members: true } } } },
        },
      }),
      this.prisma.subscription.count(),
    ])
    return { subscriptions, total, page, limit }
  }

  async updateSubscription(userId: string, subscriptionId: string, status: string) {
    await this.assertAdmin(userId)
    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: status as any },
    })
  }
}
