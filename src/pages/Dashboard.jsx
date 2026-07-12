import KpiGrid from '../components/dashboard/KpiGrid'
import DamageDistChart from '../components/dashboard/DamageDistChart'
import DamageTrendChart from '../components/dashboard/DamageTrendChart'
import RepairsBarChart from '../components/dashboard/RepairsBarChart'
import SeverityChart from '../components/dashboard/SeverityChart'
import LatestDetections from '../components/dashboard/LatestDetections'

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <KpiGrid />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DamageDistChart />
        <DamageTrendChart />
        <RepairsBarChart />
        <SeverityChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LatestDetections />
        {/* Mini Repair Queue Preview */}
        <div className="bg-slate-950 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-4">Top Priority Repairs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                  <th className="text-left pb-3 font-medium">Road</th>
                  <th className="text-left pb-3 font-medium">Type</th>
                  <th className="text-right pb-3 font-medium">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {[
                  { road: 'Station Road', type: 'Pothole', score: 98, color: '#EF4444' },
                  { road: 'KPHB Colony', type: 'Pothole', score: 97, color: '#EF4444' },
                  { road: 'Uppal Cross', type: 'Pothole', score: 96, color: '#EF4444' },
                  { road: 'Kothapet Rd', type: 'Pothole', score: 95, color: '#EF4444' },
                  { road: 'Rd No. 10', type: 'Pothole', score: 94, color: '#EF4444' },
                ].map((row, i) => (
                  <tr key={i} className="text-zinc-300 hover:bg-zinc-900/50 transition-colors">
                    <td className="py-2.5">{row.road}</td>
                    <td className="py-2.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
                        {row.type}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="text-xs font-semibold text-red-400">{row.score}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
