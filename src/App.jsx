import { Routes, Route } from 'react-router-dom'
import useAppStore from './store/useAppStore'
import AppLayout from './components/layout/AppLayout'
import RoleSelect from './pages/RoleSelect'
import Dashboard from './pages/Dashboard'
import LiveMapPage from './pages/LiveMapPage'
import LiveDetection from './pages/LiveDetection'
import DamageAnalytics from './pages/DamageAnalytics'
import RepairPriority from './pages/RepairPriority'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

export default function App() {
  const { userRole } = useAppStore()

  // No role selected → show role selection screen
  if (!userRole) {
    return <RoleSelect />
  }

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {userRole === 'admin' ? (
          <>
            <Route index element={<Dashboard />} />
            <Route path="live-map" element={<LiveMapPage />} />
            <Route path="analytics" element={<DamageAnalytics />} />
            <Route path="repair-queue" element={<RepairPriority />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </>
        ) : (
          <>
            <Route index element={<LiveDetection />} />
            <Route path="settings" element={<Settings />} />
          </>
        )}
      </Route>
    </Routes>
  )
}
