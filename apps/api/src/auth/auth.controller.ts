import { Controller, Post, Body, Patch, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt.guard'
import { IsString, IsNotEmpty, IsOptional, IsEmail, Length } from 'class-validator'

export class SendOtpDto {
  @IsString() @IsNotEmpty() phone: string
}

export class VerifyOtpDto {
  @IsString() @IsNotEmpty() phone: string
  @IsString() @Length(6, 6) token: string
}

export class CompleteProfileDto {
  @IsString() @IsNotEmpty() fullName: string
  @IsEmail() @IsOptional() email?: string
}

export class RegisterDto {
  @IsEmail() email: string
  @IsString() @IsNotEmpty() password: string
  @IsString() @IsNotEmpty() fullName: string
}

export class LoginDto {
  @IsEmail() email: string
  @IsString() @IsNotEmpty() password: string
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password, dto.fullName)
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password)
  }

  // OTP methods - dormant for now
  @Post('send-otp')
  sendOtp(@Body() dto: SendOtpDto) {
    return this.auth.sendOtp(dto.phone)
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.auth.verifyOtp(dto.phone, dto.token)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  completeProfile(@Request() req: any, @Body() dto: CompleteProfileDto) {
    return this.auth.completeProfile(req.user.id, dto)
  }
}
