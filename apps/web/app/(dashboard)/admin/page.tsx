'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, BarChart3, CreditCard, Music2, TrendingUp, AlertCircle, Loader2, CheckCheck } from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts'

interface Stats {
  totalUsers: number; totalGroups: number; activeGroups: number; fundedGroups: number
  totalRevenue: number; failedPayments: number; pendingActivations: number; pendingGroups: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/admin/stats').then(setStats).finally(() => setLoading(false))
  }, [])

  const mockChart = [
    { month: 'Jan', revenue: 12400 }, { month: 'Feb', revenue: 18200 }, { month: 'Mar', revenue: 15800 },
    { month: 'Apr', revenue: 24100 }, { month: 'May', revenue: 29600 }, { month: 'Jun', revenue: 22400 },
  ]

  const groupPieData = stats ? [
    { name: 'Active',  value: stats.activeGroups,                                            color: '#22c55e' },
    { name: 'Funded',  value: stats.fundedGroups,                                            color: '#3b82f6' },
    { name: 'Forming', value: stats.pendingGroups,                                           color: '#f59e0b' },
    { name: 'Other',   value: Math.max(0, stats.totalGroups - stats.activeGroups - stats.fundedGroups - stats.pendingGroups), color: '#6b7280' },
  ].filter((d) => d.value > 0) : []

  const paymentBarData = stats ? [
    { label: 'Completed', value: Math.max(0, stats.totalGroups * 3 - stats.failedPayments), color: '#22c55e' },
    { label: 'Failed',    value: stats.failedPayments,  color: '#ef4444' },
    { label: 'Pending',   value: stats.pendingGroups,   color: '#f59e0b' },
  ] : []

  const cards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-cyan-600', change: '+12%' },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'from-green-500 to-emerald-600', change: '+8%' },
    { label: 'Active Groups', value: stats.activeGroups, icon: Music2, color: 'from-purple-500 to-violet-600', change: '+3' },
    { label: 'Pending Activations', value: stats.pendingActivations, icon: AlertCircle, color: 'from-amber-500 to-orange-600', change: '' },
    { label: 'Failed Payments', value: stats.failedPayments, icon: CreditCard, color: 'from-red-500 to-rose-600', change: '' },
    { label: 'Total Groups', value: stats.totalGroups, icon: BarChart3, color: 'from-indigo-500 to-blue-600', change: '' },
  ] : []

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <p className="text-gray-400 text-sm mt-0.5">Platform analytics and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg`}>
                <c.icon className="w-5 h-5 text-white" />
              </div>
              {c.change && <span className="text-green-400 text-xs font-medium bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">{c.change}</span>}
            </div>
            <p className="text-2xl font-bold text-white">{c.value}</p>
            <p className="text-gray-400 text-sm mt-0.5">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-6">Revenue Trend</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={mockChart}>
            <defs>
              <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="month" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
              formatter={(v) => [formatCurrency(Number(v)), 'Revenue']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#revenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-6">Group Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={groupPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                {groupPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }} />
              <Legend iconType="circle" iconSize={10} formatter={(v) => <span className="text-gray-300 text-sm">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-6">Payment Statuses</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={paymentBarData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="label" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {paymentBarData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {stats && stats.pendingActivations > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
            <CheckCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-amber-400 font-semibold">{stats.pendingActivations} group{stats.pendingActivations > 1 ? 's' : ''} ready for activation</p>
            <p className="text-gray-400 text-sm mt-0.5">These groups are fully funded and awaiting Spotify invite dispatch.</p>
          </div>
        </div>
      )}
    </div>
  )
}
