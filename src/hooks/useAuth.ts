'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'
import type { Session } from '@supabase/supabase-js'

interface AuthState {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string): Promise<User | null> => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    const u = data as User | null
    setUser(u)
    return u
  }, [])

  useEffect(() => {
    let mounted = true

    async function init() {
      const { data: { session: s } } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(s)
      if (s?.user) {
        await fetchProfile(s.user.id)
      }
      if (mounted) setLoading(false)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        if (!mounted) return
        setSession(s)
        if (s?.user) {
          await fetchProfile(s.user.id)
        } else {
          setUser(null)
        }
      },
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    if (data.user) {
      await fetchProfile(data.user.id)
    }
    return {}
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return { session, user, loading, signIn, signOut }
}
