'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Payment {
  id: string; amount: number; status: string; createdAt: string; mpesaReceipt: string | null
  user: { fullName: string | null; phone: string }
  group: { name: string }
}
interface Resp { payments: Payment[]; total: number; page: number; limit: number }

const badge: Record<string, string> = {
  COMPLETED: 'bg-green-500/15 text-green-400 border-green-500/20',
  FAILED:    'bg-red-500/15 text-red-400 border-red-500/20',
  PENDING:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  PROCESSING:'bg-blue-500/15 text-blue-400 border-blue-500/20',
}

export default function AdminPaymentsPage() {
  const [data, setData] = useState<Resp | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get<Resp>(`/admin/payments?page=${page}&limit=20`).then(setData).finally(() => setLoading(false))
  }, [page])

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">All Payments</h1>
        <p className="text-gray-400 text-sm mt-0.5">{data?.total ?? 0} total transactions</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-green-500 animate-spin" /></div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5">User</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5 hidden md:table-cell">Group</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5">Amount</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5 hidden lg:table-cell">Receipt</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5 hidden lg:table-cell">Date</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {data?.payments.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="hover:bg-gray-800/40 transition">
                    <td className="px-5 py-4">
                      <p className="text-white font-medium">{p.user.fullName || 'Unknown'}</p>
                      <p className="text-gray-500 text-xs font-mono">{p.user.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-300 hidden md:table-cell">{p.group.name}</td>
                    <td className="px-5 py-4 text-white font-semibold">{formatCurrency(p.amount)}</td>
                    <td className="px-5 py-4 text-gray-400 font-mono text-xs hidden lg:table-cell">{p.mpesaReceipt || '—'}</td>
                    <td className="px-5 py-4 text-gray-400 hidden lg:table-cell">{formatDate(p.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${badge[p.status]}`}>{p.status}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-800">
              <p className="text-gray-500 text-sm">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-40 transition"><ChevronLeft className="w-4 h-4" /></button>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-40 transition"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
