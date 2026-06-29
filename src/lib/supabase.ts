import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let _supabase: SupabaseClient | null = null

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!isSupabaseConfigured) return undefined
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
