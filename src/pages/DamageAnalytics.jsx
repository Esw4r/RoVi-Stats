import DamageHeatmap from '../components/analytics/DamageHeatmap'
import CostComparison from '../components/analytics/CostComparison'
import RoadHealthGauge from '../components/analytics/RoadHealthGauge'
import ProgressionTimeline from '../components/analytics/ProgressionTimeline'

export default function DamageAnalytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DamageHeatmap />
        <CostComparison />
      </div>

      {/* Health Gauges */}
      <RoadHealthGauge />

      {/* Progression Timeline */}
      <ProgressionTimeline />
    </div>
  )
}
