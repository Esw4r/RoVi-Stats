import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import LiveMapPage from './pages/LiveMapPage'
import DamageAnalytics from './pages/DamageAnalytics'
import RepairPriority from './pages/RepairPriority'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="live-map" element={<LiveMapPage />} />
        <Route path="analytics" element={<DamageAnalytics />} />
        <Route path="repair-queue" element={<RepairPriority />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
