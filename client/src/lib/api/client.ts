import { http } from '@/lib/api/http'
import type { Database } from '@/types/supabase'

export type ApiError = Error
export type ApiResult<T> = Promise<{ data: T | null; error: ApiError | null }>

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

export type QaTestRecordRow = {
  id: string
  user_id: string
  title: string
  payload: unknown | null
  created_at: string
  updated_at: string
}

type EventFilters = {
  sport?: string
  skill_level?: EventRow['skill_level']
  date_from?: string
  date_to?: string
  location?: string
}

const qa = {
  listTestRecords: async (): ApiResult<QaTestRecordRow[]> =>
    toResult(() => http.get('/qa/test-records')),
  createTestRecord: async (payload: { title: string; payload?: unknown }): ApiResult<QaTestRecordRow> =>
    toResult(() => http.post('/qa/test-records', payload)),
  updateTestRecord: async (id: string, updates: { title?: string; payload?: unknown }): ApiResult<QaTestRecordRow> =>
    toResult(() => http.patch(`/qa/test-records/${id}`, updates)),
  deleteTestRecord: async (id: string): ApiResult<null> =>
    toResult(async () => {
      await http.delete(`/qa/test-records/${id}`)
      return null
    }),
}

const toResult = async <T>(executor: () => Promise<T>): ApiResult<T> => {
  try {
    const data = await executor()
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as ApiError }
  }
}

const buildQueryString = (
  params: Record<string, string | number | boolean | null | undefined>
): string => {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }
    search.append(key, String(value))
  })

  const query = search.toString()
  return query ? `?${query}` : ''
}

const profiles = {
  list: async (filters: { sport_interest?: string; skill_level?: string; location?: string } = {}) =>
    toResult<ProfileRow[]>(() => http.get(`/profiles${buildQueryString(filters)}`)),
  getProfile: async (id: string) => toResult<ProfileRow>(() => http.get(`/profiles/${id}`)),
  getCurrentProfile: async () => toResult<ProfileRow>(() => http.get('/profiles/me')),
  updateCurrentProfile: async (updates: ProfileUpdate) =>
    toResult<ProfileRow>(() => http.patch('/profiles/me', updates)),
  createProfile: async (payload: ProfileUpdate) =>
    toResult<ProfileRow>(() => http.post('/profiles', payload)),
}

const events = {
  getEvents: async (filters: EventFilters = {}): ApiResult<EventRow[]> =>
    toResult<EventRow[]>(() => {
      const query = buildQueryString({
        sport_type: filters.sport,
        skill_level: filters.skill_level,
        date_from: filters.date_from,
        date_to: filters.date_to,
        location: filters.location,
      })
      return http.get(`/events${query}`)
    }),
  getEvent: async (id: string): ApiResult<EventRow> => toResult(() => http.get(`/events/${id}`)),
  createEvent: async (payload: EventInsert): ApiResult<EventRow> =>
    toResult(() => http.post('/events', payload)),
  updateEvent: async (id: string, updates: EventUpdate): ApiResult<EventRow> =>
    toResult(() => http.patch(`/events/${id}`, updates)),
  deleteEvent: async (id: string): ApiResult<null> =>
    toResult(async () => {
      await http.delete(`/events/${id}`)
      return null
    }),
}

const rsvps = {
  getEventRsvps: async (eventId: string): ApiResult<RsvpRow[]> =>
    toResult(() => http.get(`/rsvps/events/${eventId}/rsvps`)),
  getUserRsvps: async (userId: string): ApiResult<RsvpRow[]> =>
    toResult(() => http.get(`/rsvps/users/${userId}/rsvps`)),
  upsertRsvp: async (payload: RsvpInsert): ApiResult<RsvpRow> =>
    toResult(() => http.post(`/rsvps/events/${payload.event_id}/rsvps`, payload)),
  confirmRsvp: async (eventId: string, rsvpId: string): ApiResult<RsvpRow> =>
    toResult(() => http.post(`/rsvps/events/${eventId}/rsvps/${rsvpId}/confirm`)),
  deleteRsvp: async (eventId: string): ApiResult<null> =>
    toResult(async () => {
      await http.delete(`/rsvps/events/${eventId}/rsvps/me`)
      return null
    }),
}

const ratings = {
  getHostRatings: async (hostId: string): ApiResult<RatingRow[]> =>
    toResult(() => http.get(`/ratings/hosts/${hostId}/ratings`)),
  getEventRatings: async (eventId: string): ApiResult<RatingRow[]> =>
    toResult(() => http.get(`/ratings/events/${eventId}/ratings`)),
  createRating: async (payload: Pick<RatingInsert, 'event_id' | 'rating' | 'comment'>): ApiResult<RatingRow> =>
    toResult(() => http.post(`/ratings/events/${payload.event_id}/ratings`, { rating: payload.rating, comment: payload.comment })),
}

const reports = {
  getReports: async (): ApiResult<ReportRow[]> => toResult(() => http.get('/reports')),
  createReport: async (
    payload: Pick<ReportInsert, 'reported_event_id' | 'reported_user_id' | 'reason'> & { comment?: string | null }
  ): ApiResult<ReportRow> =>
    toResult(() => {
      if (payload.reported_event_id) {
        return http.post(`/reports/events/${payload.reported_event_id}/reports`, {
          reason: payload.reason,
          comment: payload.comment ?? null,
          reported_user_id: payload.reported_user_id ?? null,
        })
      }

      if (payload.reported_user_id) {
        return http.post(`/reports/users/${payload.reported_user_id}/reports`, {
          reason: payload.reason,
          comment: payload.comment ?? null,
        })
      }

      throw new Error('Either reported_event_id or reported_user_id is required to submit a report')
    }),
}

export const api = {
  profiles,
  events,
  rsvps,
  ratings,
  reports,
  qa,
}
