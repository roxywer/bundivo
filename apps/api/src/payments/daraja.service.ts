import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'

@Injectable()
export class DarajaService {
  private readonly baseUrl: string

  constructor(private config: ConfigService) {
    this.baseUrl = config.get('DARAJA_ENVIRONMENT') === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke'
  }

  async getToken(): Promise<string> {
    const key = this.config.get('DARAJA_CONSUMER_KEY')
    const secret = this.config.get('DARAJA_CONSUMER_SECRET')
    const credentials = Buffer.from(`${key}:${secret}`).toString('base64')

    const { data } = await axios.get(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${credentials}` },
    })

    return data.access_token
  }

  async stkPush(params: {
    phone: string
    amount: number
    accountRef: string
    description: string
  }) {
    const token = await this.getToken()
    const shortcode = this.config.get('DARAJA_SHORTCODE')
    const passkey = this.config.get('DARAJA_PASSKEY')
    const callbackUrl = this.config.get('DARAJA_CALLBACK_URL')

    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

    const phone = params.phone.replace(/^\+/, '').replace(/^0/, '254')

    try {
      const { data } = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.ceil(params.amount),
          PartyA: phone,
          PartyB: shortcode,
          PhoneNumber: phone,
          CallBackURL: callbackUrl,
          AccountReference: params.accountRef,
          TransactionDesc: params.description,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      return data
    } catch (err: any) {
      throw new InternalServerErrorException(err?.response?.data?.errorMessage || 'STK push failed')
    }
  }
}
