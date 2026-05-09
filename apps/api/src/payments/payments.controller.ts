import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { PaymentsService } from './payments.service'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { IsString, IsNotEmpty } from 'class-validator'

export class InitiatePaymentDto {
  @IsString() @IsNotEmpty() groupId: string
}

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('initiate')
  initiate(@Request() req: any, @Body() dto: InitiatePaymentDto) {
    return this.payments.initiatePayment(req.user.id, dto.groupId)
  }

  @Post('mpesa/callback')
  callback(@Body() body: any) {
    return this.payments.handleCallback(body)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyPayments(@Request() req: any) {
    return this.payments.getMyPayments(req.user.id)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('group/:groupId')
  getGroupPayments(@Param('groupId') groupId: string) {
    return this.payments.getGroupPayments(groupId)
  }
}
