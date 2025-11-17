import { FeaturePage } from '@/components/feature-page'
import type { FeatureSection } from '@/components/feature-page'

const sections: FeatureSection[] = [
  {
    id: 'overview',
    title: 'Flow Overview',
    content: (
      <ul>
        <li>Single-tap RSVP button on event card and detail modal.</li>
        <li>
          Prevents duplicate RSVPs by upserting on <code>{'event_id,user_id'}</code> composite.
        </li>
        <li>Instantly updates attendee count locally while Supabase confirms.</li>
      </ul>
    ),
  },
  {
    id: 'api',
    title: 'API Contract',
    content: (
      <ul>
        <li>
          <code>{"api.rsvps.upsertRsvp({ event_id, user_id, status: 'going' })"}</code> uses Supabase upsert with
          onConflict guard.
        </li>
        <li>
          <code>{'api.rsvps.getEventRsvps(eventId)'}</code> hydrates attendee list for hosts.
        </li>
        <li>
          Server route <code>{'/api/events/:id/rsvp'}</code> mirrors client helper for future SSR needs.
        </li>
      </ul>
    ),
  },
  {
    id: 'edge-cases',
    title: 'Edge Cases & UX',
    content: (
      <ul>
        <li>Show pending spinner + optimistic confirmation message.</li>
        <li>Handle event at capacity with disabled button + toast.</li>
        <li>Allow status toggle (Going, Maybe, Not Going) for clarity.</li>
      </ul>
    ),
  },
  {
    id: 'tests',
    title: 'Test Strategy',
    content: (
      <ul>
        <li>Unit test: upsert helper builds correct payload.</li>
        <li>Integration: duplicate RSVP attempt keeps single record.</li>
        <li>E2E: RSVP to event, refresh page, ensure count persisted.</li>
      </ul>
    ),
  },
]

export const RsvpPage = () => (
  <FeaturePage
    title="RSVP System"
    subtitle="Participants can commit to events with confidence and instant feedback."
    sections={sections}
  />
)
