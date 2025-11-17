import { Link } from 'react-router-dom'

const featureLinks = [
  { to: '/events/create', title: 'Create Sports Event', summary: 'Build, validate, and publish new events.' },
  { to: '/events/filter', title: 'Filter by Sport', summary: 'Quickly narrow the event list by sport type.' },
  { to: '/discover/map', title: 'Map-Based Discovery', summary: 'Preview the geolocated browsing experience.' },
  { to: '/events/rsvp', title: 'RSVP System', summary: 'Outline RSVP flows and safeguards.' },
  { to: '/host/dashboard', title: 'Host RSVP Tracking', summary: 'Monitor capacity and attendee insights.' },
  { to: '/profile/manage', title: 'Profile Creation', summary: 'Capture athlete preferences and bios.' },
  { to: '/reports', title: 'Event Reporting', summary: 'Keep the community safe with reports.' },
  { to: '/ratings', title: 'Host Reliability Rating', summary: 'Rate hosts and view averages.' },
]

export const Home = () => {
  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Sport Buds MVP</p>
        <div className="space-y-3">
          <h2 className="font-display text-4xl font-semibold text-[var(--sb-text)]">Product Feature Playground</h2>
          <p className="text-lg text-[var(--sb-muted)]">
            Choose a feature to inspect its user story, data needs, and integration touchpoints before production-ready
            builds.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {featureLinks.map((feature, index) => (
          <Link
            key={feature.to}
            to={feature.to}
            className="group flex h-full flex-col justify-between rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
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
