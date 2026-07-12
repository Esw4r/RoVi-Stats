import {
  ScanLine, Minus, Grid3x3, Circle,
  AlertTriangle, CheckCircle, TrendingUp, TrendingDown
} from 'lucide-react'
import { formatNumber } from '../../utils/formatters'

const iconMap = {
  ScanLine, Minus, Grid3x3, Circle, AlertTriangle, CheckCircle,
}

const accentColors = {
  'total-detections': 'text-blue-400',
  'hairline-cracks': 'text-green-400',
  'alligator-cracks': 'text-amber-400',
  'potholes': 'text-red-400',
  'high-priority': 'text-orange-400',
  'repairs-done': 'text-emerald-400',
}

export default function KpiCard({ id, label, value, trend, trendUp, icon }) {
  const Icon = iconMap[icon] || Circle
  const colorClass = accentColors[id] || 'text-zinc-400'

  return (
    <div className="bg-slate-950 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-zinc-900 ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          trendUp
            ? 'text-green-400 bg-green-500/10'
            : 'text-red-400 bg-red-500/10'
        }`}>
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}%
        </div>
      </div>
      <p className="text-2xl font-bold text-zinc-100 mb-1 tabular-nums">
        {formatNumber(value)}
      </p>
      <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
        {label}
      </p>
    </div>
  )
}
