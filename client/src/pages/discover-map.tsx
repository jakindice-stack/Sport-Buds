import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api/client'

type HostRatingsSummary = {
  average: number
  total: number
}

const computeAverage = (ratings: Array<{ rating?: number }> | null | undefined): HostRatingsSummary => {
  const valid = (ratings ?? []).filter((r) => typeof r.rating === 'number') as Array<{ rating: number }>
  if (valid.length === 0) return { average: 0, total: 0 }
  const sum = valid.reduce((acc, r) => acc + r.rating, 0)
  return { average: Math.round((sum / valid.length) * 10) / 10, total: valid.length }
}

const haversineKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const toRad = (d: number) => (d * Math.PI) / 180
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

export const MapDiscoveryPage = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [geoStatus, setGeoStatus] = useState<string | null>(null)
  const [sportFilter, setSportFilter] = useState<string>('')
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [hostRatings, setHostRatings] = useState<Record<string, HostRatingsSummary>>({})

  useEffect(() => {
    setGeoStatus(null)
    if (!navigator.geolocation) {
      setGeoStatus('Geolocation is not supported in this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      () => {
        setGeoStatus('Location permission denied. Showing all events.')
      }
    )
  }, [])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setStatus(null)
      const { data, error } = await api.events.getEvents({ sport: sportFilter || undefined })
      if (cancelled) return
      if (error) {
        setStatus({ type: 'error', message: error.message })
        setEvents([])
      } else {
        setEvents((data as any[]) ?? [])
      }
      setLoading(false)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [sportFilter])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const hostIds = Array.from(
        new Set(
          events
            .map((evt) => String(evt.host_id ?? evt.host?.id ?? ''))
            .filter((id) => Boolean(id))
        )
      )

      if (hostIds.length === 0) {
        setHostRatings({})
        return
      }

      const entries = await Promise.all(
        hostIds.map(async (hostId) => {
          const { data } = await api.ratings.getHostRatings(hostId)
          return [hostId, computeAverage(data as any)] as const
        })
      )

      if (cancelled) return
      setHostRatings((prev) => {
        const next = { ...prev }
        for (const [hostId, summary] of entries) {
          next[hostId] = summary
        }
        return next
      })
    }

    run()
    return () => {
      cancelled = true
    }
  }, [events])

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null
    return events.find((evt) => String(evt.id) === String(selectedEventId)) ?? null
  }, [events, selectedEventId])

  const sortedEvents = useMemo(() => {
    if (!userLocation) return events
    return [...events].sort((a, b) => {
      const da = typeof a.latitude === 'number' && typeof a.longitude === 'number'
        ? haversineKm(userLocation, { lat: a.latitude, lng: a.longitude })
        : Number.POSITIVE_INFINITY
      const db = typeof b.latitude === 'number' && typeof b.longitude === 'number'
        ? haversineKm(userLocation, { lat: b.latitude, lng: b.longitude })
        : Number.POSITIVE_INFINITY
      return da - db
    })
  }, [events, userLocation])

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Map-Based Discovery</p>
        <h2 className="font-display text-4xl font-semibold text-[var(--sb-text)]">Browse nearby events</h2>
        <p className="text-[var(--sb-muted)]">
          Events are ordered by proximity when location permission is granted. Click an event “pin” card to preview key
          info.
        </p>
        {geoStatus && <p className="text-sm text-[var(--sb-muted)]">{geoStatus}</p>}
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[var(--sb-border)] bg-white/80 p-5">
        <label className="flex items-center gap-3 text-sm font-medium text-[var(--sb-text)]">
          Filter by sport
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-2 text-sm text-[var(--sb-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-accent)]"
          >
            <option value="">All</option>
            <option value="basketball">Basketball</option>
            <option value="soccer">Soccer</option>
            <option value="tennis">Tennis</option>
            <option value="volleyball">Volleyball</option>
            <option value="running">Running</option>
          </select>
        </label>

        <div className="flex items-center gap-3">
          <Link
            to="/app/create-event"
            className="chip border-slate-900 bg-slate-900 text-white hover:opacity-90"
          >
            Create event
          </Link>
        </div>
      </div>

      {status && (
        <p className={`text-sm ${status.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>{status.message}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">Loading events…</div>
          ) : sortedEvents.length === 0 ? (
            <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">No events found.</div>
          ) : (
            sortedEvents.map((evt) => {
              const isSelected = String(evt.id) === String(selectedEventId)
              const hostId = String(evt.host_id ?? evt.host?.id ?? '')
              const hostRating = hostId ? hostRatings[hostId] : undefined

              return (
                <button
                  key={String(evt.id)}
                  type="button"
                  onClick={() => setSelectedEventId(String(evt.id))}
                  className={`w-full rounded-3xl border bg-white/80 p-5 text-left transition ${
                    isSelected ? 'border-slate-900' : 'border-[var(--sb-border)] hover:border-slate-400'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-semibold text-[var(--sb-text)]">{evt.title}</h3>
                      <p className="text-sm text-[var(--sb-muted)]">
                        {evt.sport} · {evt.skill_level} · {evt.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {hostRating && (
                        <span className="chip bg-white/70 text-xs">
                          {hostRating.total > 0 ? `${hostRating.average} ★ (${hostRating.total})` : 'Unreviewed'}
                        </span>
                      )}
                      <span className="chip bg-white/70 text-xs">
                        Capacity: {evt.max_participants}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">
            <h3 className="font-display text-xl font-semibold text-[var(--sb-text)]">Preview</h3>
            {!selectedEvent ? (
              <p className="mt-2 text-sm text-[var(--sb-muted)]">Select an event to see key info and actions.</p>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-[var(--sb-muted)]">
                  <span className="font-semibold text-[var(--sb-text)]">Event:</span> {selectedEvent.title}
                </p>
                <p className="text-sm text-[var(--sb-muted)]">
                  <span className="font-semibold text-[var(--sb-text)]">Sport:</span> {selectedEvent.sport}
                </p>
                <p className="text-sm text-[var(--sb-muted)]">
                  <span className="font-semibold text-[var(--sb-text)]">Skill:</span> {selectedEvent.skill_level}
                </p>
                <p className="text-sm text-[var(--sb-muted)]">
                  <span className="font-semibold text-[var(--sb-text)]">Location:</span> {selectedEvent.location}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Link
                    to={`/app/events/${selectedEvent.id}`}
                    className="chip border-slate-900 bg-slate-900 text-white hover:opacity-90"
                  >
                    Event details
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
