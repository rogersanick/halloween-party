import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const createClient = (): SupabaseClient | null => {
  if (!supabaseUrl || !supabaseAnonKey) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn('Supabase not configured. Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
    }
    return null
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey) as unknown as SupabaseClient
}


