import { Link } from 'react-router-dom'

const tiles = [
  {
    to: '/app/create-event',
    title: 'Create Event',
    subtitle: 'Host a new pickup game or practice.',
  },
  {
    to: '/app/find-events',
    title: 'Find Events',
    subtitle: 'Browse upcoming events as a clean list.',
  },
  {
    to: '/app/map',
    title: 'Map',
    subtitle: 'Explore events visually with pins and previews.',
  },
  {
    to: '/app/profile',
    title: 'Profile',
    subtitle: 'Manage your athlete profile and preferences.',
  },
]

export const AppDashboardPage = () => {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Dashboard</p>
        <h2 className="font-display text-4xl font-semibold text-[var(--sb-text)]">Welcome</h2>
        <p className="text-[var(--sb-muted)]">Start with one of the core actions below.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {tiles.map((tile) => (
          <Link
            key={tile.to}
            to={tile.to}
            className="flex flex-col justify-between rounded-3xl border border-[var(--sb-border)] bg-white/80 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="space-y-2">
              <h3 className="font-display text-2xl font-semibold text-[var(--sb-text)]">{tile.title}</h3>
              <p className="text-sm text-[var(--sb-muted)]">{tile.subtitle}</p>
            </div>
            <div className="mt-6 inline-flex items-center text-sm font-semibold text-[var(--sb-accent)]">
              Open
              <span aria-hidden="true">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
