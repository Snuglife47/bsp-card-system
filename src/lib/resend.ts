import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendNotificationEmail(
  to: string,
  subject: string,
  body: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'BSP Cards <onboarding@resend.dev>',
      to,
      subject,
      text: body,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}
