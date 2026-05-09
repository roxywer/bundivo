'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { create } from 'zustand'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastStore {
  toasts: Toast[]
  add: (toast: Omit<Toast, 'id'>) => void
  remove: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (toast) => {
    const id = Math.random().toString(36).slice(2)
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 4500)
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = {
  success: (title: string, message?: string) => useToastStore.getState().add({ type: 'success', title, message }),
  error:   (title: string, message?: string) => useToastStore.getState().add({ type: 'error',   title, message }),
  warning: (title: string, message?: string) => useToastStore.getState().add({ type: 'warning', title, message }),
  info:    (title: string, message?: string) => useToastStore.getState().add({ type: 'info',    title, message }),
}

const config: Record<ToastType, { icon: any; bar: string; bg: string; border: string; text: string }> = {
  success: { icon: CheckCircle2, bar: 'bg-green-500',  bg: 'bg-gray-900', border: 'border-green-500/25', text: 'text-green-400' },
  error:   { icon: XCircle,      bar: 'bg-red-500',    bg: 'bg-gray-900', border: 'border-red-500/25',   text: 'text-red-400' },
  warning: { icon: AlertCircle,  bar: 'bg-yellow-500', bg: 'bg-gray-900', border: 'border-yellow-500/25',text: 'text-yellow-400' },
  info:    { icon: Info,         bar: 'bg-blue-500',   bg: 'bg-gray-900', border: 'border-blue-500/25',  text: 'text-blue-400' },
}

export function ToastProvider() {
  const { toasts, remove } = useToastStore()

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 w-80 max-w-[calc(100vw-2.5rem)]">
      <AnimatePresence>
        {toasts.map((t) => {
          const c = config[t.type]
          const Icon = c.icon
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
              className={`relative overflow-hidden ${c.bg} border ${c.border} rounded-2xl shadow-2xl p-4`}
            >
              <div className={`absolute top-0 left-0 h-0.5 w-full ${c.bar} opacity-60`} />
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${c.text} shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{t.title}</p>
                  {t.message && <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{t.message}</p>}
                </div>
                <button onClick={() => remove(t.id)} className="text-gray-600 hover:text-gray-400 transition shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
