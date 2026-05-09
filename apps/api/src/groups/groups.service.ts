import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { randomBytes } from 'crypto'

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async createGroup(userId: string, data: {
    name: string
    subscriptionType: string
    maxMembers: number
    targetAmount: number
  }) {
    const inviteToken = randomBytes(4).toString('hex').toUpperCase()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const group = await this.prisma.group.create({
      data: {
        name: data.name,
        subscriptionType: data.subscriptionType,
        maxMembers: data.maxMembers,
        targetAmount: data.targetAmount,
        ownerId: userId,
        members: {
          create: { userId, role: 'OWNER', paymentStatus: 'PENDING' },
        },
        invitations: {
          create: { inviteToken, expiresAt },
        },
      },
      include: {
        members: { include: { user: { select: { id: true, fullName: true, phone: true, avatar: true } } } },
        invitations: { where: { usedAt: null } },
      },
    })

    return group
  }

  async getMyGroups(userId: string) {
    return this.prisma.group.findMany({
      where: { members: { some: { userId } } },
      include: {
        members: { include: { user: { select: { id: true, fullName: true, avatar: true } } } },
        invitations: { where: { usedAt: null, expiresAt: { gt: new Date() } }, take: 1 },
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getGroup(groupId: string, userId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        owner: { select: { id: true, fullName: true, avatar: true } },
        members: { include: { user: { select: { id: true, fullName: true, avatar: true, phone: true } } } },
        payments: { orderBy: { createdAt: 'desc' } },
        invitations: { where: { usedAt: null, expiresAt: { gt: new Date() } }, take: 1 },
      },
    })

    if (!group) throw new NotFoundException('Group not found')
    const isMember = group.members.some((m) => m.userId === userId)
    if (!isMember) throw new ForbiddenException('Not a member of this group')

    return group
  }

  async joinByInvite(token: string, userId: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { inviteToken: token },
      include: { group: { include: { members: true } } },
    })

    if (!invitation) throw new NotFoundException('Invalid invite link')
    if (invitation.usedAt) throw new BadRequestException('Invite link already used')
    if (invitation.expiresAt < new Date()) throw new BadRequestException('Invite link has expired')

    const { group } = invitation
    if (group.members.length >= group.maxMembers) throw new BadRequestException('Group is full')
    const alreadyMember = group.members.some((m) => m.userId === userId)
    if (alreadyMember) throw new BadRequestException('Already a member of this group')

    const [, updatedGroup] = await this.prisma.$transaction([
      this.prisma.groupMember.create({ data: { userId, groupId: group.id, role: 'MEMBER' } }),
      this.prisma.invitation.update({ where: { id: invitation.id }, data: { usedAt: new Date() } }),
    ])

    return this.getGroup(group.id, userId)
  }

  async generateNewInvite(groupId: string, userId: string) {
    const group = await this.prisma.group.findUnique({ where: { id: groupId } })
    if (!group) throw new NotFoundException('Group not found')
    if (group.ownerId !== userId) throw new ForbiddenException('Only owner can generate invite links')

    const inviteToken = randomBytes(4).toString('hex').toUpperCase()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    return this.prisma.invitation.create({ data: { groupId, inviteToken, expiresAt } })
  }
}
