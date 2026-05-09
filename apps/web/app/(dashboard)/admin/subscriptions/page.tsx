'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Music2, Loader2, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'

interface Subscription {
  id: string; provider: string; platformEmail: string; recoveryEmail: string | null
  status: string; renewalCost: number; createdAt: string
  group: { id: string; name: string; subscriptionType: string; status: string; _count: { members: number } }
}
interface Resp { subscriptions: Subscription[]; total: number; page: number; limit: number }

const statusCfg: Record<string, { icon: any; badge: string }> = {
  ACTIVE:    { icon: CheckCircle2, badge: 'bg-green-500/15 text-green-400 border-green-500/20' },
  INACTIVE:  { icon: Clock,        badge: 'bg-gray-500/15 text-gray-400 border-gray-500/20' },
  SUSPENDED: { icon: XCircle,      badge: 'bg-red-500/15 text-red-400 border-red-500/20' },
}

export default function AdminSubscriptionsPage() {
  const [data, setData] = useState<Resp | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)

  const load = (p: number) => {
    setLoading(true)
    api.get<Resp>(`/admin/subscriptions?page=${p}&limit=20`).then(setData).catch(() => toast.error('Failed to load subscriptions')).finally(() => setLoading(false))
  }

  useEffect(() => { load(page) }, [page])

  const toggleStatus = async (id: string, current: string) => {
    setToggling(id)
    const next = current === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    try {
      await api.patch(`/admin/subscriptions/${id}`, { status: next })
      toast.success('Status updated', `Subscription set to ${next}`)
      load(page)
    } catch {
      toast.error('Update failed')
    } finally {
      setToggling(null)
    }
  }

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
        <p className="text-gray-400 text-sm mt-0.5">{data?.total ?? 0} platform-managed subscriptions</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-green-500 animate-spin" /></div>
        ) : data?.subscriptions.length === 0 ? (
          <div className="text-center py-16">
            <Music2 className="w-10 h-10 text-gray-700 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No subscriptions yet</p>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5">Group</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5 hidden md:table-cell">Platform Email</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5 hidden lg:table-cell">Provider</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5 hidden lg:table-cell">Created</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {data?.subscriptions.map((s, i) => {
                  const cfg = statusCfg[s.status] || statusCfg.INACTIVE
                  const Icon = cfg.icon
                  return (
                    <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-800/40 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
                            <Music2 className="w-4 h-4 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{s.group.name}</p>
                            <p className="text-gray-500 text-xs">{s.group.subscriptionType} · {s.group._count.members} members</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-300 font-mono text-xs hidden md:table-cell">{s.platformEmail}</td>
                      <td className="px-5 py-4 text-gray-400 capitalize hidden lg:table-cell">{s.provider}</td>
                      <td className="px-5 py-4 text-gray-400 hidden lg:table-cell">{formatDate(s.createdAt)}</td>
                      <td className="px-5 py-4">
                        <span className={`flex items-center gap-1.5 w-fit text-xs px-2.5 py-1 rounded-full border ${cfg.badge}`}>
                          <Icon className="w-3 h-3" />{s.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => toggleStatus(s.id, s.status)} disabled={toggling === s.id}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition disabled:opacity-50 ${s.status === 'ACTIVE' ? 'text-red-400 border-red-500/20 bg-red-500/10 hover:bg-red-500/20' : 'text-green-400 border-green-500/20 bg-green-500/10 hover:bg-green-500/20'}`}>
                          {toggling === s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : s.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
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
