'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Music2, Loader2, CheckCircle2, Clock, XCircle, Link2, MessageCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { useSocket } from '@/hooks/useSocket'
import { useRealtimeStore } from '@/store/realtime.store'
import { InviteModal } from '@/components/ui/InviteModal'
import { toast } from '@/components/ui/Toast'

interface GroupDetail {
  id: string; name: string; subscriptionType: string; status: string
  currentAmount: number; targetAmount: number; maxMembers: number; createdAt: string
  owner: { id: string; fullName: string | null }
  members: { id: string; role: string; paymentStatus: string; user: { id: string; fullName: string | null; phone: string } }[]
  payments: { id: string; amount: number; status: string; createdAt: string; mpesaReceipt: string | null }[]
  invitations: { inviteToken: string }[]
}

const statusIcon: Record<string, any> = {
  COMPLETED: CheckCircle2,
  FAILED: XCircle,
  PENDING: Clock,
  PROCESSING: Loader2,
}
const statusColor: Record<string, string> = {
  COMPLETED: 'text-green-400', FAILED: 'text-red-400', PENDING: 'text-yellow-400', PROCESSING: 'text-blue-400',
}
const badgeColor: Record<string, string> = {
  FORMING: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  FUNDED: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  ACTIVE: 'bg-green-500/15 text-green-400 border-green-500/20',
  EXPIRED: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
}

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [group, setGroup] = useState<GroupDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [inviteModal, setInviteModal] = useState(false)
  const [messageModal, setMessageModal] = useState(false)
  const [adminMessage, setAdminMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  useSocket(id)
  const liveProgress = useRealtimeStore((s) => s.groupProgress[id])

  useEffect(() => {
    api.get<GroupDetail>(`/groups/${id}`)
      .then(setGroup)
      .catch(() => toast.error('Failed to load group'))
      .finally(() => setLoading(false))
  }, [id])

  const reload = () => api.get<GroupDetail>(`/groups/${id}`).then(setGroup)

  const myMembership = group?.members.find((m) => m.user.id === user?.id)
  const isMember = !!myMembership
  const currentAmount = liveProgress?.currentAmount ?? group?.currentAmount ?? 0
  const targetAmount = group?.targetAmount ?? 1
  const progress = Math.min((currentAmount / targetAmount) * 100, 100)
  const invite = group?.invitations[0]

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
    </div>
  )

  if (!group) return (
    <div className="text-center py-20">
      <p className="text-gray-400">Group not found</p>
      <button onClick={() => router.push('/groups')} className="text-green-400 mt-2 text-sm">← Back to groups</button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{group.name}</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${badgeColor[group.status]}`}>{group.status}</span>
          </div>
          <p className="text-gray-400 text-sm">{group.subscriptionType} · Created {formatDate(group.createdAt)}</p>
        </div>
        {invite && (
          <button onClick={() => setInviteModal(true)} className="flex items-center gap-2 text-sm font-medium text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl px-4 py-2.5 transition">
            <Link2 className="w-4 h-4" /> Invite
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-5">
          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Funding Progress</span>
              <span className="text-white font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
              />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-green-400 font-semibold">{formatCurrency(currentAmount)}</span>
              <span className="text-gray-500">of {formatCurrency(group.targetAmount)}</span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Members ({group.members.length}/{group.maxMembers})</h3>
            <div className="space-y-2">
              {group.members.map((m) => {
                const Icon = statusIcon[m.paymentStatus] || Clock
                return (
                  <div key={m.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {getInitials(m.user.fullName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{m.user.fullName || m.user.phone}</p>
                      <p className="text-gray-500 text-xs">{m.role}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${statusColor[m.paymentStatus]}`}>
                      <Icon className="w-3.5 h-3.5" /> {m.paymentStatus}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {group.payments.length > 0 && (
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">Payment History</h3>
              <div className="space-y-2">
                {group.payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl text-sm">
                    <div>
                      <p className="text-white font-medium">{formatCurrency(p.amount)}</p>
                      <p className="text-gray-500 text-xs">{formatDate(p.createdAt)}{p.mpesaReceipt && ` · ${p.mpesaReceipt}`}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${p.status === 'COMPLETED' ? 'bg-green-500/15 text-green-400 border-green-500/20' : p.status === 'FAILED' ? 'bg-red-500/15 text-red-400 border-red-500/20' : 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'}`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Music2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{group.subscriptionType}</p>
                <p className="text-gray-500 text-xs">{formatCurrency(group.targetAmount / group.maxMembers)}/member</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400"><span>Slots</span><span className="text-white">{group.maxMembers}</span></div>
              <div className="flex justify-between text-gray-400"><span>Filled</span><span className="text-white">{group.members.length}</span></div>
              <div className="flex justify-between text-gray-400"><span>Owner</span><span className="text-white truncate max-w-[100px]">{group.owner.fullName}</span></div>
            </div>
          </div>

          {isMember && group?.status === 'FORMING' && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-white font-semibold text-sm mb-3">Ready to Purchase?</h3>
              <p className="text-gray-500 text-xs mb-4">
                Contact the admin to arrange payment for this {group.subscriptionType} subscription.
              </p>
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={() => setMessageModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 text-sm"
              >
                <MessageCircle className="w-4 h-4" /> Contact Admin
              </motion.button>
            </div>
          )}
        </div>
      </div>
      {messageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <h3 className="text-white font-semibold mb-2">Message Admin</h3>
            <p className="text-gray-400 text-sm mb-4">
              Send a message about purchasing <span className="text-green-400">{group?.name}</span>
            </p>
            <textarea
              value={adminMessage}
              onChange={(e) => setAdminMessage(e.target.value)}
              placeholder="Hi, I'm interested in joining this group. How do I proceed with payment?"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px] resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setMessageModal(false)}
                className="flex-1 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setSendingMessage(true)
                  try {
                    await api.post('/messages/to-admin', {
                      groupId: group?.id,
                      message: adminMessage || `I'm interested in purchasing ${group?.subscriptionType} through the group "${group?.name}". Please let me know the next steps.`
                    })
                    toast.success('Message sent!', 'Admin will contact you soon.')
                    setMessageModal(false)
                    setAdminMessage('')
                  } catch {
                    toast.error('Failed to send', 'Please try again later.')
                  } finally {
                    setSendingMessage(false)
                  }
                }}
                disabled={sendingMessage}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:from-green-400 hover:to-emerald-500 disabled:opacity-50 transition"
              >
                {sendingMessage ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {invite && inviteModal && (
        <InviteModal
          open={inviteModal}
          onClose={() => setInviteModal(false)}
          groupName={group.name}
          inviteToken={invite.inviteToken}
        />
      )}
    </div>
  )
}
