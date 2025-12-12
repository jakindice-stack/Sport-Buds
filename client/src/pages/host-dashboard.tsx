import { FeaturePage } from '@/components/feature-page'
import type { FeatureSection } from '@/components/feature-page'

const sections: FeatureSection[] = [
  {
    id: 'objective',
    title: 'Host Mission',
    content: (
      <ul>
        <li>Give hosts a control center for tracking RSVPs and capacity in real time.</li>
        <li>
          Alert hosts when the attendee count meets or exceeds the configured cap and highlight waitlist thresholds.
        </li>
        <li>
          Introduce an inbox with two tabs: “Needs Confirmation” (new RSVPs) and “Confirmed” so hosts can triage at a glance.
        </li>
        <li>Surface quick actions (message attendees, duplicate event, mark as full) for future phases.</li>
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
        <li>Hero card summarizing event details and capacity (e.g., 12/14) with host rating badge.</li>
        <li>
          Inbox component showing tabs for confirmed RSVPs vs pending confirmations, each with quick approve/decline controls.
        </li>
        <li>List of attendees with status chips (Going / Maybe / Not Going) and filter for “needs review”.</li>
        <li>Notification block when waitlist should start and option to broadcast updates.</li>
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
