'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { dateTime } from '@/lib/format'
import type { AuditEntry } from '@/types'

export default function AuditPage() {
  const [audit, setAudit] = useState<AuditEntry[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
      setAudit((data || []) as AuditEntry[])
    }
    load()
  }, [])

  return (
    <div className="overflow-hidden rounded-xl border border-sage-200 bg-white shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-sage-200 bg-sage-50 text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-2.5 font-semibold">When</th>
            <th className="px-4 py-2.5 font-semibold">User</th>
            <th className="px-4 py-2.5 font-semibold">Action</th>
            <th className="px-4 py-2.5 font-semibold">Detail</th>
          </tr>
        </thead>
        <tbody>
          {audit.map((a) => (
            <tr key={a.id} className="border-b border-sage-100 last:border-0">
              <td className="px-4 py-2.5 text-xs text-muted">{dateTime(a.timestamp)}</td>
              <td className="px-4 py-2.5 text-ink">{a.user_name}</td>
              <td className="px-4 py-2.5 font-medium text-ink">{a.action}</td>
              <td className="px-4 py-2.5 text-muted">{a.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
