import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { DarajaService } from './daraja.service'
import { RealtimeGateway } from '../realtime/realtime.gateway'

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private daraja: DarajaService,
    private realtime: RealtimeGateway,
  ) {}

  async initiatePayment(userId: string, groupId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('User not found')

    const group = await this.prisma.group.findUnique({ where: { id: groupId } })
    if (!group) throw new NotFoundException('Group not found')
    if (group.status === 'ACTIVE') throw new BadRequestException('Group is already active')

    const member = await this.prisma.groupMember.findUnique({
      where: { userId_groupId: { userId, groupId } },
    })
    if (!member) throw new BadRequestException('Not a member of this group')
    if (member.paymentStatus === 'COMPLETED') throw new BadRequestException('Payment already completed')

    const amountPerMember = group.targetAmount / group.maxMembers

    const payment = await this.prisma.payment.create({
      data: { userId, groupId, amount: amountPerMember, status: 'PROCESSING' },
    })

    const stkResult = await this.daraja.stkPush({
      phone: user.phone,
      amount: amountPerMember,
      accountRef: `BUNDIVO-${group.id.slice(0, 8).toUpperCase()}`,
      description: `Payment for ${group.name}`,
    })

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        merchantRequestId: stkResult.MerchantRequestID,
        checkoutRequestId: stkResult.CheckoutRequestID,
      },
    })

    return { payment, stkResult }
  }

  async handleCallback(body: any) {
    const result = body?.Body?.stkCallback
    if (!result) return { message: 'Invalid callback' }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = result

    const payment = await this.prisma.payment.findFirst({
      where: { checkoutRequestId: CheckoutRequestID },
    })
    if (!payment) return { message: 'Payment not found' }

    // Prevent duplicate processing
    if (payment.status === 'COMPLETED') return { message: 'Already processed' }

    if (ResultCode !== 0) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      })
      await this.prisma.groupMember.update({
        where: { userId_groupId: { userId: payment.userId, groupId: payment.groupId } },
        data: { paymentStatus: 'FAILED' },
      })
      return { message: ResultDesc }
    }

    const items: any[] = CallbackMetadata?.Item || []
    const mpesaReceipt = items.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value
    const amount = items.find((i: any) => i.Name === 'Amount')?.Value

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED', mpesaReceipt, amount: amount ?? payment.amount },
      })

      await tx.groupMember.update({
        where: { userId_groupId: { userId: payment.userId, groupId: payment.groupId } },
        data: { paymentStatus: 'COMPLETED' },
      })

      const group = await tx.group.update({
        where: { id: payment.groupId },
        data: { currentAmount: { increment: amount ?? payment.amount } },
        include: { members: true },
      })

      const allPaid = group.members.every((m) => m.paymentStatus === 'COMPLETED')
      if (allPaid) {
        await tx.group.update({
          where: { id: group.id },
          data: { status: 'FUNDED' },
        })
      }

      this.realtime.emitToUser(payment.userId, 'payment_confirmed', {
        paymentId: payment.id,
        groupId: payment.groupId,
        amount: amount ?? payment.amount,
        mpesaReceipt,
        status: 'COMPLETED',
      })

      this.realtime.emitToGroup(payment.groupId, 'group_progress', {
        groupId: payment.groupId,
        currentAmount: group.currentAmount + (amount ?? payment.amount),
        targetAmount: group.targetAmount,
        membersCount: group.members.filter((m) => m.paymentStatus === 'COMPLETED').length,
        totalMembers: group.members.length,
        status: allPaid ? 'FUNDED' : group.status,
      })

      if (allPaid) {
        this.realtime.emitToGroup(payment.groupId, 'group_funded', {
          groupId: payment.groupId,
          message: 'All members have paid! Your group is now funded.',
        })
      }
    })

    return { message: 'Payment processed successfully' }
  }

  async getMyPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      include: { group: { select: { name: true, subscriptionType: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async getGroupPayments(groupId: string) {
    return this.prisma.payment.findMany({
      where: { groupId },
      include: { user: { select: { id: true, fullName: true, phone: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }
}
