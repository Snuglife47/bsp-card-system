'use client'

import type { ReactNode } from 'react'

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string
  value: ReactNode
  hint?: string
  accent?: 'teal' | 'amber' | 'plain'
}) {
  const bar =
    accent === 'amber' ? 'bg-amber' : accent === 'plain' ? 'bg-sage-300' : 'bg-teal-700'
  return (
    <div className="relative overflow-hidden rounded-xl border border-sage-200 bg-white p-4 shadow-card">
      <span className={`absolute left-0 top-0 h-full w-1 ${bar}`} />
      <div className="pl-1">
        <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
        <div className="mt-1 text-2xl font-bold text-ink">{value}</div>
        {hint && <div className="mt-0.5 text-xs text-muted">{hint}</div>}
      </div>
    </div>
  )
}
