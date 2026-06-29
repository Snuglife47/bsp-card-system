'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'
import type { Session } from '@supabase/supabase-js'

interface AuthState {
  session: Session | null
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const currentUserId = useRef<string | null>(null)

  const fetchProfile = useCallback(async (userId: string): Promise<User | null> => {
    if (currentUserId.current === userId && user) return user
    try {
      console.log('[auth] Fetching profile for', userId)
      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      if (dbError) {
        console.error('[auth] Profile fetch error:', dbError.message)
        return null
      }
      console.log('[auth] Profile loaded:', data?.name)
      const u = data as User | null
      currentUserId.current = userId
      setUser(u)
      return u
    } catch (err) {
      console.error('[auth] Profile fetch exception:', err)
      return null
    }
  }, [user])

  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        console.log('[auth] Checking session...')
        const { data: { session: s }, error: sessionError } = await supabase.auth.getSession()
        if (!mounted) return
        if (sessionError) {
          console.error('[auth] getSession error:', sessionError.message)
          setError(sessionError.message)
          setLoading(false)
          return
        }
        console.log('[auth] Session:', s ? 'found' : 'none')
        setSession(s)
        if (s?.user) {
          await fetchProfile(s.user.id)
        }
      } catch (err) {
        console.error('[auth] Init exception:', err)
        if (mounted) setError(String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        if (!mounted) return
        if (_event === 'SIGNED_OUT') {
          setSession(null)
          setUser(null)
          currentUserId.current = null
        } else if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') {
          setSession(s)
        }
      },
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[auth] Signing in', email)
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        console.error('[auth] Sign in error:', signInError.message)
        return { error: signInError.message }
      }
      console.log('[auth] Sign in success')
      setSession(data.session)
      if (data.user) {
        currentUserId.current = null
        await fetchProfile(data.user.id)
      }
      return {}
    } catch (err) {
      console.error('[auth] Sign in exception:', err)
      return { error: 'Connection failed. Please check your network and try again.' }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('[auth] Sign out error:', err)
    }
    setUser(null)
    setSession(null)
    currentUserId.current = null
  }

  return { session, user, loading, error, signIn, signOut }
}
