'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, MailWarning } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { DeliveryBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store/useUIStore'
import { dateTime } from '@/lib/format'
import type { NotificationWithCustomer } from '@/types'

export default function FailedPage() {
  const pushToast = useUIStore((s) => s.pushToast)
  const setOpenCard = useUIStore((s) => s.setOpenCard)
  const [failed, setFailed] = useState<NotificationWithCustomer[]>([])

  const load = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*, customers(*)')
      .eq('status', 'failed')
      .order('sent_at', { ascending: false })
    setFailed((data || []) as NotificationWithCustomer[])
  }

  useEffect(() => { load() }, [])

  const handleRetry = async (id: string, customerName: string, channel: string) => {
    const res = await fetch('/api/retry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId: id }),
    })
    const data = await res.json()
    if (data.ok) {
      pushToast({ tone: 'success', title: 'Retried', body: `${customerName} — ${channel}` })
      load()
    } else {
      pushToast({ tone: 'error', title: 'Retry failed', body: data.reason })
    }
  }

  if (failed.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-sage-300 bg-white px-6 py-12 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-50">
          <MailWarning className="h-6 w-6 text-emerald-600" />
        </div>
        <p className="mt-3 text-sm font-medium text-ink">No failed notifications</p>
        <p className="mt-1 text-sm text-muted">Everything that has been sent was delivered.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">These didn't reach the customer. Retry to send again.</p>
      <div className="overflow-hidden rounded-xl border border-sage-200 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sage-200 bg-sage-50 text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-2.5 font-semibold">Customer</th>
              <th className="px-4 py-2.5 font-semibold">Channel</th>
              <th className="px-4 py-2.5 font-semibold">When</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {failed.map((n) => (
              <tr key={n.id} className="border-b border-sage-100 last:border-0">
                <td className="px-4 py-2.5">
                  <button onClick={() => setOpenCard(n.card_id)} className="font-medium text-teal-800 hover:underline">
                    {n.customers?.name || 'Unknown'}
                  </button>
                </td>
                <td className="px-4 py-2.5 uppercase text-xs text-muted">{n.channel}</td>
                <td className="px-4 py-2.5 text-xs text-muted">{dateTime(n.sent_at)}</td>
                <td className="px-4 py-2.5"><DeliveryBadge status={n.status} /></td>
                <td className="px-4 py-2.5 text-right">
                  <Button size="sm" variant="secondary" onClick={() => handleRetry(n.id, n.customers?.name || '', n.channel)}>
                    <RefreshCw className="h-3.5 w-3.5" /> Retry
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
