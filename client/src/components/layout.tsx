import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/events/create', label: 'Create Event' },
  { to: '/events/filter', label: 'Filter by Sport' },
  { to: '/discover/map', label: 'Map Discovery' },
  { to: '/events/rsvp', label: 'RSVP' },
  { to: '/host/dashboard', label: 'Host Dashboard' },
  { to: '/profile/manage', label: 'Profile' },
  { to: '/reports', label: 'Reports' },
  { to: '/ratings', label: 'Host Ratings' },
]

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-[var(--sb-bg)] text-[var(--sb-text)]">
    <header className="sticky top-0 z-20 border-b border-[var(--sb-border)] bg-[var(--sb-bg)]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Sport Buds</p>
          <h1 className="font-display text-3xl font-semibold">Feature Explorer</h1>
        </div>
        <nav className="flex flex-wrap gap-2 text-sm font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `chip transition-colors ${
                  isActive
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'bg-white/70 hover:border-slate-400 hover:text-slate-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>

    <main className="relative mx-auto w-full max-w-6xl px-6 py-12">
      <div className="glass-card w-full px-6 py-10">
        {children}
      </div>
    </main>
  </div>
)
