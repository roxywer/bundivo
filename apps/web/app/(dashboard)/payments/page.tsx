'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { SkeletonRow } from '@/components/ui/Skeleton'

interface Payment {
  id: string; amount: number; status: string; createdAt: string
  mpesaReceipt: string | null; group: { name: string; subscriptionType: string }
}

const statusConfig: Record<string, { icon: any; color: string; badge: string }> = {
  COMPLETED: { icon: CheckCircle2, color: 'text-green-400', badge: 'bg-green-500/15 text-green-400 border-green-500/20' },
  FAILED:    { icon: XCircle,       color: 'text-red-400',   badge: 'bg-red-500/15 text-red-400 border-red-500/20' },
  PENDING:   { icon: Clock,         color: 'text-yellow-400',badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
  PROCESSING:{ icon: Clock,         color: 'text-blue-400',  badge: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    api.get<Payment[]>('/payments/my').then(setPayments).finally(() => setLoading(false))
  }, [])

  const filters = ['ALL', 'COMPLETED', 'PENDING', 'FAILED']
  const filtered = filter === 'ALL' ? payments : payments.filter((p) => p.status === filter)
  const totalPaid = payments.filter((p) => p.status === 'COMPLETED').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <p className="text-gray-400 text-sm mt-0.5">Your M-Pesa transaction history</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Paid', value: formatCurrency(totalPaid), color: 'from-green-500 to-emerald-600' },
          { label: 'Transactions', value: payments.length, color: 'from-blue-500 to-cyan-600' },
          { label: 'Failed', value: payments.filter((p) => p.status === 'FAILED').length, color: 'from-red-500 to-rose-600' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-1">{s.label}</p>
            <p className={`text-2xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl">
        <div className="flex items-center gap-2 p-4 border-b border-gray-800">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === f ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="divide-y divide-gray-800">
            {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <CreditCard className="w-10 h-10 text-gray-700 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No payments found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filtered.map((p, i) => {
              const cfg = statusConfig[p.status] || statusConfig.PENDING
              const Icon = cfg.icon
              return (
                <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 p-4 hover:bg-gray-800/40 transition">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${p.status === 'COMPLETED' ? 'bg-green-500/15' : p.status === 'FAILED' ? 'bg-red-500/15' : 'bg-yellow-500/15'}`}>
                    <Icon className={`w-5 h-5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{p.group.name}</p>
                    <p className="text-gray-500 text-xs">{p.group.subscriptionType} · {formatDate(p.createdAt)}</p>
                    {p.mpesaReceipt && <p className="text-gray-600 text-xs font-mono mt-0.5">{p.mpesaReceipt}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white font-semibold">{formatCurrency(p.amount)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.badge}`}>{p.status}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
