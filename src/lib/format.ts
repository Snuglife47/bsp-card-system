export function ddmmyy(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const dd = d.getDate().toString().padStart(2, '0')
  const mm = (d.getMonth() + 1).toString().padStart(2, '0')
  const yy = d.getFullYear().toString().slice(-2)
  return `${dd}.${mm}.${yy}`
}

export function dateTime(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return `${ddmmyy(iso)} ${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
}

export function daysBetween(iso?: string | null): number {
  if (!iso) return 0
  const then = new Date(iso).getTime()
  const now = Date.now()
  return Math.max(0, Math.floor((now - then) / 86400000))
}

export function relative(iso?: string | null): string {
  if (!iso) return ''
  const d = daysBetween(iso)
  if (d === 0) return 'today'
  if (d === 1) return 'yesterday'
  return `${d} days ago`
}
