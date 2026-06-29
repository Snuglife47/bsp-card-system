import { supabase } from './supabase'

export async function insertAudit(
  userId: string | null,
  userName: string,
  action: string,
  entity: string,
  entityId: string,
  detail: string,
) {
  await supabase.from('audit_logs').insert({
    user_id: userId,
    user_name: userName,
    action,
    entity,
    entity_id: entityId,
    detail,
  })
}
