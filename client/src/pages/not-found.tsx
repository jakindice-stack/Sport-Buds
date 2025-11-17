import { Link } from 'react-router-dom'

export const NotFound = () => (
  <section className="space-y-6 text-center">
    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">404</p>
    <h2 className="text-4xl font-bold text-slate-900">Nothing to see here yet.</h2>
    <p className="text-lg text-slate-600">Pick a feature from the navigation to jump back into the build.</p>
    <Link className="inline-flex rounded-full bg-slate-900 px-5 py-2 text-white" to="/">
      Return Home
    </Link>
  </section>
)
