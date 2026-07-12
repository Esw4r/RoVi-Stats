import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { severityBreakdown } from '../../data/statistics'
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

export default function SeverityChart() {
  return (
    <div className="bg-slate-950 border border-zinc-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-zinc-200 mb-4">Severity Breakdown</h3>
      <div className="flex items-center gap-6">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={severityBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={70}
                dataKey="value"
                stroke="#18181b"
                strokeWidth={2}
              >
                {severityBreakdown.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2.5">
          {severityBreakdown.map((item) => {
            const total = severityBreakdown.reduce((s, d) => s + d.value, 0)
            const pct = ((item.value / total) * 100).toFixed(0)
            return (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-zinc-400">{item.name}</span>
                  </div>
                  <span className="text-xs text-zinc-300 font-medium">{pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
