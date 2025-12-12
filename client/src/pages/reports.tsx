import { FeaturePage } from '@/components/feature-page'
import type { FeatureSection } from '@/components/feature-page'

const sections: FeatureSection[] = [
  {
    id: 'purpose',
    title: 'Safety Mission',
    content: (
      <ul>
        <li>Community trust relies on quick reporting of unsafe or inappropriate events.</li>
        <li>Reports notify admins and can temporarily hide questionable listings.</li>
        <li>Aligns with PRD Feature #7 “Event Reporting”.</li>
      </ul>
    ),
  },
  {
    id: 'report-flow',
    title: 'Report Flow',
    content: (
      <ol>
        <li>User taps “Report” from event card, map pin, or profile.</li>
        <li>
          Modal first asks “What are you reporting?” with explicit options (Event vs User) before showing contextual
          fields.
        </li>
        <li>
          Form collects quick dropdown reason + free-text comment box, then submits to Supabase with reporter metadata.
        </li>
        <li>
          Confirmation toast + optional follow-up instructions. Too many reports on an entity auto-flags and temporarily
          suspends it until reviewed.
        </li>
      </ol>
    ),
  },
  {
    id: 'data',
    title: 'Data Model & API',
    content: (
      <ul>
        <li>
          Supabase <code>{'reports'}</code> table (reporter_id, reported_event_id, reported_user_id, reason, comment,
          status, auto_flag Boolean).
        </li>
        <li>
          Client helper <code>{'api.reports.createReport(payload)'}</code> stores the entry and returns confirmation +
          auto-flag hints.
        </li>
        <li>
          Admin log view uses <code>{'api.reports.getReports()'}</code> ordered by newest first, surfaced alongside host ratings
          and event history context.
        </li>
      </ul>
    ),
  },
  {
    id: 'acceptance',
    title: 'Acceptance Criteria',
    content: (
      <ul>
        <li>Report submits once per user per event without duplicate spam; UI enforces cooldown.</li>
        <li>Modal validates reason length and prevents empty submissions; user/event radio must be selected.</li>
        <li>Admins see new report within seconds (Supabase real-time optional) and auto-flag threshold toggles item.</li>
      </ul>
    ),
  },
]

export const ReportsPage = () => (
  <FeaturePage
    title="Event Reporting"
    subtitle="Safety tooling for flagging inappropriate events and hosts."
    sections={sections}
  />
)
