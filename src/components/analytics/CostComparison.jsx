import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { costComparison } from '../../data/statistics'
import { formatCurrency } from '../../utils/formatters'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 border border-zinc-800 rounded-lg px-3 py-2.5 shadow-xl">
        <p className="text-xs font-medium text-zinc-300 mb-1.5">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-zinc-400">{entry.name}:</span>
            <span className="text-zinc-200 font-medium">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function CostComparison() {
  const savingsTotal = costComparison.reduce(
    (sum, d) => sum + (d.reactive - d.preventive), 0
  )

  return (
    <div className="bg-slate-950 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">Cost Comparison</h3>
          <p className="text-xs text-zinc-500">Reactive vs preventive repair costs</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">Potential Savings</p>
          <p className="text-sm font-bold text-green-400">{formatCurrency(savingsTotal)}</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={costComparison} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="road" tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#71717a' }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }}
          />
          <Bar dataKey="reactive" name="Reactive" fill="#EF4444" radius={[3, 3, 0, 0]} />
          <Bar dataKey="preventive" name="Preventive" fill="#22C55E" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
