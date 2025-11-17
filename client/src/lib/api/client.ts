import type {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  PostgrestError,
  UserResponse,
} from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

export type ApiError = PostgrestError | AuthError | Error
export type ApiResult<T> = Promise<{ data: T; error: ApiError | null }>

type Tables = Database['public']['Tables']
export type ProfileRow = Tables['profiles']['Row']
type ProfileUpdate = Tables['profiles']['Update']
export type EventRow = Tables['events']['Row']
type EventInsert = Tables['events']['Insert']
type EventUpdate = Tables['events']['Update']
export type RsvpRow = Tables['rsvps']['Row']
type RsvpInsert = Tables['rsvps']['Insert']
export type RatingRow = Tables['ratings']['Row']
type RatingInsert = Tables['ratings']['Insert']
export type ReportRow = Tables['reports']['Row']
type ReportInsert = Tables['reports']['Insert']

type EventFilters = {
  sport?: string
  skill_level?: EventRow['skill_level']
}

const auth = {
  signIn: async (email: string, password: string): ApiResult<AuthTokenResponsePassword['data']> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  },
  signInWithOtp: async (email: string): ApiResult<AuthResponse['data']> => {
    const { data, error } = await supabase.auth.signInWithOtp({ email })
    return { data, error }
  },
  signUp: async (email: string, password: string, fullName: string): ApiResult<AuthResponse['data']> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    return { data, error }
  },
  signOut: async (): ApiResult<null> => {
    const { error } = await supabase.auth.signOut()
    return { data: null, error }
  },
  getSession: async (): ApiResult<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']> => {
    const { data, error } = await supabase.auth.getSession()
    return { data, error }
  },
  updateUser: async (
    attributes: Parameters<typeof supabase.auth.updateUser>[0]
  ): ApiResult<UserResponse['data']> => {
    const { data, error } = await supabase.auth.updateUser(attributes)
    return { data, error }
  },
}

const profiles = {
  getProfile: async (id: string): ApiResult<ProfileRow | null> => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
    return { data, error }
  },
  updateProfile: async (id: string, updates: ProfileUpdate): ApiResult<ProfileRow | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },
}

const events = {
  getEvents: async (filters: EventFilters = {}): ApiResult<EventRow[] | null> => {
    let query = supabase.from('events').select('*').order('start_time', { ascending: true })

    if (filters.sport) {
      query = query.eq('sport', filters.sport)
    }

    if (filters.skill_level) {
      query = query.eq('skill_level', filters.skill_level)
    }

    const { data, error } = await query
    return { data, error }
  },
  getEvent: async (id: string): ApiResult<EventRow | null> => {
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
    return { data, error }
  },
  createEvent: async (payload: EventInsert): ApiResult<EventRow | null> => {
    const { data, error } = await supabase.from('events').insert(payload).select().single()
    return { data, error }
  },
  updateEvent: async (id: string, updates: EventUpdate): ApiResult<EventRow | null> => {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },
  deleteEvent: async (id: string): ApiResult<EventRow | null> => {
    const { data, error } = await supabase.from('events').delete().eq('id', id).select().single()
    return { data, error }
  },
}

const rsvps = {
  getEventRsvps: async (eventId: string): ApiResult<RsvpRow[] | null> => {
    const { data, error } = await supabase.from('rsvps').select('*').eq('event_id', eventId)
    return { data, error }
  },
  getUserRsvps: async (userId: string): ApiResult<RsvpRow[] | null> => {
    const { data, error } = await supabase.from('rsvps').select('*').eq('user_id', userId)
    return { data, error }
  },
  upsertRsvp: async (payload: RsvpInsert): ApiResult<RsvpRow | null> => {
    const { data, error } = await supabase
      .from('rsvps')
      .upsert(payload, { onConflict: 'event_id,user_id' })
      .select()
      .single()
    return { data, error }
  },
  deleteRsvp: async (id: string): ApiResult<RsvpRow | null> => {
    const { data, error } = await supabase.from('rsvps').delete().eq('id', id).select().single()
    return { data, error }
  },
}

const ratings = {
  getHostRatings: async (hostId: string): ApiResult<RatingRow[] | null> => {
    const { data, error } = await supabase.from('ratings').select('*').eq('to_user_id', hostId)
    return { data, error }
  },
  createRating: async (payload: RatingInsert): ApiResult<RatingRow | null> => {
    const { data, error } = await supabase.from('ratings').insert(payload).select().single()
    return { data, error }
  },
}

const reports = {
  getReports: async (): ApiResult<ReportRow[] | null> => {
    const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false })
    return { data, error }
  },
  createReport: async (payload: ReportInsert): ApiResult<ReportRow | null> => {
    const { data, error } = await supabase.from('reports').insert(payload).select().single()
    return { data, error }
  },
}

export const api = {
  auth,
  profiles,
  events,
  rsvps,
  ratings,
  reports,
}
