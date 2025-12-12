import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api/client'
import { useAuth } from '@/context/AuthContext'

type InboxRsvp = {
  id: string
  user_id: string
  event_id: string
  status: 'going' | 'maybe' | 'not_going'
  host_confirmed?: boolean
  confirmed_at?: string | null
  created_at?: string
  updated_at?: string
  user?: { id: string; full_name?: string | null; avatar_url?: string | null }
}

export const AppRsvpManagementPage = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState<any[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [rsvps, setRsvps] = useState<InboxRsvp[]>([])
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [loadingRsvps, setLoadingRsvps] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (!user) return
      setLoadingEvents(true)
      setStatus(null)

      const { data, error } = await api.events.getEvents()
      if (cancelled) return

      if (error) {
        setStatus({ type: 'error', message: error.message })
        setEvents([])
        setSelectedEventId('')
        setLoadingEvents(false)
        return
      }

      const hosted = ((data as any[]) ?? []).filter((evt) => String(evt.host_id) === String(user.id))
      setEvents(hosted)

      if (!selectedEventId && hosted.length > 0) {
        setSelectedEventId(String(hosted[0].id))
      }

      setLoadingEvents(false)
    }

    run()
    return () => {
      cancelled = true
    }
  }, [user, selectedEventId])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (!selectedEventId) {
        setRsvps([])
        return
      }

      setLoadingRsvps(true)
      setStatus(null)
      const { data, error } = await api.rsvps.getEventRsvps(selectedEventId)
      if (cancelled) return

      if (error) {
        setStatus({ type: 'error', message: error.message })
        setRsvps([])
      } else {
        setRsvps(((data as any[]) ?? []) as InboxRsvp[])
      }
      setLoadingRsvps(false)
    }

    run()
    return () => {
      cancelled = true
    }
  }, [selectedEventId])

  const { pending, confirmed } = useMemo(() => {
    const pending = rsvps
      .filter((rsvp) => (rsvp.status === 'going' || rsvp.status === 'maybe') && !rsvp.host_confirmed)
      .sort((a, b) => String(b.created_at ?? '').localeCompare(String(a.created_at ?? '')))

    const confirmed = rsvps
      .filter((rsvp) => (rsvp.status === 'going' || rsvp.status === 'maybe') && Boolean(rsvp.host_confirmed))
      .sort((a, b) => String(b.confirmed_at ?? b.created_at ?? '').localeCompare(String(a.confirmed_at ?? a.created_at ?? '')))

    return { pending, confirmed }
  }, [rsvps])

  const onConfirm = async (rsvpId: string) => {
    if (!selectedEventId) return
    setStatus(null)

    const { data, error } = await api.rsvps.confirmRsvp(selectedEventId, rsvpId)
    if (error) {
      setStatus({ type: 'error', message: error.message })
      return
    }

    if (!data) {
      setStatus({ type: 'error', message: 'RSVP could not be confirmed. Please try again.' })
      return
    }

    setRsvps((prev) => prev.map((item) => (String(item.id) === String(rsvpId) ? { ...item, ...(data as any) } : item)))
    setStatus({ type: 'success', message: 'RSVP confirmed.' })
  }

  const selectedEvent = useMemo(
    () => events.find((evt) => String(evt.id) === String(selectedEventId)) ?? null,
    [events, selectedEventId]
  )

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">RSVP Management</p>
        <h2 className="font-display text-4xl font-semibold text-[var(--sb-text)]">RSVP inbox</h2>
        <p className="text-[var(--sb-muted)]">Confirm attendees for your hosted events.</p>
      </header>

      {status && (
        <p className={`text-sm ${status.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>{status.message}</p>
      )}

      <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-5">
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
          Select event
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            disabled={loadingEvents}
            className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-sm"
          >
            <option value="">{loadingEvents ? 'Loading…' : 'Choose an event'}</option>
            {events.map((evt) => (
              <option key={String(evt.id)} value={String(evt.id)}>
                {evt.title} ({evt.sport})
              </option>
            ))}
          </select>
        </label>

        {selectedEvent && (
          <div className="mt-4 rounded-2xl border border-[var(--sb-border)] bg-white/60 p-4">
            <p className="text-sm text-[var(--sb-muted)]">
              <span className="font-semibold text-[var(--sb-text)]">Event:</span> {selectedEvent.title}
            </p>
            <p className="text-sm text-[var(--sb-muted)]">
              <span className="font-semibold text-[var(--sb-text)]">Location:</span> {selectedEvent.location}
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-2xl font-semibold text-[var(--sb-text)]">New RSVPs</h3>
            <span className="chip bg-white/70 text-xs">{pending.length}</span>
          </div>
          <p className="mt-2 text-sm text-[var(--sb-muted)]">Pending host confirmation.</p>

          <div className="mt-5 space-y-3">
            {loadingRsvps ? (
              <div className="rounded-2xl border border-[var(--sb-border)] bg-white p-4">Loading…</div>
            ) : pending.length === 0 ? (
              <div className="rounded-2xl border border-[var(--sb-border)] bg-white p-4">No new RSVPs.</div>
            ) : (
              pending.map((rsvp) => (
                <div key={rsvp.id} className="rounded-2xl border border-[var(--sb-border)] bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[var(--sb-text)]">
                        {rsvp.user?.full_name || 'Attendee'}
                      </p>
                      <p className="text-xs text-[var(--sb-muted)]">{rsvp.created_at ?? ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="chip bg-white/70 text-xs">{rsvp.status}</span>
                      <button
                        type="button"
                        className="chip border-slate-900 bg-slate-900 text-white"
                        onClick={() => onConfirm(rsvp.id)}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-2xl font-semibold text-[var(--sb-text)]">Confirmed RSVPs</h3>
            <span className="chip bg-white/70 text-xs">{confirmed.length}</span>
          </div>
          <p className="mt-2 text-sm text-[var(--sb-muted)]">Ready to attend.</p>

          <div className="mt-5 space-y-3">
            {loadingRsvps ? (
              <div className="rounded-2xl border border-[var(--sb-border)] bg-white p-4">Loading…</div>
            ) : confirmed.length === 0 ? (
              <div className="rounded-2xl border border-[var(--sb-border)] bg-white p-4">No confirmed RSVPs.</div>
            ) : (
              confirmed.map((rsvp) => (
                <div key={rsvp.id} className="rounded-2xl border border-[var(--sb-border)] bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[var(--sb-text)]">
                        {rsvp.user?.full_name || 'Attendee'}
                      </p>
                      <p className="text-xs text-[var(--sb-muted)]">Confirmed: {rsvp.confirmed_at ?? rsvp.updated_at ?? ''}</p>
                    </div>
                    <span className="chip bg-white/70 text-xs">{rsvp.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
