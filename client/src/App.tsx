import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { AppShell } from '@/components/app-shell'
import { ProtectedRoute } from '@/components/protected-route'
import { IndexRedirect } from '@/pages/index-redirect'
import { AuthPage } from '@/pages/auth'
import { NotFound } from '@/pages/not-found'
import { AppDashboardPage } from '@/pages/app-dashboard'
import { AppMapPage } from '@/pages/app-map'
import { AppFindEventsPage } from '@/pages/app-find-events'
import { AppSearchFiltersPage } from '@/pages/app-search'
import { AppProfilePage } from '@/pages/app-profile'
import { AppNotificationsPage } from '@/pages/app-notifications'
import { AppReportsPage } from '@/pages/app-reports'
import { AppRsvpManagementPage } from '@/pages/app-rsvp-management'
import { AppDeploymentReadinessPage } from '@/pages/app-deployment-readiness'
import { AppCreateEventPage } from '@/pages/app-create-event'
import { EventDetailsPage } from '@/pages/events-detail'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexRedirect />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/app/dashboard" element={<AppDashboardPage />} />
            <Route path="/app/map" element={<AppMapPage />} />
            <Route path="/app/find-events" element={<AppFindEventsPage />} />
            <Route path="/app/search" element={<AppSearchFiltersPage />} />
            <Route path="/app/profile" element={<AppProfilePage />} />
            <Route path="/app/notifications" element={<AppNotificationsPage />} />
            <Route path="/app/reports" element={<AppReportsPage />} />
            <Route path="/app/rsvp-management" element={<AppRsvpManagementPage />} />
            <Route path="/app/deployment-readiness" element={<AppDeploymentReadinessPage />} />
            <Route path="/app/create-event" element={<AppCreateEventPage />} />
            <Route path="/app/events/:eventId" element={<EventDetailsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
