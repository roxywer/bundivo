'use client'

import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/store/auth.store'
import { useRealtimeStore } from '@/store/realtime.store'
import { toast } from '@/components/ui/Toast'

const WS_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:4000'

let socket: Socket | null = null

export function useSocket(groupId?: string) {
  const token = useAuthStore((s) => s.token)
  const setGroupProgress = useRealtimeStore((s) => s.setGroupProgress)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!token) return

    if (!socket || !socket.connected) {
      socket = io(WS_URL, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 2000,
      })
    }
    socketRef.current = socket

    socket.on('payment_confirmed', (data: { amount: number; mpesaReceipt: string }) => {
      toast.success('Payment received!', `KES ${data.amount} confirmed via M-Pesa`)
    })

    socket.on('group_progress', (data: { groupId: string; currentAmount: number; targetAmount: number; membersCount: number; totalMembers: number; status: string }) => {
      setGroupProgress(data)
    })

    socket.on('group_funded', (data: { groupId: string; message: string }) => {
      toast.success('Group fully funded! 🎉', data.message)
    })

    socket.on('group_activated', (data: { groupId: string; message: string; status: string }) => {
      toast.success('Subscription activated! 🎵', data.message)
    })

    if (groupId) {
      socket.emit('join_group', groupId)
    }

    return () => {
      if (groupId && socket) {
        socket.emit('leave_group', groupId)
      }
      socket?.off('payment_confirmed')
      socket?.off('group_progress')
      socket?.off('group_funded')
      socket?.off('group_activated')
    }
  }, [token, groupId])

  return socketRef.current
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}
