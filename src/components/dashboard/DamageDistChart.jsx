import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { damageDistribution } from '../../data/statistics'
import { formatNumber } from '../../utils/formatters'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 border border-zinc-800 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-xs text-zinc-400">{payload[0].name}</p>
        <p className="text-sm font-semibold text-zinc-100">{formatNumber(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function DamageDistChart() {
  const total = damageDistribution.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="bg-slate-950 border border-zinc-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-zinc-200 mb-4">Damage Distribution</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={damageDistribution}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {damageDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-zinc-100">{formatNumber(total)}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Total</span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {damageDistribution.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-zinc-400">{item.name}</span>
              </div>
              <span className="text-xs font-semibold text-zinc-200 tabular-nums">
                {formatNumber(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
