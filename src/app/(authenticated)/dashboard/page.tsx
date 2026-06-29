'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { StatCard } from '@/components/ui/StatCard'
import { relative } from '@/lib/format'
import type { CardWithCustomer, Notification, AuditEntry } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const [cards, setCards] = useState<CardWithCustomer[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [audit, setAudit] = useState<AuditEntry[]>([])

  useEffect(() => {
    async function load() {
      const { data: c } = await supabase.from('cards').select('*, customers(*)').order('created_at', { ascending: false })
      setCards((c || []) as CardWithCustomer[])
      const { data: n } = await supabase.from('notifications').select('*')
      setNotifications((n || []) as Notification[])
      const { data: a } = await supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(8)
      setAudit((a || []) as AuditEntry[])
    }
    load()
  }, [])

  const m = useMemo(() => {
    const ready = cards.filter((c) => c.card_status === 'Ready')
    const collected = cards.filter((c) => c.card_status === 'Collected')
    const outstanding = ready.filter((c) => c.notification_status === 'Not Notified')
    const eligible = ready.length + collected.length
    const rate = eligible ? Math.round((collected.length / eligible) * 100) : 0
    const failed = notifications.filter((n) => n.status === 'failed')

    const byBranch: Record<string, number> = {}
    for (const c of ready) {
      const b = c.customers?.branch_code || '—'
      byBranch[b] = (byBranch[b] || 0) + 1
    }
    const branchRows = Object.entries(byBranch).sort((a, b) => b[1] - a[1]).slice(0, 6)
    const maxBranch = branchRows.reduce((mx, [, n]) => Math.max(mx, n), 1)

    return { ready: ready.length, collected: collected.length, outstanding: outstanding.length, sent: notifications.length, failed: failed.length, rate, branchRows, maxBranch }
  }, [cards, notifications])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <button onClick={() => router.push('/worklist')} className="text-left">
          <StatCard label="Outstanding" value={m.outstanding} hint="ready, not yet notified" accent="amber" />
        </button>
        <StatCard label="Cards ready" value={m.ready} hint="waiting for collection" />
        <StatCard label="Collected" value={m.collected} hint={`${m.rate}% collection rate`} accent="plain" />
        <StatCard label="Notifications sent" value={m.sent} hint={m.failed ? `${m.failed} failed` : 'all delivered'} />
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <section className="lg:col-span-2 rounded-xl border border-sage-200 bg-white p-4 shadow-card">
          <h3 className="text-sm font-bold text-ink">Ready cards by branch</h3>
          <p className="mb-3 text-xs text-muted">Where the collection backlog is sitting</p>
          <div className="space-y-2.5">
            {m.branchRows.map(([branch, n]) => (
              <div key={branch} className="flex items-center gap-3">
                <span className="ref w-10 shrink-0 text-xs text-muted">{branch}</span>
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-sage-100">
                  <div className="h-full rounded-full bg-teal-700" style={{ width: `${(n / m.maxBranch) * 100}%` }} />
                </div>
                <span className="w-6 shrink-0 text-right text-xs font-semibold text-ink">{n}</span>
              </div>
            ))}
            {m.branchRows.length === 0 && <p className="text-sm text-muted">No ready cards.</p>}
          </div>
        </section>

        <section className="lg:col-span-3 rounded-xl border border-sage-200 bg-white p-4 shadow-card">
          <h3 className="text-sm font-bold text-ink">Recent activity</h3>
          <p className="mb-3 text-xs text-muted">The audit trail in brief</p>
          <ul className="divide-y divide-sage-100">
            {audit.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="min-w-0">
                  <span className="font-medium text-ink">{a.action}</span>{' '}
                  {a.detail && <span className="text-muted">— {a.detail}</span>}
                </span>
                <span className="shrink-0 text-xs text-muted">{relative(a.timestamp)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
