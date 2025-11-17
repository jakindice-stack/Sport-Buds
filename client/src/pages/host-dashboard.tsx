import { FeaturePage } from '@/components/feature-page'
import type { FeatureSection } from '@/components/feature-page'

const sections: FeatureSection[] = [
  {
    id: 'objective',
    title: 'Host Mission',
    content: (
      <ul>
        <li>Give hosts a control center for tracking RSVPs and capacity in real time.</li>
        <li>Alert hosts when the attendee count meets or exceeds the configured cap.</li>
        <li>Surface quick actions (message attendees, duplicate event) for future phases.</li>
      </ul>
    ),
  },
  {
    id: 'data',
    title: 'Data Inputs & Queries',
    content: (
      <ul>
        <li>
          <code>{'api.rsvps.getEventRsvps(eventId)'}</code> + <code>{'api.events.getEvent(eventId)'}</code> supply attendee
          names and limits.
        </li>
        <li>
          Aggregate counts client-side for MVP; future versions can leverage Supabase RPC for speed.
        </li>
        <li>Track capacity threshold and trigger “full” badge when reached.</li>
      </ul>
    ),
  },
  {
    id: 'ui-structure',
    title: 'UI Structure',
    content: (
      <ul>
        <li>Hero card summarizing event details and capacity (e.g., 12/14).</li>
        <li>List of attendees with status chips (Going / Maybe / Not Going).</li>
        <li>Notification block when waitlist should start.</li>
      </ul>
    ),
  },
  {
    id: 'acceptance',
    title: 'Acceptance Criteria',
    content: (
      <ul>
        <li>Counts update instantly when RSVPs change.</li>
        <li>Capacity alert renders when max is hit.</li>
        <li>No console errors when switching between events.</li>
      </ul>
    ),
  },
]

export const HostDashboardPage = () => (
  <FeaturePage
    title="Host RSVP Tracking"
    subtitle="Hosts need visibility into attendance and capacity to run smooth sessions."
    sections={sections}
  />
)
