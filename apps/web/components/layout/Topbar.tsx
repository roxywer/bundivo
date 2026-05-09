'use client'

import { Bell } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { getInitials } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function Topbar() {
  const user = useAuthStore((s) => s.user)

  return (
    <header className="h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button className="relative w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-green-500/20">
          {getInitials(user?.fullName)}
        </div>
      </div>
    </header>
  )
}
