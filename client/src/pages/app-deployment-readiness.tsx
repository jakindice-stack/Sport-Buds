import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { api } from '@/lib/api/client'
import type { CorrelatedError } from '@/lib/api/http'
import { clearAuthTokenOverride, setAuthTokenOverride } from '@/lib/api/http'
import { useAuth } from '@/context/AuthContext'

type ChecklistStatus = 'not_started' | 'in_progress' | 'passed' | 'failed'

type ChecklistItem = {
  id: string
  label: string
  checked: boolean
  status: ChecklistStatus
  notes: string
  evidence: string
  timestamp: string | null
}

type ChecklistSection = {
  id: string
  title: string
  items: ChecklistItem[]
}

const statusLabel: Record<ChecklistStatus, string> = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  passed: 'Passed',
  failed: 'Failed',
}

const statusClass: Record<ChecklistStatus, string> = {
  not_started: 'bg-white/70 text-slate-700',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
  passed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-rose-50 text-rose-700 border-rose-200',
}

const nowIso = () => new Date().toISOString()

const buildDefaultChecklist = (): ChecklistSection[] => [
  {
    id: 'auth-flow',
    title: 'Authentication Flow (Browser)',
    items: [
      {
        id: 'auth_signup',
        label: 'Sign up with test email; confirm magic link/OTP delivery',
        checked: false,
        status: 'not_started',
        notes: '',
        evidence: '',
        timestamp: null,
      },
      {
        id: 'auth_anon_vs_authed',
        label: 'Test anonymous and authenticated user flows',
        checked: false,
        status: 'not_started',
        notes: '',
        evidence: '',
        timestamp: null,
      },
      {
        id: 'auth_persist',
        label: 'Log in successfully; verify token persists after refresh and restart',
        checked: false,
        status: 'not_started',
        notes: '',
        evidence: '',
        timestamp: null,
      },
      {
        id: 'auth_invalid_tokens',
        label: 'Test invalid tokens and confirm access denied',
        checked: false,
        status: 'not_started',
        notes: '',
        evidence: '',
        timestamp: null,
      },
    ],
  },
  {
    id: 'core-features',
    title: 'Core Features (Browser)',
    items: [
      {
        id: 'core_crud',
        label: 'Test full range of database operations (CRUD)',
        checked: false,
        status: 'not_started',
        notes: '',
        evidence: '',
        timestamp: null,
      },
      {
        id: 'core_listings',
        label: 'View listings or reports; confirm dynamic data loads',
        checked: false,
        status: 'not_started',
        notes: '',
        evidence: '',
        timestamp: null,
      },
      {
        id: 'core_submit_sample',
        label: 'Submit a sample record (e.g., berry report) and verify success',
        checked: false,
        status: 'not_started',
        notes: '',
        evidence: '',
        timestamp: null,
      },
    ],
  },
  {
    id: 'error-handling',
    title: 'Error Handling (Browser & AWS)',
    items: [
      {
        id: 'err_invalid_data',
        label: 'Submit invalid data and verify validation messages',
        checked: false,
        status: 'not_started',
        notes: '',
        evidence: '',
        timestamp: null,
      },
      {
        id: 'err_protected_route',
        label: 'Access a protected route while logged out and confirm redirect/error',
        checked: false,
        status: 'not_started',
        notes: '',
        evidence: '',
        timestamp: null,
      },
      {
        id: 'err_cloudwatch',
        label: 'Check AWS CloudWatch for errors/unhandled exceptions',
        checked: false,
        status: 'not_started',
        notes: '',
        evidence: '',
        timestamp: null,
      },
    ],
  },
  {
    id: 'pwa-mobile',
    title: 'PWA & Mobile (Browser on Phone)',
    items: [
      {
        id: 'pwa_devices',
        label: 'Test in browser (Chrome) on iPhone and Android',
        checked: false,
        status: 'not_started',
        notes: '',
        evidence: '',
        timestamp: null,
      },
      {
        id: 'pwa_responsive',
        label: 'Test responsive layout and accessibility across sizes/orientations',
        checked: false,
        status: 'not_started',
        notes: '',
        evidence: '',
        timestamp: null,
      },
      {
        id: 'pwa_readability',
        label: 'Verify text readability and tap-friendly UI',
        checked: false,
        status: 'not_started',
        notes: '',
        evidence: '',
        timestamp: null,
      },
      {
        id: 'pwa_a2hs',
        label: 'Verify Add to Home Screen and standalone operation',
        checked: false,
        status: 'not_started',
        notes: '',
        evidence: '',
        timestamp: null,
      },
    ],
  },
]

