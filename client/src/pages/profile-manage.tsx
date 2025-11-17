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
      </ul>
    ),
  },
  {
    id: 'form-fields',
    title: 'Form Fields',
    content: (
      <ul>
        <li>Full name, preferred sports (multi-select), skill level, short bio, avatar upload.</li>
        <li>Optional extras: home campus / neighborhood for future matching.</li>
        <li>Validation: limit bio length, require at least one sport, enforce safe image formats.</li>
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
          array, skill level enum).
        </li>
        <li>
          Use <code>{'api.auth.signUp'}</code> + <code>{'api.profiles.getProfile/updateProfile'}</code> helpers for CRUD
          operations.
        </li>
        <li>On save, refresh cached profile + show confirmation toast.</li>
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
