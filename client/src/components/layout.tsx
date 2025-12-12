import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home Dashboard' },
  { to: '/events/create', label: 'Create Event' },
  { to: '/events/filter', label: 'Filter by Sport' },
  { to: '/discover/map', label: 'Map Discovery' },
  { to: '/events/rsvp', label: 'RSVP' },
  { to: '/host/dashboard', label: 'Host Dashboard' },
  { to: '/profile/manage', label: 'Profile' },
  { to: '/reports', label: 'Reports' },
  { to: '/ratings', label: 'Host Ratings' },
]

const NavigationLinks = () => (
  <nav className="flex flex-col gap-2 text-sm font-medium">
    {navLinks.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        className={({ isActive }) =>
          `chip justify-between transition-colors ${
            isActive
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'bg-white/70 hover:border-slate-400 hover:text-slate-900'
          }`
        }
      >
        {link.label}
        <span aria-hidden="true">→</span>
      </NavLink>
    ))}
  </nav>
)

export const Layout = ({ children }: { children: ReactNode }) => (
  <LayoutInner>{children}</LayoutInner>
)

const LayoutInner = ({ children }: { children: ReactNode }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    if (!mobileNavOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileNavOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileNavOpen])

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileNavOpen])

  return (
    <div className="min-h-screen bg-[var(--sb-bg)] text-[var(--sb-text)]">
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          role="button"
          tabIndex={-1}
          onClick={() => setMobileNavOpen(false)}
          onKeyDown={() => setMobileNavOpen(false)}
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
                <h2 className="font-display text-xl font-semibold text-[var(--sb-text)]">Table of Contents</h2>
                <p className="text-sm text-[var(--sb-muted)]">Jump to any feature screen.</p>
              </div>
              <button
                type="button"
                className="chip bg-white"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation"
              >
                Close
              </button>
            </div>

            <div className="mt-6">
              <nav className="flex flex-col gap-2 text-sm font-medium">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileNavOpen(false)}
                    className={({ isActive }) =>
                      `chip justify-between transition-colors ${
                        isActive
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'bg-white/70 hover:border-slate-400 hover:text-slate-900'
                      }`
                    }
                  >
                    {link.label}
                    <span aria-hidden="true">→</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row lg:gap-10 lg:px-8">
        <aside className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6 lg:sticky lg:top-6 lg:h-fit lg:w-72">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Sport Buds</p>
            <h1 className="font-display text-2xl font-semibold text-[var(--sb-text)]">Feature Explorer</h1>
            <p className="text-sm text-[var(--sb-muted)]">
              Navigate every product prototype from one table-of-contents panel. Always visible, always current.
            </p>
          </div>
          <div className="mt-6 hidden lg:block">
            <NavigationLinks />
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-[var(--sb-border)] bg-white/70 p-4 text-xs text-[var(--sb-muted)]">
            <p className="font-semibold text-[var(--sb-text)]">Need access?</p>
            <p>Visit the new /auth page to send yourself a signup link or manage credentials.</p>
          </div>
        </aside>

        <div className="flex-1">
          <div className="rounded-3xl border border-[var(--sb-border)] bg-white/80 px-4 py-4 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Navigation</p>
              <button
                type="button"
                className="chip bg-white"
                onClick={() => setMobileNavOpen(true)}
              >
                Menu
              </button>
            </div>
          </div>

          <div className="glass-card mt-0 px-6 py-10 lg:mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
