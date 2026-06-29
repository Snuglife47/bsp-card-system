'use client'

import type { CardStatus, NotificationStatus, Product, DeliveryStatus } from '@/types'

export function ProductChip({ product }: { product: Product }) {
  const map: Record<Product, { bg: string; fg: string; ring: string }> = {
    'BSP GOLD': { bg: 'bg-gold-chip', fg: 'text-gold-text', ring: 'ring-gold-ring' },
    'BSP PLATINUM': { bg: 'bg-plat-chip', fg: 'text-plat-text', ring: 'ring-plat-ring' },
    'BSP FIRST': { bg: 'bg-sage-200', fg: 'text-teal-800', ring: 'ring-sage-300' },
  }
  const s = map[product]
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ${s.bg} ${s.fg} ${s.ring}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {product.replace('BSP ', '')}
    </span>
  )
}

export function CardStatusBadge({ status }: { status: CardStatus }) {
  const map: Record<CardStatus, string> = {
    Produced: 'bg-sage-100 text-muted ring-sage-300',
    Ready: 'bg-teal-700/10 text-teal-800 ring-teal-700/30',
    Collected: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    Expired: 'bg-amber-soft text-amber ring-amber/30',
    Returned: 'bg-danger-soft text-danger ring-danger/30',
  }
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${map[status]}`}>
      {status}
    </span>
  )
}

export function NotifBadge({ status }: { status: NotificationStatus }) {
  const map: Record<NotificationStatus, string> = {
    'Not Notified': 'bg-sage-100 text-muted ring-sage-300',
    Notified: 'bg-teal-700/10 text-teal-800 ring-teal-700/30',
    Reminded: 'bg-amber-soft text-amber ring-amber/30',
  }
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${map[status]}`}>
      {status}
    </span>
  )
}

export function DeliveryBadge({ status }: { status: DeliveryStatus }) {
  const map: Record<DeliveryStatus, string> = {
    queued: 'bg-sage-100 text-muted ring-sage-300',
    sent: 'bg-teal-700/10 text-teal-800 ring-teal-700/30',
    delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    failed: 'bg-danger-soft text-danger ring-danger/30',
  }
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ${map[status]}`}>
      {status}
    </span>
  )
}
