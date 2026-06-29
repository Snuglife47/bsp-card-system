'use client'

import { useRef, useState } from 'react'
import { Upload, FilePlus2, CheckCircle2, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import { supabase } from '@/lib/supabase'
import { insertAudit } from '@/lib/audit'
import { useAuth } from '@/hooks/useAuth'
import { parseIntakeFile } from '@/lib/excel'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store/useUIStore'
import type { Product, IssuanceReason } from '@/types'

function reasonFromText(t: string): IssuanceReason {
  const s = t.toLowerCase()
  if (s.includes('replace')) return 'replacement'
  if (s.includes('new')) return 'new_account'
  return 'green_to_gold'
}

function productFromText(t: string): Product {
  const s = t.toUpperCase()
  if (s.includes('PLATIN')) return 'BSP PLATINUM'
  if (s.includes('FIRST')) return 'BSP FIRST'
  return 'BSP GOLD'
}

export default function IntakePage() {
  const { user } = useAuth()
  const pushToast = useUIStore((s) => s.pushToast)
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [mode, setMode] = useState<'upload' | 'manual'>('upload')

  const handleFile = async (file: File) => {
    setBusy(true)
    setResult(null)
    try {
      const rows = await parseIntakeFile(file)
      if (rows.length === 0) {
        pushToast({ tone: 'error', title: 'Nothing imported', body: 'No rows with a name or CIF were found.' })
        return
      }
      let created = 0, matchedNew = 0
      for (const row of rows) {
        let custId: string | null = null
        if (row.cif) {
          const { data: existing } = await supabase.from('customers').select('id').eq('cif', row.cif).single()
          if (existing) { custId = existing.id }
        }
        if (!custId) {
          const cif = row.cif || `AUTO_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
          const { data: newCust } = await supabase.from('customers').insert({
            cif, name: row.name, company_org: row.companyOrg, phone: row.phone,
            email: row.email, branch_code: row.branchCode,
          }).select('id').single()
          custId = newCust?.id ?? null
          matchedNew++
        }
        if (custId) {
          await supabase.from('cards').insert({
            customer_id: custId, account_number: row.accountNumber,
            product: productFromText(row.product), issuance_reason: reasonFromText(row.issuanceReason),
            access_card_applied: row.accessCardApplied,
            officer: row.officer || user?.name || 'Officer',
            card_status: 'Produced', notification_status: 'Not Notified',
          })
          created++
        }
      }
      setResult(`Imported ${created} card${created === 1 ? '' : 's'} — ${matchedNew} new customer${matchedNew === 1 ? '' : 's'} created.`)
      pushToast({ tone: 'success', title: 'Cards imported', body: `${created} added from ${file.name}` })
      if (user) await insertAudit(user.id, user.name, 'Imported cards', 'intake', '-', `${created} cards`)
    } catch {
      pushToast({ tone: 'error', title: 'Could not read file', body: 'Use a .xlsx or .csv with the officer-sheet columns.' })
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const downloadTemplate = () => {
    const header = ['DATE', 'CLIENT NAME', 'COMPANY/ORGANISATION', 'PRODUCT', 'ACCOUNT #', 'CIF #', 'BRANCH', 'GREEN TO GOLD', 'BSP OFFICER', 'ACCESS CARD APPLIED?', 'MOB#', 'EMAIL']
    const sample = ['01.06.26', 'Jane Doe', 'Self-employed', 'BSP GOLD', '1000123456', '0123456', '951', 'YES', 'Tessa Aila', 'YES', '+675 7000 0000', 'jane.doe@example.com']
    const ws = XLSX.utils.aoa_to_sheet([header, sample])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'TEMPLATE')
    XLSX.writeFile(wb, 'BSP_Card_Intake_Template.xlsx')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('upload')} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${mode === 'upload' ? 'bg-teal-900 text-white' : 'bg-white text-teal-900 ring-1 ring-sage-300 hover:bg-sage-50'}`}>Upload sheet</button>
        <button onClick={() => setMode('manual')} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${mode === 'manual' ? 'bg-teal-900 text-white' : 'bg-white text-teal-900 ring-1 ring-sage-300 hover:bg-sage-50'}`}>Add one manually</button>
      </div>

      {mode === 'upload' ? (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 rounded-xl border-2 border-dashed border-sage-300 bg-white p-8 text-center" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f) }}>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-sage-100">
              <Upload className="h-6 w-6 text-teal-700" />
            </div>
            <p className="mt-3 text-sm font-semibold text-ink">Drop the officer spreadsheet here</p>
            <p className="mt-1 text-sm text-muted">Upload the .xlsx or .csv you already keep.</p>
            <div className="mt-4 flex justify-center gap-2">
              <Button onClick={() => fileRef.current?.click()} disabled={busy}>{busy ? 'Reading…' : 'Choose file'}</Button>
              <Button variant="secondary" onClick={downloadTemplate}><Download className="h-4 w-4" /> Template</Button>
            </div>
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
            {result && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-left text-sm text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /><span>{result}</span>
              </div>
            )}
          </div>
          <aside className="rounded-xl border border-sage-200 bg-sage-50 p-4">
            <h4 className="text-sm font-bold text-ink">Recognised columns</h4>
            <ul className="mt-2 space-y-1 text-xs text-muted">
              {['DATE', 'CLIENT NAME', 'COMPANY/ORGANISATION', 'PRODUCT', 'ACCOUNT #', 'CIF #', 'BRANCH', 'GREEN TO GOLD', 'BSP OFFICER', 'ACCESS CARD APPLIED?', 'MOB#', 'EMAIL'].map((c) => <li key={c} className="ref">{c}</li>)}
            </ul>
            <p className="mt-3 text-xs text-muted">Header names are matched loosely.</p>
          </aside>
        </div>
      ) : (
        <ManualForm />
      )}
    </div>
  )
}

function ManualForm() {
  const { user } = useAuth()
  const pushToast = useUIStore((s) => s.pushToast)
  const [f, setF] = useState({ name: '', cif: '', companyOrg: '', phone: '', email: '', branchCode: '951', product: 'BSP GOLD' as Product, accountNumber: '', issuanceReason: 'green_to_gold' as IssuanceReason, officer: '' })
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }))
  const valid = f.name.trim() && f.cif.trim()

  const handleAdd = async () => {
    let custId: string | null = null
    if (f.cif) {
      const { data: existing } = await supabase.from('customers').select('id').eq('cif', f.cif).single()
      if (existing) custId = existing.id
    }
    if (!custId) {
      const { data: newCust } = await supabase.from('customers').insert({
        cif: f.cif || `AUTO_${Date.now()}`, name: f.name, company_org: f.companyOrg,
        phone: f.phone, email: f.email, branch_code: f.branchCode,
      }).select('id').single()
      custId = newCust?.id ?? null
    }
    if (custId) {
      await supabase.from('cards').insert({
        customer_id: custId, account_number: f.accountNumber,
        product: f.product, issuance_reason: f.issuanceReason,
        access_card_applied: true, officer: f.officer || user?.name || 'Officer',
        card_status: 'Produced', notification_status: 'Not Notified',
      })
      pushToast({ tone: 'success', title: 'Card added', body: `${f.name} — ${f.product}` })
      if (user) await insertAudit(user.id, user.name, 'Added card', 'card', f.cif, f.name)
      setF((p) => ({ ...p, name: '', cif: '', companyOrg: '', phone: '', email: '', accountNumber: '' }))
    }
  }

  return (
    <div className="max-w-2xl rounded-xl border border-sage-200 bg-white p-5 shadow-card">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Client name *"><Input value={f.name} onChange={(v) => set('name', v)} /></Field>
        <Field label="CIF # *"><Input value={f.cif} onChange={(v) => set('cif', v)} mono /></Field>
        <Field label="Company / organisation"><Input value={f.companyOrg} onChange={(v) => set('companyOrg', v)} /></Field>
        <Field label="Account #"><Input value={f.accountNumber} onChange={(v) => set('accountNumber', v)} mono /></Field>
        <Field label="Mobile"><Input value={f.phone} onChange={(v) => set('phone', v)} mono /></Field>
        <Field label="Email"><Input value={f.email} onChange={(v) => set('email', v)} /></Field>
        <Field label="Branch code"><Input value={f.branchCode} onChange={(v) => set('branchCode', v)} mono /></Field>
        <Field label="BSP officer"><Input value={f.officer} onChange={(v) => set('officer', v)} /></Field>
        <Field label="Product">
          <select value={f.product} onChange={(e) => set('product', e.target.value)} className="w-full rounded-lg border border-sage-300 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20">
            <option value="BSP GOLD">BSP GOLD</option>
            <option value="BSP FIRST">BSP FIRST</option>
            <option value="BSP PLATINUM">BSP PLATINUM</option>
          </select>
        </Field>
        <Field label="Issuance reason">
          <select value={f.issuanceReason} onChange={(e) => set('issuanceReason', e.target.value)} className="w-full rounded-lg border border-sage-300 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20">
            <option value="green_to_gold">Green to Gold</option>
            <option value="new_account">New Account</option>
            <option value="replacement">Replacement</option>
          </select>
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button disabled={!valid} onClick={handleAdd}><FilePlus2 className="h-4 w-4" /> Add card</Button>
        <span className="text-xs text-muted">New cards start in Produced status.</span>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>{children}</label>
}

function Input({ value, onChange, mono }: { value: string; onChange: (v: string) => void; mono?: boolean }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} className={`w-full rounded-lg border border-sage-300 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 ${mono ? 'ref' : ''}`} />
}
