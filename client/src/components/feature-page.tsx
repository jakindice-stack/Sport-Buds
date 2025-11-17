import type { ReactNode } from 'react'

export type FeatureSection = {
  id: string
  title: string
  description?: string
  content: ReactNode
}

interface FeaturePageProps {
  title: string
  subtitle: string
  sections: FeatureSection[]
  ctas?: { label: string; href: string }[]
}

export const FeaturePage = ({ title, subtitle, sections, ctas = [] }: FeaturePageProps) => {
  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--sb-muted)]">Feature</p>
        <div className="space-y-2">
          <h2 className="font-display text-4xl font-semibold text-[var(--sb-text)]">{title}</h2>
          <p className="text-lg text-[var(--sb-muted)]">{subtitle}</p>
        </div>
        {ctas.length > 0 && (
          <div className="flex flex-wrap gap-3 text-sm font-medium">
            {ctas.map((cta) => (
              <a
                key={cta.href}
                href={cta.href}
                className="chip bg-white/80 text-[var(--sb-text)] hover:border-slate-400"
              >
                {cta.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <nav className="flex flex-wrap gap-3 text-sm">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="chip bg-white/70 hover:border-slate-400 hover:text-slate-900"
          >
            {section.title}
          </a>
        ))}
      </nav>

      <div className="space-y-10">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="space-y-4 rounded-3xl border border-[var(--sb-border)] bg-white/80 px-5 py-6"
          >
            <div className="space-y-1">
              <h3 className="font-display text-2xl font-semibold text-[var(--sb-text)]">{section.title}</h3>
              {section.description && <p className="text-[var(--sb-muted)]">{section.description}</p>}
            </div>
            <div className="feature-section prose prose-slate max-w-none text-[var(--sb-muted)]">
              {section.content}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}
