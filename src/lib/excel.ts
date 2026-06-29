import * as XLSX from 'xlsx'
import type { Card, Customer } from '@/types'
import { ISSUANCE_LABEL } from '@/types'
import { ddmmyy, dateTime } from './format'

export interface ExportRow {
  card: Card
  customer: Customer
  lastNotified?: string
}

export function exportToExcel(rows: ExportRow[], includeContact: boolean) {
  const header = [
    'DATE', 'CLIENT NAME', 'COMPANY/ORGANISATION', 'PRODUCT', 'ACCOUNT #',
    'CIF #', 'BRANCH', 'GREEN TO GOLD', 'BSP OFFICER', 'ACCESS CARD APPLIED?',
    'CARD STATUS', 'NOTIFICATION STATUS', 'LAST NOTIFIED', 'COLLECTED DATE',
  ]
  if (includeContact) header.push('MOB#', 'EMAIL')

  const data = rows.map(({ card, customer, lastNotified }) => {
    const base = [
      ddmmyy(card.applied_date),
      customer.name,
      customer.company_org,
      card.product,
      card.account_number,
      customer.cif,
      customer.branch_code,
      ISSUANCE_LABEL[card.issuance_reason],
      card.officer,
      card.access_card_applied ? 'YES' : 'NO',
      card.card_status,
      card.notification_status,
      lastNotified ? dateTime(lastNotified) : '',
      card.collected_at ? ddmmyy(card.collected_at) : '',
    ]
    if (includeContact) base.push(customer.phone, customer.email)
    return base
  })

  const ws = XLSX.utils.aoa_to_sheet([header, ...data])
  const widths = [10, 24, 22, 14, 14, 12, 9, 16, 18, 18, 12, 18, 16, 14]
  if (includeContact) widths.push(18, 28)
  ws['!cols'] = widths.map((w) => ({ wch: w }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'CARD CUSTOMERS')
  const stamp = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `BSP_Card_Customers_${stamp}.xlsx`)
}

export interface ParsedIntakeRow {
  name: string
  companyOrg: string
  product: string
  accountNumber: string
  cif: string
  branchCode: string
  issuanceReason: string
  officer: string
  accessCardApplied: boolean
  phone: string
  email: string
}

function norm(s: unknown): string {
  return (s ?? '').toString().trim()
}

export async function parseIntakeFile(file: File): Promise<ParsedIntakeRow[]> {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: '', raw: false })

  const keyMap = (row: Record<string, unknown>) => {
    const out: Record<string, unknown> = {}
    for (const k of Object.keys(row)) {
      out[k.toString().toUpperCase().replace(/[^A-Z#]/g, '')] = row[k]
    }
    return out
  }

  const get = (r: Record<string, unknown>, ...keys: string[]) => {
    for (const k of keys) if (k in r && norm(r[k])) return norm(r[k])
    return ''
  }

  return rows
    .map((raw) => {
      const r = keyMap(raw)
      return {
        name: get(r, 'CLIENTNAME', 'NAME', 'CUSTOMERNAME'),
        companyOrg: get(r, 'COMPANYORGANISATION', 'COMPANYORG', 'COMPANY'),
        product: get(r, 'PRODUCT', 'CARDTYPE') || 'BSP GOLD',
        accountNumber: get(r, 'ACCOUNT#', 'ACCOUNTNO', 'ACCOUNT', 'ACC#'),
        cif: get(r, 'CIF#', 'CIF'),
        branchCode: get(r, 'BRANCH', 'BRANCHCODE'),
        issuanceReason: get(r, 'GREENTOGOLD', 'ISSUANCEREASON', 'REASON') || 'YES',
        officer: get(r, 'BSPOFFICER', 'OFFICER'),
        accessCardApplied: /y/i.test(get(r, 'ACCESSCARDAPPLIED#', 'ACCESSCARDAPPLIED', 'ACCESSCARD') || 'YES'),
        phone: get(r, 'MOB#', 'MOBILE', 'PHONE'),
        email: get(r, 'EMAIL'),
      }
    })
    .filter((r) => r.name || r.cif)
}
