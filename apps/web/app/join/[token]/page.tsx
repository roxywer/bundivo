'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'

interface GroupPreview {
  id: string; name: string; subscriptionType: string
  maxMembers: number; targetAmount: number
  members: { id: string }[]
}

export default function JoinGroupPage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [loading, setLoading] = useState(false)
  const [joining] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/join/${token}`)
      return
    }
    setLoading(true)
    api.post<GroupPreview>(`/groups/join/${token}`, {})
      .then((g) => { router.push(`/groups/${g.id}`) })
      .catch((err) => setError(err.message || 'Invalid or expired invite link'))
      .finally(() => setLoading(false))
  }, [token, isAuthenticated, router])

  if (loading || joining) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border border-red-500/20 rounded-2xl p-8 text-center max-w-sm">
        <p className="text-red-400 font-semibold mb-2">Invite Error</p>
        <p className="text-gray-400 text-sm mb-4">{error}</p>
        <button onClick={() => router.push('/dashboard')} className="text-green-400 text-sm hover:text-green-300 transition">
          Go to Dashboard
        </button>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
    </div>
  )
}
