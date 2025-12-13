import { createClient } from '@supabase/supabase-js'

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL
const rawSupabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const sanitizeEnv = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/^['"]|['"]$/g, '')
}

const supabaseUrl = sanitizeEnv(rawSupabaseUrl)
const supabaseKey = sanitizeEnv(rawSupabaseKey)

const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (_) {
    return false
  }
}

export const supabaseConfigError =
  !supabaseUrl || !supabaseKey
    ? 'Missing Supabase environment variables'
    : !isValidHttpUrl(supabaseUrl)
      ? 'Invalid VITE_SUPABASE_URL: Must be a valid HTTP or HTTPS URL.'
      : null

export const supabase = supabaseConfigError ? null : createClient(supabaseUrl, supabaseKey)
