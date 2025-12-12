import { Link } from 'react-router-dom'

const featureLinks = [
  { to: '/events/create', title: 'Create Sports Event', summary: 'Publish rich events with mandatory sport metadata.' },
  { to: '/discover/map', title: 'Map-Based Discovery', summary: 'View live pins, preview cards, and rating badges.' },
  { to: '/events/filter', title: 'Filter by Sport', summary: 'Use dropdown tabs to focus the map and list.' },
  { to: '/events/rsvp', title: 'RSVP System', summary: 'Manage confirmations, waitlists, and actions.' },
  { to: '/host/dashboard', title: 'Host Dashboard', summary: 'Inbox for pending RSVPs plus capacity insights.' },
  { to: '/profile/manage', title: 'Profile Creation', summary: 'Required identity fields plus optional extras.' },
  { to: '/reports', title: 'Event Reporting', summary: 'Flag unsafe users or events with structured flows.' },
  { to: '/ratings', title: 'Host Reliability Rating', summary: '5-star scoring with averages surfaced everywhere.' },
]

export const Home = () => {
  return (
    <section className="space-y-12">
      <header className="rounded-3xl border border-[var(--sb-border)] bg-white/80 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Home Dashboard</p>
        <h2 className="mt-3 font-display text-4xl font-semibold text-[var(--sb-text)]">Product Feature Playground</h2>
        <p className="mt-3 text-lg text-[var(--sb-muted)]">
          Launch into any Sport Buds capability in one click. Each tile mirrors the production plan—user stories, data
          contracts, and acceptance criteria—so demos stay aligned with implementation.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/events/create"
            className="chip border-slate-900 bg-slate-900 text-white hover:opacity-90"
          >
            Create Event Workflow
          </Link>
          <Link
            to="/discover/map"
            className="chip bg-white/70 hover:border-slate-400 hover:text-slate-900"
          >
            Explore Map Pins
          </Link>
          <Link
            to="/auth"
            className="chip bg-white/70 hover:border-slate-400 hover:text-slate-900"
          >
            Manage Access
          </Link>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {featureLinks.map((feature, index) => (
          <Link
            key={feature.to}
            to={feature.to}
            className="group flex h-full flex-col justify-between rounded-3xl border border-[var(--sb-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="space-y-3">
              <div className="chip inline-flex items-center gap-2 bg-white/70 text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">
                <span>Feature</span>
                <span className="text-[var(--sb-accent)]">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-[var(--sb-text)]">{feature.title}</h3>
              <p className="text-[var(--sb-muted)]">{feature.summary}</p>
            </div>
            <div className="mt-6 inline-flex items-center text-sm font-semibold text-[var(--sb-accent)] group-hover:gap-3">
              Explore
              <span aria-hidden="true">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
