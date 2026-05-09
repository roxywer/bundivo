'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Link2, Copy, CheckCheck, Share2, QrCode } from 'lucide-react'
import { toast } from './Toast'

interface InviteModalProps {
  open: boolean
  onClose: () => void
  groupName: string
  inviteToken: string
}

export function InviteModal({ open, onClose, groupName, inviteToken }: InviteModalProps) {
  const [copied, setCopied] = useState(false)
  const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/join/${inviteToken}`

  const copy = async () => {
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    toast.success('Link copied!', 'Share it with people you want to invite.')
    setTimeout(() => setCopied(false), 2500)
  }

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: `Join ${groupName} on Bundivo`, text: `I'm inviting you to join my Spotify group on Bundivo!`, url: inviteUrl })
    } else {
      copy()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-md p-6 shadow-2xl z-10"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center">
                <Link2 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Invite Members</h2>
                <p className="text-gray-400 text-sm">{groupName}</p>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 mb-4">
              <p className="text-gray-500 text-xs mb-2 uppercase tracking-wider font-medium">Invite Link</p>
              <p className="text-white text-sm font-mono break-all leading-relaxed">{inviteUrl}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={copy}
                className={`flex items-center justify-center gap-2 font-semibold py-3 rounded-2xl transition ${copied ? 'bg-green-500/15 border border-green-500/25 text-green-400' : 'bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white'}`}>
                {copied ? <><CheckCheck className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
              </button>
              <button onClick={share}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:opacity-90 text-white font-semibold py-3 rounded-2xl transition shadow-lg shadow-blue-500/20">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>

            <div className="bg-yellow-500/8 border border-yellow-500/15 rounded-2xl p-3 flex items-start gap-2">
              <QrCode className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-yellow-300/70 text-xs leading-relaxed">This link expires in 7 days. Only share with people you trust — anyone with this link can join the group.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
