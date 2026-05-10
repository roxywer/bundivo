import { Controller, Post, Get, Body, Param, UseGuards, Request, Patch } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { MessagesService } from './messages.service'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator'

class SendMessageDto {
  @IsUUID() groupId: string
  @IsString() @IsNotEmpty() message: string
}

class ReplyMessageDto {
  @IsUUID() groupId: string
  @IsString() @IsNotEmpty() message: string
  @IsUUID() @IsOptional() replyToId?: string
}

class UpdateStatusDto {
  @IsString() @IsNotEmpty() status: string
  @IsString() @IsOptional() notes?: string
}

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private messages: MessagesService) {}

  @Post('to-admin')
  sendToAdmin(@Request() req: any, @Body() dto: SendMessageDto) {
    return this.messages.sendToAdmin(req.user.id, dto.groupId, dto.message)
  }

  @Post('reply')
  replyFromAdmin(@Request() req: any, @Body() dto: ReplyMessageDto) {
    return this.messages.replyFromAdmin(req.user.id, dto.groupId, dto.message, dto.replyToId)
  }

  @Get('inbox/admin')
  getAdminInbox(@Request() req: any) {
    return this.messages.getAdminInbox(req.user.id)
  }

  @Get('group/:groupId')
  getGroupMessages(@Request() req: any, @Param('groupId') groupId: string) {
    return this.messages.getGroupMessages(req.user.id, groupId)
  }

  @Patch(':messageId/read')
  markAsRead(@Request() req: any, @Param('messageId') messageId: string) {
    return this.messages.markAsRead(messageId, req.user.id)
  }

  @Post('group/:groupId/status')
  updatePurchaseStatus(
    @Request() req: any,
    @Param('groupId') groupId: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.messages.updatePurchaseStatus(req.user.id, groupId, dto.status, dto.notes)
  }
}
