import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api/client'
import type { ProfileRow } from '@/lib/api/client'
import { useAuth } from '@/context/AuthContext'

type ProfileDraft = {
  full_name: string
  bio: string
  sports: string
  skill_level: ProfileRow['skill_level']
  avatar_url: string
}

const toDraft = (profile: ProfileRow): ProfileDraft => {
  return {
    full_name: profile.full_name ?? '',
    bio: profile.bio ?? '',
    sports: (profile.sports ?? []).join(', '),
    skill_level: profile.skill_level ?? null,
    avatar_url: profile.avatar_url ?? '',
  }
}

const parseSports = (value: string): string[] => {
  const parts = value
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
  return parts.length > 0 ? parts : []
}

export const ProfileManagePage = () => {
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [draft, setDraft] = useState<ProfileDraft | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setStatus(null)

      const { data, error } = await api.profiles.getCurrentProfile()
      if (cancelled) return

      if (error) {
        setStatus({ type: 'error', message: error.message })
        setProfile(null)
        setDraft(null)
      } else if (data) {
        setProfile(data)
        setDraft(toDraft(data))
      }

      setLoading(false)
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  const canSave = useMemo(() => {
    if (!draft) return false
    return draft.full_name.trim().length > 0
  }, [draft])

  const onSave = async () => {
    if (!draft) return
    setSaving(true)
    setStatus(null)

    const updates = {
      full_name: draft.full_name.trim(),
      bio: draft.bio.trim().length > 0 ? draft.bio.trim() : null,
      avatar_url: draft.avatar_url.trim().length > 0 ? draft.avatar_url.trim() : null,
      sports: parseSports(draft.sports),
      skill_level: draft.skill_level,
    }

    const { data, error } = await api.profiles.updateCurrentProfile(updates)
    if (error) {
      setStatus({ type: 'error', message: error.message })
      setSaving(false)
      return
    }

    if (data) {
      setProfile(data)
      setDraft(toDraft(data))
    }

    setStatus({ type: 'success', message: 'Profile saved.' })
    setSaving(false)
  }

  if (!user) {
    return (
      <section className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Profile</p>
          <h2 className="font-display text-4xl font-semibold text-[var(--sb-text)]">Your profile</h2>
        </header>
        <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">
          <p className="text-sm text-[var(--sb-muted)]">Please log in to manage your profile.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Profile</p>
        <h2 className="font-display text-4xl font-semibold text-[var(--sb-text)]">Your profile</h2>
        <p className="text-[var(--sb-muted)]">Update what other athletes see when deciding to RSVP.</p>
      </header>

      {status && (
        <p className={`text-sm ${status.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>{status.message}</p>
      )}

      {loading ? (
        <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">Loading profile…</div>
      ) : !draft ? (
        <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">
          <p className="text-sm text-[var(--sb-muted)]">Profile not available.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_0.6fr]">
          <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6 space-y-5">
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
              Full name
              <input
                type="text"
                value={draft.full_name}
                onChange={(e) => setDraft((prev) => (prev ? { ...prev, full_name: e.target.value } : prev))}
                className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
              Bio
              <textarea
                rows={4}
                value={draft.bio}
                onChange={(e) => setDraft((prev) => (prev ? { ...prev, bio: e.target.value } : prev))}
                className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base"
                placeholder="What do you like to play? What's your vibe?"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
              Sports (comma separated)
              <input
                type="text"
                value={draft.sports}
                onChange={(e) => setDraft((prev) => (prev ? { ...prev, sports: e.target.value } : prev))}
                className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base"
                placeholder="Basketball, Soccer"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
              Skill level
              <select
                value={draft.skill_level ?? ''}
                onChange={(e) =>
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          skill_level: (e.target.value || null) as ProfileRow['skill_level'],
                        }
                      : prev
                  )
                }
                className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base"
              >
                <option value="">Not set</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
              Avatar URL
              <input
                type="url"
                value={draft.avatar_url}
                onChange={(e) => setDraft((prev) => (prev ? { ...prev, avatar_url: e.target.value } : prev))}
                className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-3 text-base"
                placeholder="https://..."
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                disabled={!canSave || saving}
                className="rounded-2xl bg-[var(--sb-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={onSave}
              >
                {saving ? 'Saving…' : 'Save profile'}
              </button>
              <p className="text-xs text-[var(--sb-muted)]">Signed in as {user.email}</p>
            </div>
          </div>

          <aside className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6 space-y-4">
            <h3 className="font-display text-2xl font-semibold text-[var(--sb-text)]">Preview</h3>
            <div className="rounded-2xl border border-[var(--sb-border)] bg-white/60 p-4 space-y-2">
              <p className="text-sm font-semibold text-[var(--sb-text)]">{draft.full_name || 'Unnamed athlete'}</p>
              <p className="text-sm text-[var(--sb-muted)]">{draft.bio || 'No bio yet.'}</p>
              <p className="text-xs text-[var(--sb-muted)]">Sports: {parseSports(draft.sports).join(', ') || '—'}</p>
              <p className="text-xs text-[var(--sb-muted)]">Skill: {draft.skill_level ?? '—'}</p>
            </div>
            {profile && (
              <p className="text-xs text-[var(--sb-muted)]">Last updated: {new Date(profile.updated_at).toLocaleString()}</p>
            )}
          </aside>
        </div>
      )}
    </section>
  )
}
