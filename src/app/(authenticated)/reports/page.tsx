'use client'

import { useEffect, useMemo, useState } from 'react'
import { FileSpreadsheet } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { exportToExcel } from '@/lib/excel'
import type { ExportRow } from '@/lib/excel'
import { CardTable } from '@/components/cards/CardTable'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store/useUIStore'
import type { CardWithCustomer, CardStatus, Product, Notification } from '@/types'
import { PRODUCTS, CARD_STATUSES } from '@/types'

export default function ReportsPage() {
  const pushToast = useUIStore((s) => s.pushToast)
  const [cards, setCards] = useState<CardWithCustomer[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [product, setProduct] = useState<Product | 'All'>('All')
  const [status, setStatus] = useState<CardStatus | 'All'>('All')
  const [branch, setBranch] = useState('All')
  const [includeContact, setIncludeContact] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: c } = await supabase.from('cards').select('*, customers(*)').order('created_at', { ascending: false })
      setCards((c || []) as CardWithCustomer[])
      const { data: n } = await supabase.from('notifications').select('*')
      setNotifications((n || []) as Notification[])
    }
    load()
  }, [])

  const branches = useMemo(() => {
    const set = new Set(cards.map((c) => c.customers?.branch_code).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [cards])

  const filtered = useMemo(() => {
    return cards.filter((card) => {
      if (product !== 'All' && card.product !== product) return false
      if (status !== 'All' && card.card_status !== status) return false
      if (branch !== 'All' && card.customers?.branch_code !== branch) return false
      return true
    })
  }, [cards, product, status, branch])

  const doExport = () => {
    const rows: ExportRow[] = filtered.map((card) => {
      const ns = notifications.filter((n) => n.card_id === card.id).sort((a, b) => b.sent_at.localeCompare(a.sent_at))
      return { card, customer: card.customers, lastNotified: ns[0]?.sent_at }
    })
    exportToExcel(rows, includeContact)
    pushToast({ tone: 'success', title: 'Excel exported', body: `${rows.length} rows` })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-sage-200 bg-white p-4 shadow-card">
        <FilterSelect label="Product" value={product} onChange={(v) => setProduct(v as Product | 'All')} options={['All', ...PRODUCTS]} />
        <FilterSelect label="Card status" value={status} onChange={(v) => setStatus(v as CardStatus | 'All')} options={['All', ...CARD_STATUSES]} />
        <FilterSelect label="Branch" value={branch} onChange={setBranch} options={branches} />
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={includeContact} onChange={(e) => setIncludeContact(e.target.checked)} className="h-4 w-4 rounded border-sage-300 text-teal-700 focus:ring-teal-600" />
          Include MOB# / EMAIL
        </label>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted">{filtered.length} rows</span>
          <Button onClick={doExport}><FileSpreadsheet className="h-4 w-4" /> Export Excel</Button>
        </div>
      </div>
      <p className="text-sm text-muted">The export mirrors your GOLD_CUSTOMER sheet, plus card status, notification status, last-notified, and collected dates.</p>
      <CardTable cards={filtered} />
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border border-sage-300 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}
