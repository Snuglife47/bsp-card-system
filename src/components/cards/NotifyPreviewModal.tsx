'use client'

import { useState } from 'react'
import { MessageSquare, Mail } from 'lucide-react'
import type { Card, Customer } from '@/types'
import { buildSms, buildEmail } from '@/lib/notify'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store/useUIStore'

interface Props {
  open: boolean
  onClose: () => void
  onDone: () => void
  card: Card | null
  customer: Customer | null
}

export function NotifyPreviewModal({ open, onClose, onDone, card, customer }: Props) {
  const pushToast = useUIStore((s) => s.pushToast)
  const [busy, setBusy] = useState(false)

  if (!card || !customer) return null

  const reminder = card.notification_status !== 'Not Notified'
  const sms = buildSms(card, customer, reminder)
  const email = buildEmail(card, customer, reminder)

  const handleConfirm = async () => {
    setBusy(true)
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: card.id }),
      })
      const data = await res.json()
      if (data.ok) {
        pushToast({
          tone: 'success',
          title: reminder ? 'Reminder sent' : 'Notification sent',
          body: `${customer.name} — SMS${customer.email ? ' + email' : ''} (real email via Resend)`,
        })
        onDone()
      } else {
        pushToast({ tone: 'error', title: 'Not sent', body: data.reason })
        onClose()
      }
    } catch {
      pushToast({ tone: 'error', title: 'Error', body: 'Failed to send notification' })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={reminder ? 'Send reminder' : 'Notify customer'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={busy}>
            {busy ? 'Sending...' : reminder ? 'Send reminder' : 'Send notification'}
          </Button>
        </>
      }
    >
      <p className="mb-4 text-sm text-muted">
        This is the message that will be sent to{' '}
        <span className="font-semibold text-ink">{customer.name}</span>.
        {customer.email
          ? ' A real email will be delivered via Resend. SMS is simulated.'
          : ' SMS is simulated — no email on file.'}
      </p>

      <div className="space-y-3">
        <div className="rounded-xl border border-sage-200 bg-sage-50 p-3">
          <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-800">
            <MessageSquare className="h-4 w-4" /> SMS to{' '}
            <span className="ref normal-case text-ink">{customer.phone || 'no number on file'}</span>
          </div>
          <p className="text-sm text-ink">{sms}</p>
        </div>

        <div className="rounded-xl border border-sage-200 bg-sage-50 p-3">
          <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-800">
            <Mail className="h-4 w-4" /> Email to{' '}
            <span className="normal-case text-ink">{customer.email || 'no email on file'}</span>
          </div>
          {customer.email ? (
            <>
              <p className="text-sm font-semibold text-ink">{email.subject}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-ink">{email.body}</p>
            </>
          ) : (
            <p className="text-sm text-muted">No email on file — SMS will be sent on its own.</p>
          )}
        </div>
      </div>
    </Modal>
  )
}
