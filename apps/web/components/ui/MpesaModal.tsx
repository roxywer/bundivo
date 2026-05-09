'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Smartphone, Loader2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { toast } from './Toast'

interface MpesaModalProps {
  open: boolean
  onClose: () => void
  groupId: string
  groupName: string
  amount: number
  onSuccess: () => void
}

type Step = 'confirm' | 'waiting' | 'success' | 'failed'

export function MpesaModal({ open, onClose, groupId, groupName, amount, onSuccess }: MpesaModalProps) {
  const [step, setStep] = useState<Step>('confirm')
  const [phone, setPhone] = useState('')
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [pollCount, setPollCount] = useState(0)

  useEffect(() => {
    if (!open) { setStep('confirm'); setPaymentId(null); setPollCount(0) }
  }, [open])

  useEffect(() => {
    if (step !== 'waiting' || !paymentId) return
    const interval = setInterval(async () => {
      try {
        const res = await api.get<{ status: string }>(`/payments/${paymentId}/status`)
        if (res.status === 'COMPLETED') {
          clearInterval(interval)
          setStep('success')
          toast.success('Payment confirmed!', 'Your M-Pesa payment was received.')
          setTimeout(() => { onSuccess(); onClose() }, 2000)
        } else if (res.status === 'FAILED') {
          clearInterval(interval)
          setStep('failed')
        }
      } catch {}
      setPollCount((c) => {
        if (c >= 18) { clearInterval(interval); setStep('failed') }
        return c + 1
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [step, paymentId])

  const initiate = async () => {
    if (!phone || phone.length < 9) {
      toast.error('Invalid phone', 'Enter a valid Safaricom number')
      return
    }
    setLoading(true)
    try {
      const res = await api.post<{ paymentId: string }>('/payments/initiate', { groupId, phone: `254${phone.replace(/^0/, '')}` })
      setPaymentId(res.paymentId)
      setStep('waiting')
    } catch (err: any) {
      toast.error('Payment failed', err.message || 'Could not initiate STK Push')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-md p-6 shadow-2xl z-10"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>

            {step === 'confirm' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/15 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Pay with M-Pesa</h2>
                    <p className="text-gray-400 text-sm">{groupName}</p>
                  </div>
                </div>

                <div className="bg-green-500/8 border border-green-500/15 rounded-2xl p-4 text-center">
                  <p className="text-gray-400 text-sm mb-1">Amount due</p>
                  <p className="text-4xl font-black text-white">{formatCurrency(amount)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Safaricom Number</label>
                  <div className="flex">
                    <div className="flex items-center bg-gray-800 border border-r-0 border-gray-700 rounded-l-xl px-3">
                      <span className="text-gray-400 text-sm font-mono">🇰🇪 +254</span>
                    </div>
                    <input
                      type="tel" placeholder="7XX XXX XXX"
                      value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-r-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                    />
                  </div>
                </div>

                <ul className="text-gray-500 text-xs space-y-1">
                  <li>• An STK Push will be sent to your phone</li>
                  <li>• Enter your M-Pesa PIN to confirm</li>
                  <li>• Do not close this screen until complete</li>
                </ul>

                <button onClick={initiate} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition shadow-lg shadow-green-500/25">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending STK Push…</> : <>Send M-Pesa Request</>}
                </button>
              </div>
            )}

            {step === 'waiting' && (
              <div className="text-center py-6 space-y-5">
                <div className="relative mx-auto w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-ping" />
                  <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center">
                    <Smartphone className="w-9 h-9 text-green-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">Check your phone</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">An M-Pesa STK Push has been sent to<br /><span className="text-white font-mono">+254 {phone}</span></p>
                  <p className="text-gray-500 text-xs mt-3">Enter your PIN to complete payment</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Waiting for confirmation…
                </div>
                <button onClick={() => setStep('confirm')} className="text-gray-500 hover:text-gray-300 text-sm transition flex items-center gap-1.5 mx-auto">
                  <RefreshCw className="w-3.5 h-3.5" /> Retry with different number
                </button>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-white font-bold text-xl">Payment Confirmed!</h3>
                <p className="text-gray-400 text-sm">{formatCurrency(amount)} received via M-Pesa</p>
              </div>
            )}

            {step === 'failed' && (
              <div className="text-center py-6 space-y-5">
                <div className="w-20 h-20 rounded-full bg-red-500/15 flex items-center justify-center mx-auto">
                  <XCircle className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-white font-bold text-xl">Payment Failed</h3>
                <p className="text-gray-400 text-sm">The payment was not completed. You can try again.</p>
                <button onClick={() => setStep('confirm')}
                  className="flex items-center gap-2 mx-auto bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold px-6 py-2.5 rounded-xl transition">
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
