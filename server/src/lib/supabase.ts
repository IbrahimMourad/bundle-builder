import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
}

export function createSupabaseClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase is not configured')
  }

  return createClient(url, key)
}
