-- ============================================
-- BSP Card Notification System — Stage 1 Schema
-- Run in Supabase SQL Editor
-- ============================================

-- ENUMS
create type card_product as enum ('BSP GOLD', 'BSP FIRST', 'BSP PLATINUM');
create type issuance_reason as enum ('green_to_gold', 'new_account', 'replacement');
create type card_status as enum ('Produced', 'Ready', 'Collected', 'Expired', 'Returned');
create type notification_status as enum ('Not Notified', 'Notified', 'Reminded');
create type notification_channel as enum ('sms', 'email');
create type delivery_status as enum ('queued', 'sent', 'delivered', 'failed');
create type user_role as enum ('officer', 'manager', 'admin');

-- USERS (linked to Supabase Auth)
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role user_role not null default 'officer',
  branch_code text not null,
  created_at timestamptz not null default now()
);

-- CUSTOMERS
create table customers (
  id uuid primary key default gen_random_uuid(),
  cif text unique not null,
  name text not null,
  company_org text not null default '',
  phone text not null default '',
  email text not null default '',
  branch_code text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- CARDS
create table cards (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  account_number text not null default '',
  product card_product not null default 'BSP GOLD',
  product_code text not null default '2012',
  issuance_reason issuance_reason not null default 'green_to_gold',
  access_card_applied boolean not null default true,
  officer text not null default '',
  card_status card_status not null default 'Produced',
  notification_status notification_status not null default 'Not Notified',
  applied_date timestamptz not null default now(),
  ready_at timestamptz,
  collected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- NOTIFICATIONS
create table notifications (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  channel notification_channel not null,
  message text not null,
  status delivery_status not null default 'queued',
  sent_at timestamptz not null default now(),
  created_by text not null default '',
  created_at timestamptz not null default now()
);

-- AUDIT LOGS
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  user_name text not null default '',
  action text not null,
  entity text not null,
  entity_id text not null default '',
  detail text not null default '',
  timestamp timestamptz not null default now()
);

-- INDEXES
create index idx_cards_customer_id on cards(customer_id);
create index idx_cards_status on cards(card_status);
create index idx_cards_notification_status on cards(notification_status);
create index idx_notifications_card_id on notifications(card_id);
create index idx_notifications_status on notifications(status);
create index idx_customers_cif on customers(cif);
create index idx_audit_logs_timestamp on audit_logs(timestamp desc);

-- UPDATED_AT TRIGGER
create or replace function update_updated_at()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

create trigger trg_customers_updated_at
  before update on customers
  for each row execute function update_updated_at();

create trigger trg_cards_updated_at
  before update on cards
  for each row execute function update_updated_at();

-- ROW LEVEL SECURITY
alter table users enable row level security;
alter table customers enable row level security;
alter table cards enable row level security;
alter table notifications enable row level security;
alter table audit_logs enable row level security;

-- RLS Policies: authenticated users can read + write all data
-- Stage 2 will tighten to branch-scoped policies
create policy "auth_read_users" on users for select using (auth.role() = 'authenticated');
create policy "auth_read_customers" on customers for select using (auth.role() = 'authenticated');
create policy "auth_insert_customers" on customers for insert with check (auth.role() = 'authenticated');
create policy "auth_update_customers" on customers for update using (auth.role() = 'authenticated');
create policy "auth_read_cards" on cards for select using (auth.role() = 'authenticated');
create policy "auth_insert_cards" on cards for insert with check (auth.role() = 'authenticated');
create policy "auth_update_cards" on cards for update using (auth.role() = 'authenticated');
create policy "auth_read_notifications" on notifications for select using (auth.role() = 'authenticated');
create policy "auth_insert_notifications" on notifications for insert with check (auth.role() = 'authenticated');
create policy "auth_update_notifications" on notifications for update using (auth.role() = 'authenticated');
create policy "auth_read_audit" on audit_logs for select using (auth.role() = 'authenticated');
create policy "auth_insert_audit" on audit_logs for insert with check (auth.role() = 'authenticated');
