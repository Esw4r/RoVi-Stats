import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import useAppStore from '../../store/useAppStore'

export default function AppLayout() {
  const { sidebarCollapsed } = useAppStore()

  return (
    <div className="flex h-screen bg-zinc-900 overflow-hidden">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[68px]' : 'ml-[240px]'
        }`}
      >
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
