import { roadHealthScores } from '../../data/statistics'

function GaugeArc({ score, size = 100 }) {
  const radius = (size - 10) / 2
  const cx = size / 2
  const cy = size / 2 + 5
  const startAngle = Math.PI
  const endAngle = 0
  const scoreAngle = startAngle - (score / 100) * Math.PI

  const bgPath = describeArc(cx, cy, radius, endAngle, startAngle)
  const valuePath = describeArc(cx, cy, radius, scoreAngle, startAngle)

  const color = score >= 60 ? '#22C55E' : score >= 30 ? '#F59E0B' : '#EF4444'

  return (
    <svg width={size} height={size / 2 + 15} viewBox={`0 0 ${size} ${size / 2 + 15}`}>
      <path d={bgPath} fill="none" stroke="#27272a" strokeWidth={8} strokeLinecap="round" />
      <path d={valuePath} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}60)` }} />
      <text x={cx} y={cy - 5} textAnchor="middle" className="fill-zinc-100 text-lg font-bold" fontSize="20">
        {score}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" className="fill-zinc-500 uppercase" fontSize="8" letterSpacing="1.5">
        Health
      </text>
    </svg>
  )
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy - r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy - r * Math.sin(endAngle)
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 0 ${x2} ${y2}`
}

export default function RoadHealthGauge() {
  return (
    <div className="bg-slate-950 border border-zinc-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-zinc-200 mb-1">Road Health Scores</h3>
      <p className="text-xs text-zinc-500 mb-4">0–100 scale based on damage density and severity</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {roadHealthScores.map((road) => (
          <div key={road.road} className="flex flex-col items-center p-3 rounded-lg bg-zinc-900/50">
            <GaugeArc score={road.score} />
            <p className="text-xs text-zinc-300 font-medium text-center mt-1 leading-tight">
              {road.road.length > 22 ? road.road.slice(0, 22) + '…' : road.road}
            </p>
            <p className="text-[10px] text-zinc-500">{road.district}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
