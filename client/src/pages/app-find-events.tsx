import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api/client'

type Filters = {
  sport: string
  skill: string
  eventType: string
}

export const AppFindEventsPage = () => {
  const [filters, setFilters] = useState<Filters>({ sport: '', skill: '', eventType: '' })
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setStatus(null)
      const { data, error } = await api.events.getEvents({
        sport: filters.sport || undefined,
        skill_level: (filters.skill || undefined) as any,
      })

      if (cancelled) return

      if (error) {
        setStatus(error.message)
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
  }, [filters.sport, filters.skill])

  const filteredEvents = useMemo(() => {
    if (!filters.eventType) return events
    return events.filter((evt) => String(evt.description ?? '').toLowerCase().includes(filters.eventType.toLowerCase()))
  }, [events, filters.eventType])

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Find Events</p>
        <h2 className="font-display text-4xl font-semibold text-[var(--sb-text)]">Upcoming events</h2>
        <p className="text-[var(--sb-muted)]">Use filters to narrow results by sport, skill level, and event type.</p>
      </header>

      <div className="grid gap-3 rounded-3xl border border-[var(--sb-border)] bg-white/80 p-5 md:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
          Sport type
          <select
            value={filters.sport}
            onChange={(e) => setFilters((p) => ({ ...p, sport: e.target.value }))}
            className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="basketball">Basketball</option>
            <option value="soccer">Soccer</option>
            <option value="tennis">Tennis</option>
            <option value="volleyball">Volleyball</option>
            <option value="running">Running</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
          Skill level
          <select
            value={filters.skill}
            onChange={(e) => setFilters((p) => ({ ...p, skill: e.target.value }))}
            className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="all">All (event flag)</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
          Event type
          <input
            value={filters.eventType}
            onChange={(e) => setFilters((p) => ({ ...p, eventType: e.target.value }))}
            className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-2 text-sm"
            placeholder="e.g. pickup, practice"
          />
        </label>
      </div>

      {status && <p className="text-sm text-rose-600">{status}</p>}

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">Loading…</div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">No events found.</div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={String(evt.id)}
              className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--sb-text)]">{evt.sport}</p>
                  <h3 className="font-display text-xl font-semibold text-[var(--sb-text)]">{evt.title}</h3>
                  <p className="text-sm text-[var(--sb-muted)]">{evt.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="chip bg-white/70 text-xs">{evt.skill_level}</span>
                  <span className="chip bg-white/70 text-xs">{evt.location}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link
                  to={`/app/events/${evt.id}`}
                  className="chip border-slate-900 bg-slate-900 text-white hover:opacity-90"
                >
                  View details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
