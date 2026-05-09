'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Music2, Loader2, CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Group {
  id: string; name: string; subscriptionType: string; status: string
  currentAmount: number; targetAmount: number; createdAt: string
  owner: { fullName: string | null; phone: string }
  _count: { members: number }
}
interface Resp { groups: Group[]; total: number; page: number; limit: number }

const badgeColor: Record<string, string> = {
  FORMING: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  FUNDED:  'bg-blue-500/15 text-blue-400 border-blue-500/20',
  ACTIVE:  'bg-green-500/15 text-green-400 border-green-500/20',
  EXPIRED: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
}

export default function AdminGroupsPage() {
  const [data, setData] = useState<Resp | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState<string | null>(null)

  const load = (p: number) => {
    setLoading(true)
    api.get<Resp>(`/admin/groups?page=${p}&limit=20`).then(setData).finally(() => setLoading(false))
  }

  useEffect(() => { load(page) }, [page])

  const activate = async (id: string) => {
    setActivating(id)
    try {
      await api.post(`/admin/groups/${id}/activate`, {})
      load(page)
    } finally {
      setActivating(null)
    }
  }

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Groups</h1>
        <p className="text-gray-400 text-sm mt-0.5">{data?.total ?? 0} total groups on the platform</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-green-500 animate-spin" /></div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5">Group</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5 hidden md:table-cell">Owner</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5">Members</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5 hidden lg:table-cell">Progress</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {data?.groups.map((g, i) => {
                  const pct = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0
                  return (
                    <motion.tr key={g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="hover:bg-gray-800/40 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
                            <Music2 className="w-4 h-4 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{g.name}</p>
                            <p className="text-gray-500 text-xs">{g.subscriptionType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-300 hidden md:table-cell">{g.owner.fullName || g.owner.phone}</td>
                      <td className="px-5 py-4 text-gray-300">{g._count.members}</td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <div className="w-24">
                          <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <p className="text-gray-500 text-xs">{formatCurrency(g.currentAmount)}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full border ${badgeColor[g.status]}`}>{g.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        {g.status === 'FUNDED' && (
                          <button onClick={() => activate(g.id)} disabled={activating === g.id}
                            className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 px-2.5 py-1 rounded-lg transition disabled:opacity-50">
                            {activating === g.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><CheckCheck className="w-3 h-3" /> Activate</>}
                          </button>
                        )}
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
