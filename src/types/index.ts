export type Role = 'officer' | 'manager' | 'admin'
export type Product = 'BSP GOLD' | 'BSP FIRST' | 'BSP PLATINUM'
export type IssuanceReason = 'green_to_gold' | 'new_account' | 'replacement'
export type CardStatus = 'Produced' | 'Ready' | 'Collected' | 'Expired' | 'Returned'
export type NotificationStatus = 'Not Notified' | 'Notified' | 'Reminded'
export type Channel = 'sms' | 'email'
export type DeliveryStatus = 'queued' | 'sent' | 'delivered' | 'failed'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  branch_code: string
  created_at: string
}

export interface Customer {
  id: string
  cif: string
  name: string
  company_org: string
  phone: string
  email: string
  branch_code: string
  created_at: string
  updated_at: string
}

export interface Card {
  id: string
  customer_id: string
  account_number: string
  product: Product
  product_code: string
  issuance_reason: IssuanceReason
  access_card_applied: boolean
  officer: string
  card_status: CardStatus
  notification_status: NotificationStatus
  applied_date: string
  ready_at: string | null
  collected_at: string | null
  created_at: string
  updated_at: string
}

export interface CardWithCustomer extends Card {
  customers: Customer
}

export interface Notification {
  id: string
  card_id: string
  customer_id: string
  channel: Channel
  message: string
  status: DeliveryStatus
  sent_at: string
  created_by: string
  created_at: string
}

export interface NotificationWithCustomer extends Notification {
  customers: Customer
}

export interface AuditEntry {
  id: string
  user_id: string | null
  user_name: string
  action: string
  entity: string
  entity_id: string
  detail: string
  timestamp: string
}

export const ISSUANCE_LABEL: Record<IssuanceReason, string> = {
  green_to_gold: 'Green to Gold',
  new_account: 'New Account',
  replacement: 'Replacement',
}

export const PRODUCTS: Product[] = ['BSP GOLD', 'BSP FIRST', 'BSP PLATINUM']
export const CARD_STATUSES: CardStatus[] = ['Produced', 'Ready', 'Collected', 'Expired', 'Returned']
