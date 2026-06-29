'use client'

import { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { ProductChip, CardStatusBadge, NotifBadge } from '@/components/ui/Badge'
import { ddmmyy, relative } from '@/lib/format'
import { useUIStore } from '@/store/useUIStore'
import type { CardWithCustomer } from '@/types'

const col = createColumnHelper<CardWithCustomer>()

export function CardTable({ cards }: { cards: CardWithCustomer[] }) {
  const setOpenCard = useUIStore((s) => s.setOpenCard)
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(() => [
    col.accessor((r) => r.customers?.name, {
      id: 'customer',
      header: 'Customer',
      cell: (info) => (
        <div>
          <div className="font-medium text-ink">{info.getValue()}</div>
          <div className="text-xs text-muted">{info.row.original.customers?.company_org}</div>
        </div>
      ),
    }),
    col.accessor('product', {
      header: 'Product',
      cell: (info) => <ProductChip product={info.getValue()} />,
    }),
    col.accessor((r) => r.customers?.cif, {
      id: 'cif',
      header: 'CIF',
      cell: (info) => <span className="ref text-xs text-ink">{info.getValue()}</span>,
    }),
    col.accessor((r) => r.customers?.branch_code, {
      id: 'branch',
      header: 'Branch',
      cell: (info) => <span className="ref text-xs text-ink">{info.getValue()}</span>,
    }),
    col.accessor('card_status', {
      header: 'Card status',
      cell: (info) => <CardStatusBadge status={info.getValue()} />,
    }),
    col.accessor('notification_status', {
      header: 'Notification',
      cell: (info) => <NotifBadge status={info.getValue()} />,
    }),
    col.accessor('ready_at', {
      header: 'Ready',
      cell: (info) => {
        const v = info.getValue()
        const collected = info.row.original.collected_at
        return (
          <span className="text-xs text-muted">
            {v ? relative(v) : '—'}
            {collected && (
              <span className="block text-emerald-600">
                collected {ddmmyy(collected)}
              </span>
            )}
          </span>
        )
      },
    }),
  ], [])

  const table = useReactTable({
    data: cards,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  })

  if (cards.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-sage-300 bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-ink">Nothing here yet</p>
        <p className="mt-1 text-sm text-muted">When cards match, they'll show up in this list.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-sage-200 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-sage-200 bg-sage-50 text-left text-xs uppercase tracking-wide text-muted">
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    onClick={h.column.getToggleSortingHandler()}
                    className="px-4 py-2.5 font-semibold cursor-pointer select-none hover:text-ink"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {{ asc: ' ↑', desc: ' ↓' }[h.column.getIsSorted() as string] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => setOpenCard(row.original.id)}
                className="cursor-pointer border-b border-sage-100 transition last:border-0 hover:bg-sage-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between border-t border-sage-200 px-4 py-2">
          <span className="text-xs text-muted">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex gap-1">
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="rounded px-2 py-1 text-xs text-teal-800 hover:bg-sage-100 disabled:opacity-40">Prev</button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="rounded px-2 py-1 text-xs text-teal-800 hover:bg-sage-100 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
