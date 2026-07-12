import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Wrench,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Radio,
} from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/live-map', icon: Map, label: 'Live Map' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/repair-queue', icon: Wrench, label: 'Repair Queue' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-slate-950 border-r border-zinc-800 flex flex-col z-30 transition-all duration-300 ${
        sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'
      }`}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-zinc-800 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
          <Radio className="w-4 h-4 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="animate-fade-in">
            <h1 className="text-sm font-bold tracking-wider text-zinc-100">
              GOPHER <span className="text-accent">AI</span>
            </h1>
            <p className="text-[10px] text-zinc-500 tracking-widest uppercase">
              Road Intelligence
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'bg-slate-800 text-zinc-100'
                  : 'text-zinc-400 hover:bg-slate-800/50 hover:text-zinc-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-r-full" />
                )}
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-accent' : ''}`} />
                {!sidebarCollapsed && (
                  <span className="animate-fade-in">{label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 pb-4 border-t border-zinc-800 pt-4">
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-slate-800/50 transition-all duration-200 w-full"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-[18px] h-[18px] flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-[18px] h-[18px] flex-shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
