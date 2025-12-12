import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { User } from '@/types'

export const mapUser = (authUser: SupabaseUser | null): User | null => {
  if (!authUser) return null

  return {
    id: authUser.id,
    email: authUser.email ?? '',
    full_name: (authUser.user_metadata?.full_name as string | undefined) ?? '',
    avatar_url: (authUser.user_metadata?.avatar_url as string | undefined) ?? undefined,
    created_at: authUser.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}
