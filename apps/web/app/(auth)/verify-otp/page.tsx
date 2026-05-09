'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'
import { OtpInput } from '@/components/ui/OtpInput'
import { toast } from '@/components/ui/Toast'

function VerifyOtpContent() {
  const router = useRouter()
  const params = useSearchParams()
  const phone = params.get('phone') || ''
  const setAuth = useAuthStore((s) => s.setAuth)

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  const handleVerify = async (code: string) => {
    if (code.length !== 6) return
    setLoading(true)
    try {
      const res = await api.post<{ accessToken: string; user: any; isNewUser: boolean }>(
        '/auth/verify-otp', { phone, token: code }
      )
      setAuth(res.user, res.accessToken)
      toast.success('Verified!', 'Welcome to Bundivo.')
      router.push(res.isNewUser ? '/complete-profile' : '/dashboard')
    } catch (err: any) {
      toast.error('Invalid OTP', err.message || 'Please check the code and try again.')
      setOtp('')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (val: string) => {
    setOtp(val)
    if (val.length === 6) handleVerify(val)
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await api.post('/auth/send-otp', { phone })
      toast.info('OTP resent', `A new code was sent to ${phone}`)
    } catch {
      toast.error('Failed to resend', 'Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-4 shadow-lg shadow-green-500/25">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Verify your number</h1>
          <p className="text-gray-400 mt-1 text-sm">Enter the 6-digit code sent to</p>
          <p className="text-green-400 font-medium text-sm mt-0.5">{phone}</p>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <OtpInput value={otp} onChange={handleOtpChange} disabled={loading} />
          </div>

          <button onClick={() => handleVerify(otp)} disabled={loading || otp.length !== 6}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-green-500/25">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : 'Verify OTP'}
          </button>

          <div className="flex items-center justify-between mt-5 text-sm">
            <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-500 hover:text-gray-300 transition">
              <ArrowLeft className="w-3 h-3" /> Change number
            </button>
            <button onClick={handleResend} disabled={resending} className="text-green-400 hover:text-green-300 transition disabled:opacity-50">
              {resending ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  )
}
