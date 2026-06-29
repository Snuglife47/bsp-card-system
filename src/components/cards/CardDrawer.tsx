'use client'

import { useState, useEffect } from 'react'
import { X, Bell, BellRing, CheckCircle2, PackageCheck, Phone, Mail, Building2, Clock, ArchiveX } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useUIStore } from '@/store/useUIStore'
import { useAuth } from '@/hooks/useAuth'
import { insertAudit } from '@/lib/audit'
import { ISSUANCE_LABEL } from '@/types'
import type { Card, Customer, Notification } from '@/types'
import { Button } from '@/components/ui/Button'
import { ProductChip, CardStatusBadge, NotifBadge, DeliveryBadge } from '@/components/ui/Badge'
import { NotifyPreviewModal } from './NotifyPreviewModal'
import { ddmmyy, dateTime, relative } from '@/lib/format'

export function CardDrawer() {
  const cardId = useUIStore((s) => s.openCardId)
  const setOpenCard = useUIStore((s) => s.setOpenCard)
  const pushToast = useUIStore((s) => s.pushToast)
  const { user } = useAuth()

  const [card, setCard] = useState<Card | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preview, setPreview] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!cardId) { setCard(null); setCustomer(null); setNotifications([]); return }
    async function load() {
      const { data: c } = await supabase.from('cards').select('*').eq('id', cardId).single()
      if (!c) return
      setCard(c as Card)
      const { data: cu } = await supabase.from('customers').select('*').eq('id', c.customer_id).single()
      setCustomer(cu as Customer | null)
      const { data: ns } = await supabase.from('notifications').select('*').eq('card_id', cardId).order('sent_at', { ascending: false })
      setNotifications((ns || []) as Notification[])
    }
    load()
  }, [cardId, refreshKey])

  if (!cardId || !card || !customer) return null

  const refresh = () => setRefreshKey((k) => k + 1)

  const handleMarkReady = async () => {
    await supabase.from('cards').update({ card_status: 'Ready', ready_at: new Date().toISOString() }).eq('id', card.id)
    if (user) await insertAudit(user.id, user.name, 'Marked ready', 'card', card.id, '')
    pushToast({ tone: 'success', title: 'Card marked ready' })
    refresh()
  }

  const handleMarkCollected = async () => {
    await supabase.from('cards').update({ card_status: 'Collected', collected_at: new Date().toISOString() }).eq('id', card.id)
    if (user) await insertAudit(user.id, user.name, 'Marked collected', 'card', card.id, customer.name)
    pushToast({ tone: 'success', title: 'Card marked collected', body: customer.name })
    refresh()
  }

  const handleMarkExpired = async () => {
    await supabase.from('cards').update({ card_status: 'Expired' }).eq('id', card.id)
    if (user) await insertAudit(user.id, user.name, 'Marked expired', 'card', card.id, customer.name)
    pushToast({ tone: 'info', title: 'Card marked expired', body: customer.name })
    refresh()
  }

  const handleMarkReturned = async () => {
    await supabase.from('cards').update({ card_status: 'Returned' }).eq('id', card.id)
    if (user) await insertAudit(user.id, user.name, 'Marked returned', 'card', card.id, customer.name)
    pushToast({ tone: 'info', title: 'Card marked returned', body: customer.name })
    refresh()
  }

  const handleNotifyDone = () => {
    setPreview(false)
    refresh()
  }

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-teal-900/25" onClick={() => setOpenCard(null)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-sage-200 bg-sage-50 shadow-drawer">
        <header className="flex items-start justify-between gap-3 border-b border-sage-200 bg-white px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <ProductChip product={card.product} />
              <CardStatusBadge status={card.card_status} />
            </div>
            <h2 className="mt-2 truncate text-lg font-bold text-ink">{customer.name}</h2>
            <p className="ref text-xs text-muted">CIF {customer.cif}</p>
          </div>
          <button onClick={() => setOpenCard(null)} className="text-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {card.card_status === 'Produced' && (
              <Button variant="secondary" size="sm" onClick={handleMarkReady}>
                <PackageCheck className="h-4 w-4" /> Mark ready
              </Button>
            )}
            {card.card_status !== 'Collected' && card.card_status !== 'Expired' && card.card_status !== 'Returned' && (
              <Button size="sm" onClick={() => setPreview(true)}>
                {card.notification_status === 'Not Notified' ? (
                  <><Bell className="h-4 w-4" /> Notify</>
                ) : (
                  <><BellRing className="h-4 w-4" /> Send reminder</>
                )}
              </Button>
            )}
            {card.card_status === 'Ready' && (
              <>
                <Button variant="secondary" size="sm" onClick={handleMarkCollected}>
                  <CheckCircle2 className="h-4 w-4" /> Mark collected
                </Button>
                <Button variant="secondary" size="sm" onClick={handleMarkExpired}>
                  <Clock className="h-4 w-4" /> Mark expired
                </Button>
                <Button variant="secondary" size="sm" onClick={handleMarkReturned}>
                  <ArchiveX className="h-4 w-4" /> Mark returned
                </Button>
              </>
            )}
          </div>

          <Section title="Contact">
            <Row icon={<Phone className="h-4 w-4" />} label="Mobile" value={customer.phone || '—'} mono />
            <Row icon={<Mail className="h-4 w-4" />} label="Email" value={customer.email || 'none on file'} />
            <Row icon={<Building2 className="h-4 w-4" />} label="Company" value={customer.company_org} />
          </Section>

          <Section title="Card">
            <Row label="Account #" value={card.account_number} mono />
            <Row label="Branch" value={customer.branch_code} mono />
            <Row label="Issuance reason" value={ISSUANCE_LABEL[card.issuance_reason]} />
            <Row label="Officer" value={card.officer} />
            <Row label="Applied" value={ddmmyy(card.applied_date)} />
            <Row label="Ready" value={card.ready_at ? `${ddmmyy(card.ready_at)} (${relative(card.ready_at)})` : '—'} />
            <Row label="Collected" value={card.collected_at ? ddmmyy(card.collected_at) : '—'} />
            <Row label="Notification" value={<NotifBadge status={card.notification_status} />} />
          </Section>

          <Section title={`Notification history (${notifications.length})`}>
            {notifications.length === 0 && (
              <p className="text-sm text-muted">No notifications yet.</p>
            )}
            <ul className="space-y-2">
              {notifications.map((n) => (
                <li key={n.id} className="rounded-lg border border-sage-200 bg-white p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-teal-800">{n.channel}</span>
                    <DeliveryBadge status={n.status} />
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-ink">{n.message.split('\n')[0]}</p>
                  <p className="mt-1 text-[11px] text-muted">{dateTime(n.sent_at)} · {n.created_by}</p>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </aside>

      <NotifyPreviewModal
        open={preview}
        onClose={() => setPreview(false)}
        onDone={handleNotifyDone}
        card={card}
        customer={customer}
      />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-sage-200 bg-white p-3.5">
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">{title}</h4>
      <div className="space-y-1.5">{children}</div>
    </section>
  )
}

function Row({ icon, label, value, mono }: { icon?: React.ReactNode; label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-1.5 text-muted">{icon}{label}</span>
      <span className={`text-right font-medium text-ink ${mono ? 'ref' : ''}`}>{value}</span>
    </div>
  )
}
