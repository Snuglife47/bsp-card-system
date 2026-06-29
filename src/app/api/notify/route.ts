import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase-server'
import { sendNotificationEmail } from '@/lib/resend'
import { buildSms, buildEmail } from '@/lib/notify'
import type { Card, Customer } from '@/types'

export async function POST(request: Request) {
  const { cardId } = await request.json()
  const sb = getServiceClient()

  const { data: card } = await sb.from('cards').select('*').eq('id', cardId).single()
  if (!card) return NextResponse.json({ ok: false, reason: 'Card not found' })

  const { data: customer } = await sb.from('customers').select('*').eq('id', card.customer_id).single()
  if (!customer) return NextResponse.json({ ok: false, reason: 'Customer not found' })

  const c = card as Card
  const cu = customer as Customer
  const reminder = c.notification_status !== 'Not Notified'

  const twelveHoursAgo = new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  const { data: recent } = await sb
    .from('notifications')
    .select('id')
    .eq('card_id', cardId)
    .gte('sent_at', twelveHoursAgo)
    .limit(1)
  if (recent && recent.length > 0) {
    return NextResponse.json({ ok: false, reason: 'A notification was already sent in the last 12 hours.' })
  }

  const now = new Date().toISOString()
  const smsText = buildSms(c, cu, reminder)

  await sb.from('notifications').insert({
    card_id: cardId,
    customer_id: cu.id,
    channel: 'sms',
    message: smsText,
    status: 'delivered',
    sent_at: now,
    created_by: 'Officer',
  })

  if (cu.email) {
    const emailDraft = buildEmail(c, cu, reminder)
    const result = await sendNotificationEmail(cu.email, emailDraft.subject, emailDraft.body)
    await sb.from('notifications').insert({
      card_id: cardId,
      customer_id: cu.id,
      channel: 'email',
      message: `${emailDraft.subject}\n\n${emailDraft.body}`,
      status: result.success ? 'delivered' : 'failed',
      sent_at: now,
      created_by: 'Officer',
    })
  }

  await sb.from('cards').update({
    notification_status: reminder ? 'Reminded' : 'Notified',
  }).eq('id', cardId)

  await sb.from('audit_logs').insert({
    user_name: 'Officer',
    action: reminder ? 'Sent reminder' : 'Notified customer',
    entity: 'card',
    entity_id: cardId,
    detail: `${cu.name} via SMS${cu.email ? ' + email' : ''}`,
  })

  return NextResponse.json({ ok: true })
}
