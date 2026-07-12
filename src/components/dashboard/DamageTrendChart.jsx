import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { damageTrend } from '../../data/statistics'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 border border-zinc-800 rounded-lg px-3 py-2.5 shadow-xl">
        <p className="text-xs font-medium text-zinc-300 mb-1.5">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-zinc-400">{entry.name}:</span>
            <span className="text-zinc-200 font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function DamageTrendChart() {
  return (
    <div className="bg-slate-950 border border-zinc-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-zinc-200 mb-4">Damage Trend</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={damageTrend}>
          <defs>
            <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradAmber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} width={35} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="hairline" name="Hairline" stroke="#22C55E" fill="url(#gradGreen)" strokeWidth={2} />
          <Area type="monotone" dataKey="alligator" name="Alligator" stroke="#F59E0B" fill="url(#gradAmber)" strokeWidth={2} />
          <Area type="monotone" dataKey="pothole" name="Pothole" stroke="#EF4444" fill="url(#gradRed)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
