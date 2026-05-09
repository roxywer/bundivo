'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Music2, Link2 } from 'lucide-react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { InviteModal } from '@/components/ui/InviteModal'
import { toast } from '@/components/ui/Toast'

interface Group {
  id: string; name: string; subscriptionType: string; status: string
  currentAmount: number; targetAmount: number; maxMembers: number
  createdAt: string; members: { id: string; user: { fullName: string | null; avatar: string | null } }[]
  invitations: { inviteToken: string }[]
}

const statusColors: Record<string, string> = {
  FORMING: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  FUNDED: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  ACTIVE: 'bg-green-500/15 text-green-400 border-green-500/20',
  EXPIRED: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteModal, setInviteModal] = useState<{ groupName: string; token: string } | null>(null)

  useEffect(() => {
    api.get<Group[]>('/groups')
      .then(setGroups)
      .catch(() => toast.error('Failed to load groups'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Groups</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage your subscription groups</p>
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Music2 className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-white font-semibold mb-1">No groups yet</h3>
          <p className="text-gray-500 text-sm mb-4">Create or join a group to start sharing subscriptions</p>
          <Link href="/groups/create">
            <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl mx-auto text-sm">
              <Plus className="w-4 h-4" /> Create Group
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {groups.map((g, i) => {
            const progress = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0
            const invite = g.invitations[0]
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center">
                      <Music2 className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">{g.name}</h3>
                      <p className="text-gray-500 text-xs">{g.subscriptionType}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[g.status]}`}>{g.status}</span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatCurrency(g.currentAmount)}</span>
                    <span>{formatCurrency(g.targetAmount)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex -space-x-2">
                    {g.members.slice(0, 4).map((m, mi) => (
                      <div key={mi} className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 border-2 border-gray-900 flex items-center justify-center text-white text-[10px] font-bold">
                        {m.user.fullName?.[0]?.toUpperCase() || '?'}
                      </div>
                    ))}
                    {g.members.length > 4 && (
                      <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-gray-300 text-[10px]">
                        +{g.members.length - 4}
                      </div>
                    )}
                  </div>
                  <span className="text-gray-500 text-xs">{g.members.length}/{g.maxMembers} members</span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/groups/${g.id}`} className="flex-1">
                    <button className="w-full text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-xl py-2 transition">View</button>
                  </Link>
                  {invite && (
                    <button
                      onClick={() => setInviteModal({ groupName: g.name, token: invite.inviteToken })}
                      className="flex items-center gap-1.5 text-xs font-medium text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl px-3 py-2 transition"
                    >
                      <Link2 className="w-3.5 h-3.5" /> Invite
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
      {inviteModal && (
        <InviteModal
          open={!!inviteModal}
          onClose={() => setInviteModal(null)}
          groupName={inviteModal.groupName}
          inviteToken={inviteModal.token}
        />
      )}
    </div>
  )
}
