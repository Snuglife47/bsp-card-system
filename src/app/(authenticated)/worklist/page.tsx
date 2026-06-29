'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CardTable } from '@/components/cards/CardTable'
import type { CardWithCustomer } from '@/types'

type Filter = 'not_notified' | 'all_ready' | 'reminded'

export default function WorklistPage() {
  const [cards, setCards] = useState<CardWithCustomer[]>([])
  const [filter, setFilter] = useState<Filter>('not_notified')

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('cards')
        .select('*, customers(*)')
        .eq('card_status', 'Ready')
        .order('ready_at', { ascending: true })
      setCards((data || []) as CardWithCustomer[])
    }
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

  const list = useMemo(() => {
    if (filter === 'not_notified') return cards.filter((c) => c.notification_status === 'Not Notified')
    if (filter === 'reminded') return cards.filter((c) => c.notification_status === 'Reminded')
    return cards
  }, [cards, filter])

  const counts = useMemo(() => ({
    not_notified: cards.filter((c) => c.notification_status === 'Not Notified').length,
    all_ready: cards.length,
    reminded: cards.filter((c) => c.notification_status === 'Reminded').length,
  }), [cards])

  const tabs: { key: Filter; label: string }[] = [
    { key: 'not_notified', label: 'Not notified' },
    { key: 'all_ready', label: 'All ready' },
    { key: 'reminded', label: 'Reminded' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              filter === t.key
                ? 'bg-teal-900 text-white'
                : 'bg-white text-teal-900 ring-1 ring-sage-300 hover:bg-sage-50'
            }`}
          >
            {t.label}
            <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${filter === t.key ? 'bg-white/20' : 'bg-sage-100 text-muted'}`}>
              {counts[t.key]}
            </span>
          </button>
        ))}
      </div>
      <p className="text-sm text-muted">Click any card to open it, preview the exact message, and notify the customer.</p>
      <CardTable cards={list} />
    </div>
  )
}
