import { FeaturePage } from '@/components/feature-page'
import type { FeatureSection } from '@/components/feature-page'

const sections: FeatureSection[] = [
  {
    id: 'user-story',
    title: 'User Story & Objective',
    content: (
      <ul>
        <li>Hosts need a fast, validated way to publish sports events with enough detail for attendees.</li>
        <li>Supports PRD Feature #1 and Task List section “Create Sports Event”.</li>
        <li>Success = event persists to Supabase and appears on the discovery map/list instantly.</li>
      </ul>
    ),
  },
  {
    id: 'form-blueprint',
    title: 'Form Blueprint',
    content: (
      <ul>
        <li>
          Required inputs: title, sport, start/end time, location, coordinates, max participants, skill level, host id.
        </li>
        <li>Validation: no empty strings, chronological times, participant cap &gt; 0, coordinates numeric.</li>
        <li>UX Considerations: multi-step guard rails, defaulting skill level to “all”, surface helper copy.</li>
      </ul>
    ),
  },
  {
    id: 'data-model',
    title: 'Data Model & API',
    content: (
      <div>
        <p className="font-medium">
          Supabase <code>{'events'}</code> table
        </p>
        <ul>
          <li>Fields: id, title, sport, time fields, location, lat/lng, max_participants, skill_level, host_id.</li>
          <li>
            API: POST <code>{'/api/events/create'}</code> → Supabase insert via
            <code>{'api.events.createEvent'}</code> helper.
          </li>
          <li>On success emit toast + redirect to discovery page.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'testing',
    title: 'Testing & Acceptance Criteria',
    content: (
      <ul>
        <li>Unit: ensure schema validation rejects invalid payloads.</li>
        <li>Integration: mock Supabase insert and assert map/list refresh triggers.</li>
        <li>E2E smoke: create event, confirm RSVP counter initializes at 0.</li>
      </ul>
    ),
  },
]

export const CreateEventPage = () => (
  <FeaturePage
    title="Create Sports Event"
    subtitle="Hosts configure new matches, practices, or tournaments with rich metadata."
    sections={sections}
    ctas={[{ label: 'View API helper', href: '#data-model' }]}
  />
)
