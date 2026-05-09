import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

@Injectable()
export class SupabaseService {
  private client: SupabaseClient

  constructor(private config: ConfigService) {
    this.client = createClient(
      config.get('SUPABASE_URL')!,
      config.get('SUPABASE_ANON_KEY')!,
    )
  }

  getClient(): SupabaseClient {
    return this.client
  }

  async sendOtp(phone: string): Promise<{ error: any }> {
    const { error } = await this.client.auth.signInWithOtp({ phone })
    return { error }
  }

  async verifyOtp(phone: string, token: string): Promise<{ data: any; error: any }> {
    const { data, error } = await this.client.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    })
    return { data, error }
  }
}
