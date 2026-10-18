import { Radio, Shield, Eye } from 'lucide-react'
import useAppStore from '../store/useAppStore'

export default function RoleSelect() {
  const { setUserRole } = useAppStore()

  return (
    <div className="h-screen w-screen bg-zinc-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #8B1E3F 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 animate-fade-in">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 mb-5 shadow-glow-accent">
            <Radio className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold tracking-wider text-zinc-100 mb-2">
            GOPHER <span className="text-accent">AI</span>
          </h1>
          <p className="text-sm text-zinc-500 tracking-widest uppercase">
            Road Damage Intelligence
          </p>
        </div>

        {/* Role Cards */}
        <div className="flex gap-5">
          {/* Admin Card */}
          <button
            onClick={() => setUserRole('admin')}
            className="group relative w-64 bg-slate-950 border border-zinc-800 rounded-xl p-6 text-left transition-all duration-300 hover:border-accent/50 hover:shadow-glow-accent hover:-translate-y-1 focus:outline-none focus:border-accent/50"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-1">Admin</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Full access to dashboard, analytics, live map, repair queue, and reports.
              </p>
              <div className="mt-4 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Full Access</span>
              </div>
            </div>
          </button>

          {/* User Card */}
          <button
            onClick={() => setUserRole('user')}
            className="group relative w-64 bg-slate-950 border border-zinc-800 rounded-xl p-6 text-left transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_12px_3px_rgba(59,130,246,0.3)] hover:-translate-y-1 focus:outline-none focus:border-blue-500/50"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-1">User</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Live pothole detection view with real-time CNN inference and bounding boxes.
              </p>
              <div className="mt-4 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Detection View</span>
              </div>
            </div>
          </button>
        </div>

        {/* Footer hint */}
        <p className="text-center text-[10px] text-zinc-700 mt-8 tracking-wider uppercase">
          Select your role to continue
        </p>
      </div>
    </div>
  )
}
