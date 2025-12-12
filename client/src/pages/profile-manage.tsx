import { FeaturePage } from '@/components/feature-page'
import type { FeatureSection } from '@/components/feature-page'

const sections: FeatureSection[] = [
  {
    id: 'user-story',
    title: 'User Story',
    content: (
      <ul>
        <li>Students and local athletes need profiles that highlight their sports, skill levels, and availability.</li>
        <li>Profiles power smarter matching and trust when viewing hosts or attendees.</li>
        <li>Maps to PRD Feature #6 “Profile Creation”.</li>
        <li>Hosts should see their historical ratings and event history surfaced alongside profile basics.</li>
      </ul>
    ),
  },
  {
    id: 'form-fields',
    title: 'Form Fields',
    content: (
      <ul>
        <li>
          Required: full name, <strong>email</strong>, <strong>password (for auth)</strong>, and at least one preferred sport.
        </li>
        <li>
          Optional extras: skill level, interests, photo, location / campus, host bio, event history snippet (auto-generated).
        </li>
        <li>
          Validation: limit bio length, require at least one sport, enforce safe image formats, expose event history + rating if
          user has hosted.
        </li>
      </ul>
    ),
  },
  {
    id: 'supabase',
    title: 'Supabase + API',
    content: (
      <ul>
        <li>
          <code>{'profiles'}</code> table with columns defined in <code>{'src/types/supabase.ts'}</code> (sports as string
          array, skill level enum), plus derived views for event history + host ratings.
        </li>
        <li>
          Use <code>{'api.auth.signUp'}</code> + <code>{'api.profiles.getProfile/updateProfile'}</code> helpers for CRUD
          operations.
        </li>
        <li>On save, refresh cached profile + show confirmation toast, and re-fetch ratings + past events.</li>
      </ul>
    ),
  },
  {
    id: 'acceptance',
    title: 'Acceptance Criteria',
    content: (
      <ul>
        <li>Profile persists to Supabase instantly and reloads on app refresh.</li>
        <li>Users can edit and save multiple times without duplication.</li>
        <li>Displaying profile info on event cards pulls the latest data.</li>
      </ul>
    ),
  },
]

export const ProfileManagePage = () => (
  <FeaturePage
    title="Profile Creation"
    subtitle="Centralized athlete identity powers search, trust, and host discovery."
    sections={sections}
  />
)
