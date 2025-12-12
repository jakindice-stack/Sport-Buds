import { FeaturePage } from '@/components/feature-page'
import type { FeatureSection } from '@/components/feature-page'

const sections: FeatureSection[] = [
  {
    id: 'user-story',
    title: 'User Story & Goals',
    content: (
      <ul>
        <li>As a player I only want to see the sports I actually play.</li>
        <li>Filters must respond instantly and persist until deliberately cleared.</li>
        <li>Directly tied to Task List #2 “Filter by Sport” and the Map page’s dropdown tab.</li>
      </ul>
    ),
  },
  {
    id: 'controls',
    title: 'Filter Controls',
    content: (
      <ul>
        <li>Primary dropdown listing supported sports (basketball, soccer, tennis, etc.) embedded as a tab on Map-Based Discovery.</li>
        <li>Optional quick chips for “All”, “Indoor”, “Outdoor” once taxonomy is ready.</li>
        <li>Expose map/list toggle plus “Event Type” dropdown for future iteration.</li>
        <li>Remember to debounce changes if additional filters (skill, distance) join later.</li>
      </ul>
    ),
  },
  {
    id: 'supabase-query',
    title: 'Supabase Query Plan',
    content: (
      <ul>
        <li>
          Use <code>{'api.events.getEvents({ sport: selectedSport, skill })'}</code> which wraps
          <code>{"eq('sport', selectedSport)"}</code> + optional <code>{"eq('skill_level', skill)"}</code>.
        </li>
        <li>When “All” is chosen, skip the filter and return cached events.</li>
        <li>Consider local caching via React Query to avoid duplicate round-trips and keep the map + discovery list synchronized.</li>
      </ul>
    ),
  },
  {
    id: 'acceptance',
    title: 'Acceptance Criteria',
    content: (
      <ul>
        <li>Dropdown selection updates both map markers and list view in under 300ms.</li>
        <li>Filter persists across route changes within the same session.</li>
        <li>Clearing restores full dataset without requiring reload.</li>
      </ul>
    ),
  },
]

export const FilterBySportPage = () => (
  <FeaturePage
    title="Filter by Sport"
    subtitle="Dynamic filtering keeps athletes focused on relevant events."
    sections={sections}
  />
)
