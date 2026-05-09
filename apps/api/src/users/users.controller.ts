import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { IsString, IsOptional, IsEmail } from 'class-validator'

export class UpdateProfileDto {
  @IsString() @IsOptional() fullName?: string
  @IsEmail() @IsOptional() email?: string
  @IsString() @IsOptional() avatar?: string
}

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  getMe(@Request() req: any) {
    return this.users.getMe(req.user.id)
  }

  @Patch('me')
  updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(req.user.id, dto)
  }
}
