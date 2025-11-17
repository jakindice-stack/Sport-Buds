import { FeaturePage } from '@/components/feature-page'
import type { FeatureSection } from '@/components/feature-page'

const sections: FeatureSection[] = [
  {
    id: 'why-ratings',
    title: 'Why Host Ratings',
    content: (
      <ul>
        <li>Reward reliable hosts and give newcomers confidence.</li>
        <li>Encourages better event management and accountability.</li>
        <li>Ties to PRD Feature #8 “Host Reliability Rating”.</li>
      </ul>
    ),
  },
  {
    id: 'data',
    title: 'Data Model',
    content: (
      <ul>
        <li>
          Supabase <code>{'ratings'}</code> table storing from_user_id, to_user_id, event_id, rating (1-5), optional
          comment.
        </li>
        <li>
          Client helper <code>{'api.ratings.createRating(payload)'}</code> posts the review after an event concludes.
        </li>
        <li>
          Aggregation via <code>{'api.ratings.getHostRatings(hostId)'}</code> + reduce to compute averages in UI.
        </li>
      </ul>
    ),
  },
  {
    id: 'ux-flow',
    title: 'UX Flow',
    content: (
      <ol>
        <li>User sees “Rate Host” button after attending an event.</li>
        <li>Modal collects stars + optional feedback, one submission per user per event.</li>
        <li>Host profile displays aggregate rating and latest comments.</li>
      </ol>
    ),
  },
  {
    id: 'acceptance',
    title: 'Acceptance Criteria',
    content: (
      <ul>
        <li>Rating allowed once per attendee per event.</li>
        <li>Average updates immediately after submission.</li>
        <li>Host card surfaces rating badge (e.g., 4.7 ★) across the app.</li>
      </ul>
    ),
  },
]

export const HostRatingsPage = () => (
  <FeaturePage
    title="Host Reliability Rating"
    subtitle="Post-event reviews help surface trusted organizers and improve accountability."
    sections={sections}
  />
)
