'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, CreditCard, Settings, LogOut,
  Music2, Shield, BarChart3, ChevronRight, MessageCircle
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const userLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/groups', label: 'My Groups', icon: Users },
  { href: '/payments', label: 'Payments', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const adminLinks = [
  { href: '/admin', label: 'Overview', icon: BarChart3 },
  { href: '/admin/inbox', label: 'Inbox', icon: MessageCircle },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/groups', label: 'Groups', icon: Users },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: Music2 },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const isAdmin = user?.role === 'ADMIN'
  const links = isAdmin ? adminLinks : userLinks

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
      <div className="p-5 border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Bundivo</span>
        </Link>
      </div>

      {isAdmin && (
        <div className="px-4 pt-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-2.5 py-1.5">
            <Shield className="w-3.5 h-3.5" /> Admin Mode
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && href !== '/admin' && pathname.startsWith(href))
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.fullName?.[0]?.toUpperCase() || user?.email?.[0] || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.fullName || 'User'}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email || user?.phone}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </aside>
  )
}
