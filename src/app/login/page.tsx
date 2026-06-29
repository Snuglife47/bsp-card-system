'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, user, loading, error: authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      console.log('[login] Already authenticated, redirecting...')
      router.replace('/dashboard')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (authError) {
      console.error('[login] Auth hook error:', authError)
    }
  }, [authError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const result = await signIn(email, password)
      if (result.error) {
        setError(result.error)
        setBusy(false)
      } else {
        console.log('[login] Sign in successful, redirecting...')
        router.replace('/dashboard')
      }
    } catch (err) {
      console.error('[login] Submit exception:', err)
      setError('Connection failed. Please try again.')
      setBusy(false)
    }
  }

  const displayError = error || authError

  return (
    <div className="flex min-h-full items-center justify-center bg-teal-900 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3 text-white">
          <Image src="/bsp-logo.svg" alt="BSP" width={44} height={44} className="rounded-xl" />
          <div>
            <div className="text-lg font-bold leading-tight">BSP Card Notifications</div>
            <div className="text-xs text-sage-200">Card officer console</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white p-6 shadow-drawer">
          <h1 className="text-xl font-bold text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-muted">
            Enter your credentials to access the card notification system.
          </p>

          {displayError && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-danger-soft p-3 text-sm text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {displayError}
            </div>
          )}

          <div className="mt-5 space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tessa.aila@demo.bsp"
                required
                className="w-full rounded-lg border border-sage-300 bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full rounded-lg border border-sage-300 bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={busy || loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-teal-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            {busy ? 'Signing in...' : loading ? 'Connecting...' : 'Sign in'}
          </button>

          <div className="mt-4 rounded-lg bg-sage-50 p-3">
            <p className="text-xs font-semibold text-ink">Demo accounts</p>
            <div className="mt-1 space-y-0.5 text-xs text-muted">
              <p>tessa.aila@demo.bsp — Officer (branch 951)</p>
              <p>boira.vele@demo.bsp — Officer (branch 968)</p>
              <p>marian.kepas@demo.bsp — Manager (branch 951)</p>
              <p>admin@demo.bsp — Admin (all branches)</p>
              <p className="mt-1 font-medium text-ink">Password: bsp2024</p>
            </div>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-sage-200/80">
          All data shown is synthetic. No real customer or staff records are used.
        </p>
      </div>
    </div>
  )
}
