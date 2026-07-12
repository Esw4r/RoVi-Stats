import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { repairsPerWeek } from '../../data/statistics'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 border border-zinc-800 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="text-sm font-semibold text-zinc-100">{payload[0].value} repairs</p>
      </div>
    )
  }
  return null
}

export default function RepairsBarChart() {
  return (
    <div className="bg-slate-950 border border-zinc-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-zinc-200 mb-4">Repairs per Week</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={repairsPerWeek} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} width={30} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 30, 63, 0.1)' }} />
          <Bar dataKey="repairs" fill="#8B1E3F" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
