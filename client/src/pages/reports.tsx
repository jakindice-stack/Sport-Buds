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
        <li>User taps “Report Event” button on event popup.</li>
        <li>Modal collects reason (dropdown + free text) and submits to Supabase.</li>
        <li>Confirmation toast + optional follow-up instructions.</li>
      </ol>
    ),
  },
  {
    id: 'data',
    title: 'Data Model & API',
    content: (
      <ul>
        <li>
          Supabase <code>{'reports'}</code> table (reporter_id, reported_event_id, reason, status).
        </li>
        <li>
          Client helper <code>{'api.reports.createReport(payload)'}</code> stores the entry and returns confirmation.
        </li>
        <li>Admin log view uses <code>{'api.reports.getReports()'}</code> ordered by newest first.</li>
      </ul>
    ),
  },
  {
    id: 'acceptance',
    title: 'Acceptance Criteria',
    content: (
      <ul>
        <li>Report submits once per user per event without duplicate spam.</li>
        <li>Modal validates reason length and prevents empty submissions.</li>
        <li>Admins see new report within seconds (Supabase real-time optional).</li>
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
