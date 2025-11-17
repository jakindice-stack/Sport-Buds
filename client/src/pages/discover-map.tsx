import { FeaturePage } from '@/components/feature-page'
import type { FeatureSection } from '@/components/feature-page'

const sections: FeatureSection[] = [
  {
    id: 'experience',
    title: 'Map Experience Overview',
    content: (
      <ul>
        <li>Centered on the user’s current location via browser geolocation.</li>
        <li>Leaflet.js (or similar) renders markers; fallback list appears if permissions are denied.</li>
        <li>Markers show event title, sport, start time, and RSVP count.</li>
      </ul>
    ),
  },
  {
    id: 'technical',
    title: 'Technical Requirements',
    content: (
      <ul>
        <li>Request geolocation on load, handle permission decline gracefully.</li>
        <li>
          Feed map with data from <code>{'api.events.getEvents'}</code>; convert lat/lng to marker positions.
        </li>
        <li>Provide click popovers linking to RSVP view and host rating summary.</li>
      </ul>
    ),
  },
  {
    id: 'acceptance',
    title: 'Acceptance Criteria',
    content: (
      <ul>
        <li>Map initializes without console errors and recenters when the user location updates.</li>
        <li>Markers accurately reflect Supabase event records.</li>
        <li>List fallback shows matching data for accessibility.</li>
      </ul>
    ),
  },
]

export const MapDiscoveryPage = () => (
  <FeaturePage
    title="Map-Based Discovery"
    subtitle="Interactive map anchors the browsing experience for nearby events."
    sections={sections}
  />
)
