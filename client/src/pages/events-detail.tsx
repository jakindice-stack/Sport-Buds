import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '@/lib/api/client'
import { useAuth } from '@/context/AuthContext'

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

export const EventDetailsPage = () => {
  const { eventId } = useParams()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState<any | null>(null)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [hostRating, setHostRating] = useState<HostRatingsSummary | null>(null)

  const [rateModalOpen, setRateModalOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)

  const [ratingValue, setRatingValue] = useState<number>(5)
  const [ratingComment, setRatingComment] = useState('')

  const [reportTarget, setReportTarget] = useState<'event' | 'user'>('event')
  const [reportReason, setReportReason] = useState('')
  const [reportComment, setReportComment] = useState('')

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!eventId) return
      setLoading(true)
      setStatus(null)

      const { data, error } = await api.events.getEvent(eventId)
      if (cancelled) return

      if (error) {
        setStatus({ type: 'error', message: error.message })
        setEvent(null)
      } else {
        setEvent(data as any)
      }

      setLoading(false)
    }

    run()
    return () => {
      cancelled = true
    }
  }, [eventId])

  const hostId = useMemo(() => {
    if (!event) return ''
    return String(event.host_id ?? event.host?.id ?? '')
  }, [event])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!hostId) {
        setHostRating(null)
        return
      }

      const { data } = await api.ratings.getHostRatings(hostId)
      if (cancelled) return
      setHostRating(computeAverage(data as any))
    }

    run()
    return () => {
      cancelled = true
    }
  }, [hostId])

  const onRsvp = async () => {
    if (!eventId) return
    setStatus(null)

    if (!user) {
      setStatus({ type: 'error', message: 'Please log in before RSVPing.' })
      return
    }

    const { error } = await api.rsvps.upsertRsvp({ event_id: eventId, user_id: user.id, status: 'going' })
    if (error) {
      setStatus({ type: 'error', message: error.message })
      return
    }

    setStatus({ type: 'success', message: 'RSVP saved.' })
  }

  const submitRating = async () => {
    if (!eventId) return
    setStatus(null)

    const { error } = await api.ratings.createRating({
      event_id: eventId,
      rating: ratingValue,
      comment: ratingComment || null,
    })

    if (error) {
      setStatus({ type: 'error', message: error.message })
      return
    }

    setStatus({ type: 'success', message: 'Rating submitted.' })
    setRateModalOpen(false)
  }

  const submitReport = async () => {
    if (!eventId) return
    setStatus(null)

    if (!reportReason.trim()) {
      setStatus({ type: 'error', message: 'Please provide a reason.' })
      return
    }

    const payload =
      reportTarget === 'event'
        ? {
            reported_event_id: eventId,
            reported_user_id: null,
            reason: reportReason.trim(),
            comment: reportComment || null,
          }
        : {
            reported_event_id: null,
            reported_user_id: hostId,
            reason: reportReason.trim(),
            comment: reportComment || null,
          }

    const { error } = await api.reports.createReport(payload as any)
    if (error) {
      setStatus({ type: 'error', message: error.message })
      return
    }

    setStatus({ type: 'success', message: 'Report submitted.' })
    setReportModalOpen(false)
  }

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Event Details</p>
        <h2 className="font-display text-4xl font-semibold text-[var(--sb-text)]">{event?.title ?? 'Event'}</h2>
        <p className="text-[var(--sb-muted)]">
          Full details, host verification badge (rating), and actions to RSVP, rate, or report.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <Link to="/app/map" className="chip bg-white/70 hover:border-slate-400 hover:text-slate-900">
          Back to discovery
        </Link>
        <button type="button" className="chip bg-white" onClick={onRsvp}>
          RSVP
        </button>
        <button
          type="button"
          className="chip bg-white"
          onClick={() => {
            setRatingValue(5)
            setRatingComment('')
            setRateModalOpen(true)
          }}
        >
          Rate host
        </button>
        <button
          type="button"
          className="chip bg-white"
          onClick={() => {
            setReportTarget('event')
            setReportReason('')
            setReportComment('')
            setReportModalOpen(true)
          }}
        >
          Report
        </button>
      </div>

      {status && (
        <p className={`text-sm ${status.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>{status.message}</p>
      )}

      {loading ? (
        <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">Loading event…</div>
      ) : !event ? (
        <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">
          <p className="text-sm text-[var(--sb-muted)]">Event not found.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">
            <h3 className="font-display text-2xl font-semibold text-[var(--sb-text)]">Description</h3>
            <p className="mt-3 text-[var(--sb-muted)]">{event.details}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--sb-border)] bg-white/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--sb-muted)]">Event Type</p>
                <p className="mt-2 font-semibold text-[var(--sb-text)]">{event.sport}</p>
              </div>
              <div className="rounded-2xl border border-[var(--sb-border)] bg-white/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--sb-muted)]">Skill Level</p>
                <p className="mt-2 font-semibold text-[var(--sb-text)]">{event.skill_level}</p>
              </div>
              <div className="rounded-2xl border border-[var(--sb-border)] bg-white/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--sb-muted)]">Location</p>
                <p className="mt-2 font-semibold text-[var(--sb-text)]">{event.location}</p>
              </div>
              <div className="rounded-2xl border border-[var(--sb-border)] bg-white/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--sb-muted)]">Capacity</p>
                <p className="mt-2 font-semibold text-[var(--sb-text)]">{event.max_participants}</p>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">
            <h3 className="font-display text-2xl font-semibold text-[var(--sb-text)]">Host verification</h3>
            <p className="mt-2 text-sm text-[var(--sb-muted)]">Badge reflects average rating across past events.</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="chip bg-white/70 text-xs">
                {hostRating
                  ? hostRating.total > 0
                    ? `${hostRating.average} ★ (${hostRating.total})`
                    : 'Unreviewed'
                  : 'Loading…'}
              </span>
            </div>

            <div className="mt-6 rounded-2xl border border-[var(--sb-border)] bg-white/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--sb-muted)]">Coordinates</p>
              <p className="mt-2 text-sm text-[var(--sb-text)]">
                {event.latitude}, {event.longitude}
              </p>
            </div>
          </aside>
        </div>
      )}

      {rateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-semibold text-[var(--sb-text)]">Rate host</h3>
                <p className="text-sm text-[var(--sb-muted)]">5-star scale. Only attendees can submit.</p>
              </div>
              <button type="button" className="chip bg-white" onClick={() => setRateModalOpen(false)}>
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
                Rating
                <select
                  value={ratingValue}
                  onChange={(e) => setRatingValue(Number(e.target.value))}
                  className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base"
                >
                  {[5, 4, 3, 2, 1].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
                Optional comment
                <textarea
                  rows={3}
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base"
                />
              </label>

              <button
                type="button"
                className="rounded-2xl bg-[var(--sb-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                onClick={submitRating}
              >
                Submit rating
              </button>
            </div>
          </div>
        </div>
      )}

      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-semibold text-[var(--sb-text)]">Submit a report</h3>
                <p className="text-sm text-[var(--sb-muted)]">Choose what you're reporting, then add details.</p>
              </div>
              <button type="button" className="chip bg-white" onClick={() => setReportModalOpen(false)}>
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`chip ${reportTarget === 'event' ? 'border-slate-900 bg-slate-900 text-white' : 'bg-white'}`}
                  onClick={() => setReportTarget('event')}
                >
                  Report event
                </button>
                <button
                  type="button"
                  className={`chip ${reportTarget === 'user' ? 'border-slate-900 bg-slate-900 text-white' : 'bg-white'}`}
                  onClick={() => setReportTarget('user')}
                >
                  Report host
                </button>
              </div>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
                Reason (required)
                <input
                  type="text"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base"
                  placeholder="Unsafe behavior / inappropriate content"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
                Comment box
                <textarea
                  rows={3}
                  value={reportComment}
                  onChange={(e) => setReportComment(e.target.value)}
                  className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base"
                />
              </label>

              <button
                type="button"
                className="rounded-2xl bg-[var(--sb-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                onClick={submitReport}
              >
                Submit report
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
