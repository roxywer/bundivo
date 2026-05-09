import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import { SupabaseService } from './supabase.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private supabase: SupabaseService,
  ) {}

  async sendOtp(phone: string) {
    const normalized = this.normalizePhone(phone)
    const { error } = await this.supabase.sendOtp(normalized)
    if (error) throw new BadRequestException(error.message)
    return { message: 'OTP sent successfully' }
  }

  async verifyOtp(phone: string, token: string) {
    const normalized = this.normalizePhone(phone)
    const { data, error } = await this.supabase.verifyOtp(normalized, token)
    if (error) throw new UnauthorizedException('Invalid or expired OTP')

    let user = await this.prisma.user.findUnique({ where: { phone: normalized } })
    if (!user) {
      user = await this.prisma.user.create({ data: { phone: normalized } })
    }

    const accessToken = this.jwt.sign({ sub: user.id, phone: user.phone })
    return { accessToken, user, isNewUser: !user.fullName }
  }

  async completeProfile(userId: string, data: { fullName: string; email?: string }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { fullName: data.fullName, email: data.email },
    })
    return user
  }

  private normalizePhone(phone: string): string {
    const cleaned = phone.replace(/\s+/g, '').replace(/^0/, '+254').replace(/^\+?254/, '+254')
    return cleaned
  }
}
