'use client'

import { useEffect } from 'react'
import { CheckCircle2, Info, XCircle, X } from 'lucide-react'
import { useUIStore } from '@/store/useUIStore'

export function Toasts() {
  const toasts = useUIStore((s) => s.toasts)
  const dismiss = useUIStore((s) => s.dismissToast)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} id={t.id} title={t.title} body={t.body} tone={t.tone} onDismiss={dismiss} />
      ))}
    </div>
  )
}

function ToastItem({
  id,
  title,
  body,
  tone,
  onDismiss,
}: {
  id: string
  title: string
  body?: string
  tone: 'success' | 'info' | 'error'
  onDismiss: (id: string) => void
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 4200)
    return () => clearTimeout(timer)
  }, [id, onDismiss])

  const colors = {
    success: 'border-emerald-200 bg-emerald-50',
    info: 'border-teal-200 bg-teal-50',
    error: 'border-danger bg-danger-soft',
  }
  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
    info: <Info className="h-4 w-4 text-teal-700" />,
    error: <XCircle className="h-4 w-4 text-danger" />,
  }

  return (
    <div
      className={`flex items-start gap-2 rounded-xl border p-3 shadow-card ${colors[tone]}`}
      style={{ minWidth: 280, maxWidth: 360 }}
    >
      <div className="mt-0.5 shrink-0">{icons[tone]}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-ink">{title}</div>
        {body && <div className="mt-0.5 text-xs text-muted">{body}</div>}
      </div>
      <button onClick={() => onDismiss(id)} className="shrink-0 text-muted hover:text-ink">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
