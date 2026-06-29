'use client'

import { useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { insertAudit } from '@/lib/audit'
import { useAuth } from '@/hooks/useAuth'
import { CardTable } from '@/components/cards/CardTable'
import type { CardWithCustomer } from '@/types'

export default function SearchPage() {
  const { user } = useAuth()
  const [term, setTerm] = useState('')
  const [results, setResults] = useState<CardWithCustomer[]>([])
  const [searched, setSearched] = useState(false)

  const run = async () => {
    const q = term.trim()
    if (!q) return
    setSearched(true)
    if (user) await insertAudit(user.id, user.name, 'Searched', 'search', '-', q)

    const { data } = await supabase
      .from('cards')
      .select('*, customers!inner(*)')
      .or(`cif.ilike.%${q}%,name.ilike.%${q}%,company_org.ilike.%${q}%,branch_code.ilike.%${q}%`, { referencedTable: 'customers' })

    if (data && data.length > 0) {
      setResults(data as CardWithCustomer[])
      return
    }

    const { data: byAccount } = await supabase
      .from('cards')
      .select('*, customers(*)')
      .ilike('account_number', `%${q}%`)
    setResults((byAccount || []) as CardWithCustomer[])
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
            placeholder="Search by CIF, name, account number, company or branch"
            className="w-full rounded-lg border border-sage-300 bg-white py-2.5 pl-9 pr-3 text-sm text-ink outline-none placeholder:text-muted focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
          />
        </div>
        <button onClick={run} className="rounded-lg bg-teal-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">
          Search
        </button>
      </div>

      {searched && (
        <p className="text-sm text-muted">
          {results.length} {results.length === 1 ? 'match' : 'matches'} for{' '}
          <span className="font-medium text-ink">"{term}"</span>
        </p>
      )}

      {searched ? (
        <CardTable cards={results} />
      ) : (
        <div className="rounded-xl border border-dashed border-sage-300 bg-white px-6 py-12 text-center">
          <p className="text-sm font-medium text-ink">Find a customer</p>
          <p className="mt-1 text-sm text-muted">Search by CIF, name, account, company, or branch.</p>
        </div>
      )}
    </div>
  )
}
