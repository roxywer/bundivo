import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async sendToAdmin(senderId: string, groupId: string, content: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { members: { where: { userId: senderId } } },
    })

    if (!group) throw new NotFoundException('Group not found')
    if (group.members.length === 0) {
      throw new ForbiddenException('You must be a member of this group to send messages')
    }

    // Update group purchase status when first contact is made
    if (group.purchaseStatus === 'NOT_CONTACTED') {
      await this.prisma.group.update({
        where: { id: groupId },
        data: { purchaseStatus: 'CONTACTED' },
      })
    }

    const message = await this.prisma.message.create({
      data: {
        senderId,
        groupId,
        content,
        type: 'USER_TO_ADMIN',
        status: 'UNREAD',
      },
      include: {
        sender: { select: { id: true, fullName: true, email: true } },
        group: { select: { id: true, name: true, subscriptionType: true } },
      },
    })

    return message
  }

  async replyFromAdmin(adminId: string, groupId: string, content: string, messageId?: string) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } })
    if (admin?.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can send replies')
    }

    const group = await this.prisma.group.findUnique({ where: { id: groupId } })
    if (!group) throw new NotFoundException('Group not found')

    // If replying to a specific message, mark it as replied
    if (messageId) {
      await this.prisma.message.update({
        where: { id: messageId },
        data: { status: 'REPLIED' },
      })
    }

    const message = await this.prisma.message.create({
      data: {
        senderId: adminId,
        groupId,
        content,
        type: 'ADMIN_TO_USER',
        status: 'READ',
      },
      include: {
        sender: { select: { id: true, fullName: true, email: true } },
        group: { select: { id: true, name: true } },
      },
    })

    return message
  }

  async getGroupMessages(userId: string, groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { members: { where: { userId } } },
    })

    if (!group) throw new NotFoundException('Group not found')
    if (group.members.length === 0) {
      throw new ForbiddenException('You must be a member of this group to view messages')
    }

    const messages = await this.prisma.message.findMany({
      where: { groupId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, fullName: true, email: true, role: true } },
      },
    })

    return messages
  }

  async getAdminInbox(adminId: string) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } })
    if (admin?.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can access the inbox')
    }

    // Get all groups with unread messages, ordered by most recent message
    const groups = await this.prisma.group.findMany({
      where: {
        messages: {
          some: { type: 'USER_TO_ADMIN' },
        },
      },
      include: {
        messages: {
          where: { type: 'USER_TO_ADMIN' },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: { select: { id: true, fullName: true, email: true } },
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                type: 'USER_TO_ADMIN',
                status: 'UNREAD',
              },
            },
          },
        },
        members: {
          include: {
            user: { select: { id: true, fullName: true, email: true } },
          },
        },
        owner: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: {
        messages: {
          _max: {
            createdAt: 'desc',
          },
        },
      },
    })

    return groups.map((g) => ({
      ...g,
      unreadCount: g._count.messages,
      lastMessage: g.messages[0],
    }))
  }

  async markAsRead(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: { group: { include: { members: { where: { userId } } } } },
    })

    if (!message) throw new NotFoundException('Message not found')
    if (message.group.members.length === 0) {
      throw new ForbiddenException('You do not have access to this message')
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { status: 'READ' },
    })
  }

  async updatePurchaseStatus(adminId: string, groupId: string, status: string, notes?: string) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } })
    if (admin?.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update purchase status')
    }

    const updateData: any = { purchaseStatus: status }
    if (notes) updateData.adminNotes = notes

    return this.prisma.group.update({
      where: { id: groupId },
      data: updateData,
    })
  }
}
