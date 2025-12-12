import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { api } from '@/lib/api/client'
import { useAuth } from '@/context/AuthContext'

const schema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    sport: z.string().min(1, 'Sport is required'),
    description: z.string().min(1, 'Event type/details are required'),
    start_time: z.string().min(1, 'Start time is required'),
    end_time: z.string().min(1, 'End time is required'),
    location: z.string().min(1, 'Location is required'),
    latitude: z.coerce.number().refine((value) => Number.isFinite(value), {
      message: 'Latitude must be a number',
    }),
    longitude: z.coerce.number().refine((value) => Number.isFinite(value), {
      message: 'Longitude must be a number',
    }),
    max_participants: z.coerce
      .number()
      .int()
      .positive()
      .refine((value) => value > 0, { message: 'Capacity must be greater than 0' }),
    skill_level: z.enum(['beginner', 'intermediate', 'advanced', 'all']),
  })
  .refine(
    (value) => {
      const start = new Date(value.start_time)
      const end = new Date(value.end_time)
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false
      return end.getTime() > start.getTime()
    },
    {
      message: 'End time must be after start time',
      path: ['end_time'],
    }
  )

type FormValues = z.infer<typeof schema>
type CreateEventPayload = Parameters<typeof api.events.createEvent>[0]

export const CreateEventPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: '',
      sport: '',
      description: '',
      start_time: '',
      end_time: '',
      location: '',
      latitude: 0,
      longitude: 0,
      max_participants: 10,
      skill_level: 'all',
    },
    mode: 'onBlur',
  })

  const onUseMyLocation = () => {
    setStatus(null)
    if (!navigator.geolocation) {
      setStatus({ type: 'error', message: 'Geolocation is not supported in this browser.' })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        form.setValue('latitude', pos.coords.latitude)
        form.setValue('longitude', pos.coords.longitude)
      },
      () => {
        setStatus({ type: 'error', message: 'Location permission denied or unavailable.' })
      }
    )
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus(null)
    if (!user) {
      setStatus({ type: 'error', message: 'Please log in before creating an event.' })
      return
    }

    const payload: CreateEventPayload = {
      title: values.title,
      sport: values.sport,
      description: values.description,
      start_time: values.start_time,
      end_time: values.end_time,
      location: values.location,
      latitude: values.latitude,
      longitude: values.longitude,
      max_participants: values.max_participants,
      skill_level: values.skill_level,
      host_id: user.id,
    }

    const { data, error } = await api.events.createEvent(payload)

    if (error) {
      setStatus({ type: 'error', message: error.message })
      return
    }

    if (!data) {
      setStatus({ type: 'error', message: 'Event could not be created. Please try again.' })
      return
    }

    setStatus({ type: 'success', message: 'Event created successfully.' })
    navigate('/discover/map')
  })

  const { errors, isSubmitting } = form.formState

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Create Sports Event</p>
        <h2 className="font-display text-4xl font-semibold text-[var(--sb-text)]">Publish a new event</h2>
        <p className="text-[var(--sb-muted)]">
          Sport, event type/details, time duration, skill level, capacity, and location are required.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="grid gap-5 rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6 md:grid-cols-2"
      >
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
          Sport (required)
          <input
            type="text"
            {...form.register('sport')}
            className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base text-[var(--sb-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-accent)]"
            placeholder="Basketball"
          />
          {errors.sport && <span className="text-xs text-rose-600">{errors.sport.message}</span>}
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
          Title
          <input
            type="text"
            {...form.register('title')}
            className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base text-[var(--sb-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-accent)]"
            placeholder="Pickup game at the courts"
          />
          {errors.title && <span className="text-xs text-rose-600">{errors.title.message}</span>}
        </label>

        <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
          Event type/details
          <textarea
            rows={3}
            {...form.register('description')}
            className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base text-[var(--sb-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-accent)]"
            placeholder="Match, practice, or tournament details..."
          />
          {errors.description && <span className="text-xs text-rose-600">{errors.description.message}</span>}
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
          Start time
          <input
            type="datetime-local"
            {...form.register('start_time')}
            className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base text-[var(--sb-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-accent)]"
          />
          {errors.start_time && <span className="text-xs text-rose-600">{errors.start_time.message}</span>}
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
          End time
          <input
            type="datetime-local"
            {...form.register('end_time')}
            className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base text-[var(--sb-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-accent)]"
          />
          {errors.end_time && <span className="text-xs text-rose-600">{errors.end_time.message}</span>}
        </label>

        <label className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
          Location (required)
          <input
            type="text"
            {...form.register('location')}
            className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base text-[var(--sb-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-accent)]"
            placeholder="Main campus courts"
          />
          {errors.location && <span className="text-xs text-rose-600">{errors.location.message}</span>}
        </label>

        <div className="md:col-span-2 grid gap-4 rounded-2xl border border-[var(--sb-border)] bg-white/60 p-4 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
            Latitude
            <input
              type="number"
              step="any"
              {...form.register('latitude')}
              className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base text-[var(--sb-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-accent)]"
            />
            {errors.latitude && <span className="text-xs text-rose-600">{errors.latitude.message}</span>}
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
            Longitude
            <input
              type="number"
              step="any"
              {...form.register('longitude')}
              className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base text-[var(--sb-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-accent)]"
            />
            {errors.longitude && <span className="text-xs text-rose-600">{errors.longitude.message}</span>}
          </label>

          <div className="flex flex-col justify-end gap-2">
            <button type="button" className="chip bg-white" onClick={onUseMyLocation}>
              Use my location
            </button>
            <p className="text-xs text-[var(--sb-muted)]">Optional helper to fill coordinates.</p>
          </div>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
          Skill level
          <select
            {...form.register('skill_level')}
            className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base text-[var(--sb-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-accent)]"
          >
            <option value="all">All</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          {errors.skill_level && <span className="text-xs text-rose-600">{errors.skill_level.message}</span>}
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
          Capacity
          <input
            type="number"
            {...form.register('max_participants')}
            className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base text-[var(--sb-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sb-accent)]"
          />
          {errors.max_participants && (
            <span className="text-xs text-rose-600">{errors.max_participants.message}</span>
          )}
        </label>

        <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-[var(--sb-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Creating…' : 'Create Event'}
          </button>
          {status && (
            <p className={`text-sm ${status.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {status.message}
            </p>
          )}
        </div>
      </form>
    </section>
  )
}
