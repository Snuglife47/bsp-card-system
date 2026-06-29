'use client'

import { useEffect, useState, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'
import { Toasts } from '@/components/Toasts'
import { CardDrawer } from '@/components/cards/CardDrawer'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

const TITLES: Record<string, { title: string; sub: string }> = {
  '/dashboard': { title: 'Dashboard', sub: 'Card operations at a glance' },
  '/worklist': { title: 'Ready worklist', sub: 'Cards waiting to be collected' },
  '/search': { title: 'Search', sub: 'Find a customer or card' },
  '/intake': { title: 'Card intake', sub: 'Bring produced cards into the system' },
  '/reports': { title: 'Reports & export', sub: 'Filter and export to Excel' },
  '/failed': { title: 'Failed notifications', sub: 'Messages that need a retry' },
  '/audit': { title: 'Audit log', sub: 'Every action, recorded' },
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [outstandingCount, setOutstandingCount] = useState(0)
  const [failedCount, setFailedCount] = useState(0)

  useEffect(() => {
    async function fetchCounts() {
      const { count: outstanding } = await supabase
        .from('cards')
        .select('*', { count: 'exact', head: true })
        .eq('card_status', 'Ready')
        .eq('notification_status', 'Not Notified')
      setOutstandingCount(outstanding ?? 0)

      const { count: failed } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'failed')
      setFailedCount(failed ?? 0)
    }
    fetchCounts()
    const interval = setInterval(fetchCounts, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const t = useMemo(() => TITLES[pathname] || { title: 'BSP Cards', sub: '' }, [pathname])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-sage-50">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-sage-50">
      <Sidebar outstandingCount={outstandingCount} failedCount={failedCount} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={t.title} subtitle={t.sub} user={user} onSignOut={handleSignOut} />
        <MobileNav />
        <main className="flex-1 overflow-y-auto p-5">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
      <CardDrawer />
      <Toasts />
    </div>
  )
}
