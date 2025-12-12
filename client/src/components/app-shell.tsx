import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/lib/api/client'

type NavItem = {
  to: string
  label: string
  requiresHost?: boolean
}

const baseNav: NavItem[] = [
  { to: '/app/dashboard', label: 'Dashboard' },
  { to: '/app/map', label: 'Map' },
  { to: '/app/find-events', label: 'Find Events' },
  { to: '/app/search', label: 'Search / Filters' },
  { to: '/app/profile', label: 'Profile' },
  { to: '/app/notifications', label: 'Notifications' },
  { to: '/app/reports', label: 'Reports' },
  { to: '/app/rsvp-management', label: 'RSVP Management', requiresHost: true },
  { to: '/app/deployment-readiness', label: 'Deployment Readiness' },
]

const NavList = ({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) => (
  <nav className="flex flex-col gap-2 text-sm font-medium">
    {items.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={onNavigate}
        className={({ isActive }) =>
          `chip justify-between transition-colors ${
            isActive
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'bg-white/70 hover:border-slate-400 hover:text-slate-900'
          }`
        }
      >
        {item.label}
        <span aria-hidden="true">→</span>
      </NavLink>
    ))}
  </nav>
)

export const AppShell = ({ children }: { children?: ReactNode }) => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isHost, setIsHost] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!user) return
      const { data } = await api.events.getEvents()
      if (cancelled) return
      const hasHosted = Array.isArray(data) && data.some((evt: any) => String(evt.host_id) === String(user.id))
      setIsHost(hasHosted)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [user])

  const navItems = useMemo(() => baseNav.filter((item) => !item.requiresHost || isHost), [isHost])

  const onSignOut = async () => {
    await signOut()
    navigate('/auth', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[var(--sb-bg)] text-[var(--sb-text)]">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          role="button"
          tabIndex={-1}
          onClick={() => setMobileOpen(false)}
          onKeyDown={() => setMobileOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-[min(86vw,22rem)] overflow-y-auto bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Sport Buds</p>
                <h2 className="font-display text-xl font-semibold text-[var(--sb-text)]">Menu</h2>
                <p className="text-sm text-[var(--sb-muted)]">Signed in as {user?.email}</p>
              </div>
              <button type="button" className="chip bg-white" onClick={() => setMobileOpen(false)}>
                Close
              </button>
            </div>
            <div className="mt-6">
              <NavList items={navItems} onNavigate={() => setMobileOpen(false)} />
            </div>
            <div className="mt-6">
              <button type="button" className="chip bg-white" onClick={onSignOut}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row lg:gap-10 lg:px-8">
        <aside className="hidden lg:block lg:w-72">
          <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6 lg:sticky lg:top-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Sport Buds</p>
              <h1 className="font-display text-2xl font-semibold text-[var(--sb-text)]">App</h1>
              <p className="text-sm text-[var(--sb-muted)]">Signed in as {user?.email}</p>
            </div>
            <div className="mt-6">
              <NavList items={navItems} />
            </div>
            <div className="mt-6">
              <button type="button" className="chip bg-white" onClick={onSignOut}>
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 px-4 py-4 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Sport Buds</p>
              <button type="button" className="chip bg-white" onClick={() => setMobileOpen(true)}>
                Menu
              </button>
            </div>
          </div>

          <div className="glass-card mt-0 px-6 py-10 lg:mt-6">{children ? children : <Outlet />}</div>
        </main>
      </div>
    </div>
  )
}
