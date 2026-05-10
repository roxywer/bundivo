'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send,
  Loader2,
  Users,
  ChevronRight,
  X,
  Package,
  CreditCard,
  ShoppingCart,
  CheckCheck
} from 'lucide-react'
import { api } from '@/lib/api'
import { formatDate, formatCurrency } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'

interface GroupInbox {
  id: string
  name: string
  subscriptionType: string
  targetAmount: number
  maxMembers: number
  members: { user: { id: string; fullName: string | null; email: string } }[]
  owner: { id: string; fullName: string | null; email: string }
  purchaseStatus: string
  adminNotes: string | null
  unreadCount: number
  lastMessage: {
    id: string
    content: string
    createdAt: string
    sender: { fullName: string | null; email: string }
  } | null
}

interface Message {
  id: string
  content: string
  type: 'USER_TO_ADMIN' | 'ADMIN_TO_USER' | 'ADMIN_BROADCAST'
  status: 'UNREAD' | 'READ' | 'REPLIED'
  createdAt: string
  sender: { id: string; fullName: string | null; email: string; role: string }
}

const purchaseStatusConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  NOT_CONTACTED: { label: 'Not Contacted', icon: Clock, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' },
  CONTACTED: { label: 'Contacted', icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  QUOTE_RECEIVED: { label: 'Quote Received', icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  PAYMENT_PENDING: { label: 'Payment Pending', icon: CreditCard, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  PURCHASED: { label: 'Purchased', icon: ShoppingCart, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  ACTIVE: { label: 'Active', icon: CheckCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  EXPIRED: { label: 'Expired', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
}

const statusFlow = ['NOT_CONTACTED', 'CONTACTED', 'QUOTE_RECEIVED', 'PAYMENT_PENDING', 'PURCHASED', 'ACTIVE']

export default function AdminInboxPage() {
  const [groups, setGroups] = useState<GroupInbox[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState<GroupInbox | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [replyText, setReplyText] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [showNotesEdit, setShowNotesEdit] = useState(false)

  useEffect(() => {
    loadInbox()
  }, [])

  const loadInbox = async () => {
    try {
      const data = await api.get<GroupInbox[]>('/messages/inbox/admin')
      setGroups(data)
    } catch {
      toast.error('Failed to load inbox')
    } finally {
      setLoading(false)
    }
  }

  const openGroupChat = async (group: GroupInbox) => {
    setSelectedGroup(group)
    setLoadingMessages(true)
    setAdminNotes(group.adminNotes || '')
    try {
      const data = await api.get<Message[]>(`/messages/group/${group.id}`)
      setMessages(data)
    } catch {
      toast.error('Failed to load messages')
    } finally {
      setLoadingMessages(false)
    }
  }

  const sendReply = async () => {
    if (!replyText.trim() || !selectedGroup) return
    setSendingReply(true)
    try {
      await api.post('/messages/reply', {
        groupId: selectedGroup.id,
        message: replyText,
      })
      toast.success('Reply sent')
      setReplyText('')
      // Refresh messages
      const data = await api.get<Message[]>(`/messages/group/${selectedGroup.id}`)
      setMessages(data)
      // Update group status to contacted if first reply
      loadInbox()
    } catch {
      toast.error('Failed to send reply')
    } finally {
      setSendingReply(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    if (!selectedGroup) return
    setUpdatingStatus(true)
    try {
      await api.post(`/messages/group/${selectedGroup.id}/status`, {
        status: newStatus,
        notes: adminNotes,
      })
      toast.success('Status updated')
      // Update local state
      setSelectedGroup({ ...selectedGroup, purchaseStatus: newStatus, adminNotes })
      loadInbox()
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const saveNotes = async () => {
    if (!selectedGroup) return
    try {
      await api.post(`/messages/group/${selectedGroup.id}/status`, {
        status: selectedGroup.purchaseStatus,
        notes: adminNotes,
      })
      toast.success('Notes saved')
      setSelectedGroup({ ...selectedGroup, adminNotes })
      setShowNotesEdit(false)
    } catch {
      toast.error('Failed to save notes')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Inbox</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {groups.length} group{groups.length !== 1 ? 's' : ''} awaiting response
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            {groups.reduce((sum, g) => sum + g.unreadCount, 0)} unread messages
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Group List */}
        <div className="space-y-3">
          {groups.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No messages yet</p>
              <p className="text-gray-500 text-sm mt-1">Groups will appear here when users contact you</p>
            </div>
          ) : (
            groups.map((group) => {
              const status = purchaseStatusConfig[group.purchaseStatus] || purchaseStatusConfig.NOT_CONTACTED
              const StatusIcon = status.icon
              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => openGroupChat(group)}
                  className={`bg-gray-900 border rounded-2xl p-5 cursor-pointer transition-all hover:bg-gray-800/50 ${
                    selectedGroup?.id === group.id ? 'border-green-500/50 ring-1 ring-green-500/20' : 'border-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{group.name}</h3>
                      <p className="text-gray-400 text-sm">{group.subscriptionType}</p>
                    </div>
                    {group.unreadCount > 0 && (
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {group.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm mb-3">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Users className="w-4 h-4" />
                      {group.members.length}/{group.maxMembers}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      {formatCurrency(group.targetAmount)}
                    </span>
                  </div>

                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${status.bg} ${status.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </div>

                  {group.lastMessage && (
                    <div className="mt-3 pt-3 border-t border-gray-800">
                      <p className="text-gray-300 text-sm line-clamp-2">
                        <span className="text-green-400">{group.lastMessage.sender.fullName || group.lastMessage.sender.email}:</span>{' '}
                        {group.lastMessage.content}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">{formatDate(group.lastMessage.createdAt)}</p>
                    </div>
                  )}
                </motion.div>
              )
            })
          )}
        </div>

        {/* Chat Panel */}
        <AnimatePresence mode="wait">
          {selectedGroup ? (
            <motion.div
              key={selectedGroup.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-[600px]"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold">{selectedGroup.name}</h3>
                    <p className="text-gray-400 text-sm">{selectedGroup.subscriptionType} · {selectedGroup.members.length} members</p>
                  </div>
                  <button 
                    onClick={() => setSelectedGroup(null)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status Progress */}
                <div className="flex items-center gap-1 mb-3">
                  {statusFlow.map((status, idx) => {
                    const currentIdx = statusFlow.indexOf(selectedGroup.purchaseStatus)
                    const isActive = idx <= currentIdx
                    const StatusIcon = purchaseStatusConfig[status]?.icon || Clock
                    return (
                      <div key={status} className="flex items-center">
                        <button
                          onClick={() => updateStatus(status)}
                          disabled={updatingStatus}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isActive 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                          }`}
                          title={purchaseStatusConfig[status]?.label}
                        >
                          <StatusIcon className="w-4 h-4" />
                        </button>
                        {idx < statusFlow.length - 1 && (
                          <div className={`w-4 h-0.5 ${idx < currentIdx ? 'bg-green-500' : 'bg-gray-700'}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-400">
                  Current: {purchaseStatusConfig[selectedGroup.purchaseStatus]?.label || selectedGroup.purchaseStatus}
                </p>

                {/* Admin Notes */}
                <div className="mt-3 pt-3 border-t border-gray-800">
                  {showNotesEdit ? (
                    <div className="space-y-2">
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add private notes about this group..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl p-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowNotesEdit(false)}
                          className="text-xs text-gray-400 hover:text-white px-2 py-1"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveNotes}
                          className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-400"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => setShowNotesEdit(true)}
                      className="cursor-pointer group"
                    >
                      <p className="text-xs text-gray-500 mb-1">Admin Notes (click to edit):</p>
                      <p className="text-sm text-gray-300 group-hover:text-white transition">
                        {selectedGroup.adminNotes || 'No notes added...'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No messages yet</p>
                    <p className="text-gray-500 text-xs mt-1">Start the conversation below</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isAdmin = msg.sender.role === 'ADMIN'
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          isAdmin 
                            ? 'bg-green-500/20 border border-green-500/30 text-white' 
                            : 'bg-gray-800 border border-gray-700 text-white'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <div className={`flex items-center gap-1 mt-1 text-xs ${isAdmin ? 'text-green-400/70' : 'text-gray-500'}`}>
                            <span>{msg.sender.fullName || msg.sender.email}</span>
                            <span>·</span>
                            <span>{formatDate(msg.createdAt)}</span>
                            {isAdmin && msg.status === 'READ' && <CheckCircle2 className="w-3 h-3" />}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>

              {/* Reply Input */}
              <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                <div className="flex gap-2">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendReply()}
                    placeholder="Type your reply..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={sendReply}
                    disabled={!replyText.trim() || sendingReply}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:opacity-50 text-white px-4 py-3 rounded-xl transition-all flex items-center gap-2"
                  >
                    {sendingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="hidden lg:flex items-center justify-center h-[600px] bg-gray-900/50 border border-gray-800 rounded-2xl">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400">Select a group to view messages</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
