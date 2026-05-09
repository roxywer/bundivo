'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '@/lib/api'
import { formatDate, getInitials } from '@/lib/utils'

interface User {
  id: string; fullName: string | null; phone: string; email: string | null
  role: string; createdAt: string; _count: { memberships: number; payments: number }
}
interface Resp { users: User[]; total: number; page: number; limit: number }

export default function AdminUsersPage() {
  const [data, setData] = useState<Resp | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [promoting, setPromoting] = useState<string | null>(null)

  const load = (p: number) => {
    setLoading(true)
    api.get<Resp>(`/admin/users?page=${p}&limit=20`).then(setData).finally(() => setLoading(false))
  }

  useEffect(() => { load(page) }, [page])

  const promote = async (userId: string) => {
    setPromoting(userId)
    try {
      await api.post(`/admin/users/${userId}/promote`, {})
      load(page)
    } finally {
      setPromoting(null)
    }
  }

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400 text-sm mt-0.5">{data?.total ?? 0} total registered users</p>
        </div>
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
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5 hidden md:table-cell">Phone</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5 hidden lg:table-cell">Joined</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5">Groups</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {data?.users.map((u, i) => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="hover:bg-gray-800/40 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {getInitials(u.fullName)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{u.fullName || 'No name'}</p>
                          <p className="text-gray-500 text-xs">{u.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-300 hidden md:table-cell font-mono text-xs">{u.phone}</td>
                    <td className="px-5 py-4 text-gray-400 hidden lg:table-cell">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-4 text-gray-300">{u._count.memberships}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${u.role === 'ADMIN' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-gray-700/50 text-gray-400 border-gray-700'}`}>
                        {u.role === 'ADMIN' && <Shield className="w-3 h-3 inline mr-1" />}{u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {u.role !== 'ADMIN' && (
                        <button onClick={() => promote(u.id)} disabled={promoting === u.id}
                          className="text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-2.5 py-1 rounded-lg transition disabled:opacity-50">
                          {promoting === u.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Promote'}
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-800">
              <p className="text-gray-500 text-sm">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}
                  className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-40 transition">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
                  className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-40 transition">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
