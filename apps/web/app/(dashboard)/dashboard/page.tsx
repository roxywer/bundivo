'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, CreditCard, TrendingUp, Clock, ArrowUpRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { SkeletonDashboard } from '@/components/ui/Skeleton'
import { toast } from '@/components/ui/Toast'

interface Group { id: string; name: string; subscriptionType: string; status: string; currentAmount: number; targetAmount: number; members: any[] }
interface Payment { id: string; amount: number; status: string; createdAt: string; group: { name: string } }

const statusColors: Record<string, string> = {
  FORMING: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  FUNDED: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  ACTIVE: 'bg-green-500/15 text-green-400 border-green-500/20',
  EXPIRED: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
  COMPLETED: 'bg-green-500/15 text-green-400 border-green-500/20',
  FAILED: 'bg-red-500/15 text-red-400 border-red-500/20',
  PENDING: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const [groups, setGroups] = useState<Group[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get<Group[]>('/groups'),
      api.get<Payment[]>('/payments/my'),
    ]).then(([g, p]) => {
      setGroups(g)
      setPayments(p)
    }).finally(() => setLoading(false))
  }, [])

  const totalPaid = payments.filter((p) => p.status === 'COMPLETED').reduce((s, p) => s + p.amount, 0)
  const activeGroups = groups.filter((g) => g.status === 'ACTIVE').length

  const stats = [
    { label: 'Active Groups', value: activeGroups, icon: Users, color: 'from-green-500 to-emerald-600' },
    { label: 'Total Groups', value: groups.length, icon: TrendingUp, color: 'from-blue-500 to-cyan-600' },
    { label: 'Total Paid', value: formatCurrency(totalPaid), icon: CreditCard, color: 'from-purple-500 to-violet-600' },
    { label: 'Pending Groups', value: groups.filter((g) => g.status === 'FORMING').length, icon: Clock, color: 'from-amber-500 to-orange-600' },
  ]

  if (loading) return <SkeletonDashboard />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {user?.fullName?.split(' ')[0] || 'there'} 👋</h1>
          <p className="text-gray-400 text-sm mt-0.5">Here's what's happening with your subscriptions</p>
        </div>
        <Link href="/groups/create">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-green-500/25 text-sm"
          >
            <Plus className="w-4 h-4" /> New Group
          </motion.button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600" />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-400 text-sm mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">My Groups</h2>
            <Link href="/groups" className="text-green-400 text-sm hover:text-green-300 transition">View all</Link>
          </div>
          {groups.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-gray-700 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No groups yet</p>
              <Link href="/groups/create" className="text-green-400 text-sm hover:text-green-300 mt-1 inline-block">Create one →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.slice(0, 4).map((g) => {
                const progress = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0
                return (
                  <Link key={g.id} href={`/groups/${g.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800/60 transition cursor-pointer">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white text-sm font-medium truncate">{g.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[g.status]}`}>{g.status}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                        </div>
                        <p className="text-gray-500 text-xs mt-1">{formatCurrency(g.currentAmount)} / {formatCurrency(g.targetAmount)}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Recent Payments</h2>
            <Link href="/payments" className="text-green-400 text-sm hover:text-green-300 transition">View all</Link>
          </div>
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-10 h-10 text-gray-700 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No payments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800/60 transition">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${p.status === 'COMPLETED' ? 'bg-green-500/15' : p.status === 'FAILED' ? 'bg-red-500/15' : 'bg-yellow-500/15'}`}>
                    <CreditCard className={`w-4 h-4 ${p.status === 'COMPLETED' ? 'text-green-400' : p.status === 'FAILED' ? 'text-red-400' : 'text-yellow-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{p.group.name}</p>
                    <p className="text-gray-500 text-xs">{formatDate(p.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-semibold">{formatCurrency(p.amount)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[p.status]}`}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-800 rounded-xl w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-900 border border-gray-800 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="h-80 bg-gray-900 border border-gray-800 rounded-2xl" />
        <div className="h-80 bg-gray-900 border border-gray-800 rounded-2xl" />
      </div>
    </div>
  )
}
