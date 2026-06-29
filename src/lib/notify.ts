import { branchName } from './constants'
import type { Card, Customer, CardWithCustomer } from '@/types'

type CardLike = Card | CardWithCustomer

export function buildSms(card: CardLike, customer: Customer, reminder = false): string {
  const where = branchName(customer.branch_code)
  if (reminder) {
    return `BSP: Reminder — your ${card.product} card is still ready for collection at ${where}. Please bring valid ID.`
  }
  return `BSP: Your ${card.product} card is ready for collection at ${where}. Please bring valid ID.`
}

export interface EmailDraft {
  subject: string
  body: string
}

export function buildEmail(card: CardLike, customer: Customer, reminder = false): EmailDraft {
  const where = branchName(customer.branch_code)
  const subject = reminder
    ? 'Reminder: Your BSP Card Is Ready for Collection'
    : 'Your BSP Card Is Ready for Collection'
  const lead = reminder
    ? `This is a friendly reminder that your BSP ${card.product} card is still waiting for collection at the ${where} branch.`
    : `Your BSP ${card.product} card is now ready for collection at the ${where} branch.`
  const body = [
    `Dear ${customer.name},`,
    '',
    lead,
    '',
    'Please bring a valid form of identification when you collect your card.',
    '',
    'Thank you,',
    'BSP',
  ].join('\n')
  return { subject, body }
}
