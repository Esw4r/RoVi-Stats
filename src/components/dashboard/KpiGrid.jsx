import KpiCard from './KpiCard'
import { kpiData } from '../../data/statistics'

export default function KpiGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpiData.map((kpi) => (
        <KpiCard key={kpi.id} {...kpi} />
      ))}
    </div>
  )
}
