'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth.store'
import { api } from '@/lib/api'
import { toast } from '@/components/ui/Toast'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Get the session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error
        if (!session) {
          router.push('/login')
          return
        }

        // Get user info from Supabase
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        // Check if user exists in our backend, if not create them
        try {
          // Try to login first (user might already exist)
          const loginRes = await api.post<{ accessToken: string; user: any }>('/auth/login', {
            email: user.email,
            password: user.id, // Use Supabase user ID as temporary password
          })
          setAuth(loginRes.user, loginRes.accessToken)
          toast.success('Welcome back!', `Good to see you, ${loginRes.user.fullName || 'friend'}`)
        } catch {
          // User doesn't exist, register them
          const registerRes = await api.post<{ accessToken: string; user: any }>('/auth/register', {
            fullName: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
            email: user.email,
            password: user.id,
          })
          setAuth(registerRes.user, registerRes.accessToken)
          toast.success('Account created!', 'Welcome to Bundivo!')
        }

        router.push('/dashboard')
      } catch (err: any) {
        console.error('Auth callback error:', err)
        toast.error('Authentication failed', err.message || 'Something went wrong')
        router.push('/login')
      }
    }

    handleAuth()
  }, [router, setAuth])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-green-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Completing sign in...</p>
      </div>
    </div>
  )
}