const storageKeyForUser = (userId: string) => `sb_deploy_readiness_${userId}`

const downloadJson = (filename: string, data: unknown) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const AppDeploymentReadinessPage = () => {
  const { user } = useAuth()

  const [checklist, setChecklist] = useState<ChecklistSection[]>(buildDefaultChecklist())
  const [persistMode] = useState<'localStorage'>('localStorage')

  const [authDebug, setAuthDebug] = useState<{ session: any; refreshError?: string | null }>({ session: null })
  const [invalidTokenEnabled, setInvalidTokenEnabled] = useState(false)

  const [crudLog, setCrudLog] = useState<Array<{ at: string; action: string; ok: boolean; payload?: any }>>([])
  const [crudSelectedId, setCrudSelectedId] = useState<string>('')
  const [crudTitle, setCrudTitle] = useState('qa record')
  const [crudPayload, setCrudPayload] = useState('{"hello":"world"}')
  const [lastError, setLastError] = useState<CorrelatedError | null>(null)

  const [pwa, setPwa] = useState({
    offline: !navigator.onLine,
    standalone: false,
    swSupported: 'serviceWorker' in navigator,
    swController: false,
    installPromptAvailable: false,
  })

  useEffect(() => {
    const onOnline = () => setPwa((p) => ({ ...p, offline: false }))
    const onOffline = () => setPwa((p) => ({ ...p, offline: true }))

    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    const standalone =
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      // @ts-expect-error non-standard
      window.navigator.standalone === true

    setPwa((p) => ({
      ...p,
      standalone,
      swController: Boolean(navigator.serviceWorker && navigator.serviceWorker.controller),
    }))

    const beforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setPwa((p) => ({ ...p, installPromptAvailable: true }))
    }

    window.addEventListener('beforeinstallprompt', beforeInstallPrompt)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('beforeinstallprompt', beforeInstallPrompt)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const { data } = await supabase.auth.getSession()
      if (cancelled) return
      setAuthDebug({ session: data.session, refreshError: null })
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!user) return
    const key = storageKeyForUser(user.id)
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        setChecklist(parsed)
      }
    } catch (_) {
      // no-op
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    const key = storageKeyForUser(user.id)
    try {
      localStorage.setItem(key, JSON.stringify(checklist))
    } catch (_) {
      // no-op
    }
  }, [checklist, user])

  const updateItem = (sectionId: string, itemId: string, updater: (item: ChecklistItem) => ChecklistItem) => {
    setChecklist((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section
        return {
          ...section,
          items: section.items.map((item) => (item.id === itemId ? updater(item) : item)),
        }
      })
    )
  }

  const resetAll = () => {
    setChecklist(buildDefaultChecklist())
  }

  const exportResults = () => {
    const payload = {
      user: user ? { id: user.id, email: user.email } : null,
      persistedVia: persistMode,
      exportedAt: nowIso(),
      checklist,
      pwa,
    }
    downloadJson(`deployment-readiness-${user?.id ?? 'anonymous'}.json`, payload)
  }

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) throw error
      setAuthDebug({ session: data.session, refreshError: null })
    } catch (err: any) {
      setAuthDebug((p) => ({ ...p, refreshError: err?.message ?? 'Failed to refresh session' }))
    }
  }

  const toggleInvalidToken = () => {
    const next = !invalidTokenEnabled
    setInvalidTokenEnabled(next)
    if (next) {
      setAuthTokenOverride('invalid.token.for.testing')
    } else {
      clearAuthTokenOverride()
    }
  }

  const appendCrudLog = (entry: { action: string; ok: boolean; payload?: any }) => {
    setCrudLog((prev) => [{ at: nowIso(), ...entry }, ...prev].slice(0, 50))
  }

  const withErrorCapture = async <T,>(action: string, fn: () => Promise<T>): Promise<T | null> => {
    setLastError(null)
    try {
      const result = await fn()
      appendCrudLog({ action, ok: true, payload: result })
      return result
    } catch (err) {
      const e = err as CorrelatedError
      setLastError(e)
      appendCrudLog({ action, ok: false, payload: { message: e.message, correlationId: e.correlationId, status: e.status } })
      return null
    }
  }

  const crudCreate = async () => {
    let parsedPayload: any = null
    try {
      parsedPayload = crudPayload ? JSON.parse(crudPayload) : null
    } catch (_) {
      parsedPayload = crudPayload
    }

    const result = await withErrorCapture('Create test record', () => api.qa.createTestRecord({ title: crudTitle, payload: parsedPayload }))
    const record = (result as any)?.data
    if (record?.id) {
      setCrudSelectedId(String(record.id))
    }
  }

  const crudRead = async () => {
    await withErrorCapture('List test records', () => api.qa.listTestRecords())
  }

  const crudUpdate = async () => {
    if (!crudSelectedId) {
      appendCrudLog({ action: 'Update test record', ok: false, payload: { message: 'Select a record id first' } })
      return
    }

    await withErrorCapture('Update test record', () => api.qa.updateTestRecord(crudSelectedId, { title: `${crudTitle} (updated)` }))
  }

  const crudDelete = async () => {
    if (!crudSelectedId) {
      appendCrudLog({ action: 'Delete test record', ok: false, payload: { message: 'Select a record id first' } })
      return
    }

    await withErrorCapture('Delete test record', () => api.qa.deleteTestRecord(crudSelectedId))
  }

  const cloudwatchHint = useMemo(() => {
    if (!lastError?.correlationId) return ''
    return `correlationId=\"${lastError.correlationId}\"`
  }, [lastError])

  const copyCloudwatchHint = async () => {
    if (!cloudwatchHint) return
    try {
      await navigator.clipboard.writeText(cloudwatchHint)
    } catch (_) {
      // no-op
    }
  }

  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Deployment Readiness</p>
        <h2 className="font-display text-4xl font-semibold text-[var(--sb-text)]">QA + Release Verification</h2>
        <p className="text-[var(--sb-muted)]">
          Use this page to verify authentication, CRUD, error handling, AWS logging, and PWA/mobile readiness end-to-end.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="chip bg-white" onClick={resetAll}>
          Reset All
        </button>
        <button type="button" className="chip border-slate-900 bg-slate-900 text-white" onClick={exportResults}>
          Export Results (JSON)
        </button>
        <span className="chip bg-white/70 text-xs">Persist: {persistMode}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">
          <h3 className="font-display text-2xl font-semibold text-[var(--sb-text)]">Auth Debug Panel</h3>
          <p className="mt-2 text-sm text-[var(--sb-muted)]">Session status and token tools for QA.</p>

          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="font-semibold text-[var(--sb-text)]">Authenticated:</span> {user ? 'Yes' : 'No'}
            </p>
            <p>
              <span className="font-semibold text-[var(--sb-text)]">User:</span> {user?.id ?? '—'} ({user?.email ?? '—'})
            </p>
            <p>
              <span className="font-semibold text-[var(--sb-text)]">Token expiry:</span>{' '}
              {authDebug.session?.expires_at ? new Date(authDebug.session.expires_at * 1000).toISOString() : '—'}
            </p>
          </div>

          {authDebug.refreshError && <p className="mt-3 text-sm text-rose-600">{authDebug.refreshError}</p>}

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="chip bg-white" onClick={refreshSession}>
              Force refresh session
            </button>
            <button
              type="button"
              className={`chip ${invalidTokenEnabled ? 'border-rose-600 bg-rose-600 text-white' : 'bg-white'}`}
              onClick={toggleInvalidToken}
            >
              {invalidTokenEnabled ? 'Disable invalid token' : 'Simulate invalid token'}
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">
          <h3 className="font-display text-2xl font-semibold text-[var(--sb-text)]">PWA Status</h3>
          <p className="mt-2 text-sm text-[var(--sb-muted)]">Installability, standalone mode, service worker, offline.</p>

          <div className="mt-4 grid gap-2 text-sm">
            <p>
              <span className="font-semibold text-[var(--sb-text)]">Offline:</span> {pwa.offline ? 'Yes' : 'No'}
            </p>
            <p>
              <span className="font-semibold text-[var(--sb-text)]">Standalone:</span> {pwa.standalone ? 'Yes' : 'No'}
            </p>
            <p>
              <span className="font-semibold text-[var(--sb-text)]">Service worker supported:</span> {pwa.swSupported ? 'Yes' : 'No'}
            </p>
            <p>
              <span className="font-semibold text-[var(--sb-text)]">Service worker controlling page:</span> {pwa.swController ? 'Yes' : 'No'}
            </p>
            <p>
              <span className="font-semibold text-[var(--sb-text)]">Install prompt available:</span> {pwa.installPromptAvailable ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">
        <h3 className="font-display text-2xl font-semibold text-[var(--sb-text)]">CRUD Test Harness</h3>
        <p className="mt-2 text-sm text-[var(--sb-muted)]">
          Runs authenticated Create/Read/Update/Delete against <code>qa_test_records</code> via the API.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
            Record title
            <input
              value={crudTitle}
              onChange={(e) => setCrudTitle(e.target.value)}
              className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-2 text-sm"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
            Selected record id
            <input
              value={crudSelectedId}
              onChange={(e) => setCrudSelectedId(e.target.value)}
              className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-2 text-sm"
              placeholder="(auto-filled after create)"
            />
          </label>

          <div className="flex flex-col justify-end gap-2">
            <div className="flex flex-wrap gap-2">
              <button type="button" className="chip bg-white" onClick={crudCreate}>
                Create
              </button>
              <button type="button" className="chip bg-white" onClick={crudRead}>
                Read
              </button>
              <button type="button" className="chip bg-white" onClick={crudUpdate}>
                Update
              </button>
              <button type="button" className="chip bg-white" onClick={crudDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>

        <label className="mt-4 flex flex-col gap-2 text-sm font-medium text-[var(--sb-text)]">
          Payload (JSON or text)
          <textarea
            rows={3}
            value={crudPayload}
            onChange={(e) => setCrudPayload(e.target.value)}
            className="rounded-2xl border border-[var(--sb-border)] bg-white px-4 py-2 text-sm"
          />
        </label>

        {lastError?.correlationId && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm text-rose-700">
              <span className="font-semibold">Last error:</span> {lastError.message}
            </p>
            <p className="mt-1 text-xs text-rose-700">CorrelationId: {lastError.correlationId}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" className="chip bg-white" onClick={copyCloudwatchHint}>
                Copy CloudWatch Search Hint
              </button>
              <span className="chip bg-white/70 text-xs">{cloudwatchHint}</span>
            </div>
          </div>
        )}

        <div className="mt-5 rounded-2xl border border-[var(--sb-border)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--sb-muted)]">Console</p>
          <pre className="mt-3 max-h-72 overflow-auto text-xs text-slate-700">
            {JSON.stringify(crudLog, null, 2)}
          </pre>
        </div>
      </div>

      <div className="space-y-5">
        {checklist.map((section) => (
          <div key={section.id} className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6">
            <h3 className="font-display text-2xl font-semibold text-[var(--sb-text)]">{section.title}</h3>

            <div className="mt-5 space-y-4">
              {section.items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-[var(--sb-border)] bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={item.checked}
                        onChange={(e) =>
                          updateItem(section.id, item.id, (prev) => ({
                            ...prev,
                            checked: e.target.checked,
                            timestamp: e.target.checked ? nowIso() : null,
                            status: e.target.checked ? 'passed' : 'not_started',
                          }))
                        }
                      />
                      <span className="text-sm font-medium text-[var(--sb-text)]">{item.label}</span>
                    </label>

                    <span className={`chip text-xs ${statusClass[item.status]}`}>{statusLabel[item.status]}</span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--sb-muted)]">
                      Status
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateItem(section.id, item.id, (prev) => ({
                            ...prev,
                            status: e.target.value as ChecklistStatus,
                            timestamp: nowIso(),
                          }))
                        }
                        className="rounded-2xl border border-[var(--sb-border)] bg-white px-3 py-2 text-sm text-[var(--sb-text)]"
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="passed">Passed</option>
                        <option value="failed">Failed</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--sb-muted)] md:col-span-2">
                      Notes
                      <input
                        value={item.notes}
                        onChange={(e) => updateItem(section.id, item.id, (prev) => ({ ...prev, notes: e.target.value }))}
                        className="rounded-2xl border border-[var(--sb-border)] bg-white px-3 py-2 text-sm"
                        placeholder="What did you observe?"
                      />
                    </label>

                    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--sb-muted)] md:col-span-2">
                      Evidence (links / logs)
                      <input
                        value={item.evidence}
                        onChange={(e) =>
                          updateItem(section.id, item.id, (prev) => ({ ...prev, evidence: e.target.value }))
                        }
                        className="rounded-2xl border border-[var(--sb-border)] bg-white px-3 py-2 text-sm"
                        placeholder="Paste screenshot link or log reference"
                      />
                    </label>

                    <div className="flex flex-col justify-end">
                      <p className="text-xs text-[var(--sb-muted)]">Timestamp</p>
                      <p className="text-sm text-[var(--sb-text)]">{item.timestamp ?? '—'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
