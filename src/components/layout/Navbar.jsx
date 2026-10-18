import { useLocation } from 'react-router-dom'
import { Search, Bell, Calendar, User, Shield, Eye } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const adminPageTitles = {
  '/': 'Dashboard',
  '/live-map': 'Live Map',
  '/analytics': 'Damage Analytics',
  '/repair-queue': 'Repair Priority Queue',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

const userPageTitles = {
  '/': 'Live Detection',
  '/settings': 'Settings',
}

export default function Navbar() {
  const location = useLocation()
  const { filters, setFilter, userRole } = useAppStore()
  const pageTitles = userRole === 'admin' ? adminPageTitles : userPageTitles
  const title = pageTitles[location.pathname] || 'Dashboard'

  return (
    <header className="sticky top-0 z-20 h-16 bg-slate-950 border-b border-zinc-800 flex items-center justify-between px-6">
      {/* Page Title */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
        <p className="text-xs text-zinc-500">
          {userRole === 'admin'
            ? 'Real-time road damage monitoring'
            : 'CNN-powered pothole detection'}
        </p>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search roads, detections..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
          />
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Date Filter (admin only) */}
        {userRole === 'admin' && (
          <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="hidden lg:inline">Last 30 days</span>
          </button>
        )}

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-950" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-zinc-800" />

        {/* User */}
        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            userRole === 'admin'
              ? 'bg-accent/20 border border-accent/40'
              : 'bg-blue-500/20 border border-blue-500/40'
          }`}>
            {userRole === 'admin' ? (
              <Shield className="w-4 h-4 text-accent" />
            ) : (
              <Eye className="w-4 h-4 text-blue-400" />
            )}
          </div>
          <span className="hidden lg:block text-sm text-zinc-300 font-medium capitalize">
            {userRole}
          </span>
        </button>
      </div>
    </header>
  )
}
