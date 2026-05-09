import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AdminService } from './admin.service'
import { JwtAuthGuard } from '../auth/jwt.guard'

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('stats')
  getStats(@Request() req: any) {
    return this.admin.getStats(req.user.id)
  }

  @Get('users')
  getUsers(@Request() req: any, @Query('page') page = '1', @Query('limit') limit = '20') {
    return this.admin.getAllUsers(req.user.id, +page, +limit)
  }

  @Get('groups')
  getGroups(@Request() req: any, @Query('page') page = '1', @Query('limit') limit = '20') {
    return this.admin.getAllGroups(req.user.id, +page, +limit)
  }

  @Get('payments')
  getPayments(@Request() req: any, @Query('page') page = '1', @Query('limit') limit = '20') {
    return this.admin.getAllPayments(req.user.id, +page, +limit)
  }

  @Post('groups/:id/activate')
  activateGroup(@Request() req: any, @Param('id') id: string) {
    return this.admin.activateGroup(req.user.id, id)
  }

  @Post('users/:id/promote')
  promoteUser(@Request() req: any, @Param('id') id: string) {
    return this.admin.promoteUser(req.user.id, id)
  }

  @Get('subscriptions')
  getSubscriptions(@Request() req: any, @Query('page') page = '1', @Query('limit') limit = '20') {
    return this.admin.getAllSubscriptions(req.user.id, +page, +limit)
  }

  @Patch('subscriptions/:id')
  updateSubscription(@Request() req: any, @Param('id') id: string, @Body() body: { status: string }) {
    return this.admin.updateSubscription(req.user.id, id, body.status)
  }
}
