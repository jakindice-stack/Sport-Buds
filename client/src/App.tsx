import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Layout } from '@/components/layout'
import { Home } from '@/pages/home'
import { NotFound } from '@/pages/not-found'
import { CreateEventPage } from '@/pages/events-create'
import { FilterBySportPage } from '@/pages/events-filter'
import { MapDiscoveryPage } from '@/pages/discover-map'
import { RsvpPage } from '@/pages/events-rsvp'
import { HostDashboardPage } from '@/pages/host-dashboard'
import { ProfileManagePage } from '@/pages/profile-manage'
import { ReportsPage } from '@/pages/reports'
import { HostRatingsPage } from '@/pages/ratings'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/create" element={<CreateEventPage />} />
          <Route path="/events/filter" element={<FilterBySportPage />} />
          <Route path="/discover/map" element={<MapDiscoveryPage />} />
          <Route path="/events/rsvp" element={<RsvpPage />} />
          <Route path="/host/dashboard" element={<HostDashboardPage />} />
          <Route path="/profile/manage" element={<ProfileManagePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/ratings" element={<HostRatingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  )
}

export default App
