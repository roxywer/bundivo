import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { GroupsService } from './groups.service'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { IsString, IsNotEmpty, IsNumber, IsPositive, Min, Max } from 'class-validator'

export class CreateGroupDto {
  @IsString() @IsNotEmpty() name: string
  @IsString() @IsNotEmpty() subscriptionType: string
  @IsNumber() @Min(2) @Max(6) maxMembers: number
  @IsNumber() @IsPositive() targetAmount: number
}

@ApiTags('groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private groups: GroupsService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateGroupDto) {
    return this.groups.createGroup(req.user.id, dto)
  }

  @Get()
  getMyGroups(@Request() req: any) {
    return this.groups.getMyGroups(req.user.id)
  }

  @Get(':id')
  getGroup(@Param('id') id: string, @Request() req: any) {
    return this.groups.getGroup(id, req.user.id)
  }

  @Post('join/:token')
  joinByInvite(@Param('token') token: string, @Request() req: any) {
    return this.groups.joinByInvite(token, req.user.id)
  }

  @Post(':id/invite')
  generateInvite(@Param('id') id: string, @Request() req: any) {
    return this.groups.generateNewInvite(id, req.user.id)
  }
}
