import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase-server'
import { sendNotificationEmail } from '@/lib/resend'

export async function POST(request: Request) {
  const { notificationId } = await request.json()
  const sb = getServiceClient()

  const { data: n } = await sb.from('notifications').select('*').eq('id', notificationId).single()
  if (!n) return NextResponse.json({ ok: false, reason: 'Notification not found' })

  let newStatus = 'delivered'

  if (n.channel === 'email') {
    const { data: customer } = await sb.from('customers').select('email').eq('id', n.customer_id).single()
    if (customer?.email) {
      const lines = (n.message as string).split('\n\n')
      const subject = lines[0] || 'BSP Card Notification'
      const body = lines.slice(1).join('\n\n') || n.message
      const result = await sendNotificationEmail(customer.email, subject, body)
      newStatus = result.success ? 'delivered' : 'failed'
    }
  }

  await sb.from('notifications').update({
    status: newStatus,
    sent_at: new Date().toISOString(),
  }).eq('id', notificationId)

  await sb.from('audit_logs').insert({
    user_name: 'Officer',
    action: 'Retried notification',
    entity: 'notification',
    entity_id: notificationId,
    detail: n.channel,
  })

  return NextResponse.json({ ok: true })
}
