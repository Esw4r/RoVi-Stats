import { DAMAGE_TYPES } from '../../utils/constants'
import { formatDate } from '../../utils/formatters'
import roads from '../../data/roads'

const stageOrder = ['hairline', 'alligator', 'pothole']

export default function ProgressionTimeline() {
  return (
    <div className="bg-slate-950 border border-zinc-800 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-zinc-200 mb-1">Damage Progression</h3>
      <p className="text-xs text-zinc-500 mb-5">Track how road damage evolves over time</p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {roads.map((road) => (
          <div key={road.id} className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800/50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-sm font-medium text-zinc-200">{road.name}</h4>
                <p className="text-xs text-zinc-500">{road.district} · {road.length} km</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: DAMAGE_TYPES[road.progression.currentStage].color }}
                />
                <span className="text-xs text-zinc-400">
                  {DAMAGE_TYPES[road.progression.currentStage].label}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-4">
              {stageOrder.map((stage, i) => {
                const stageData = road.progression.stages.find((s) => s.type === stage)
                const isActive = !!stageData
                const isCurrent = road.progression.currentStage === stage
                const dt = DAMAGE_TYPES[stage]
                const isLast = i === stageOrder.length - 1

                return (
                  <div key={stage} className="relative pb-5 last:pb-0">
                    {/* Vertical Line */}
                    {!isLast && (
                      <div
                        className="absolute left-0 top-3 w-0.5 h-full"
                        style={{
                          background: isActive
                            ? `linear-gradient(to bottom, ${dt.color}, ${DAMAGE_TYPES[stageOrder[i + 1]]?.color || dt.color})`
                            : '#27272a',
                        }}
                      />
                    )}

                    {/* Node */}
                    <div className="flex items-start gap-3">
                      <div
                        className="relative -left-[7px] w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-0.5"
                        style={{
                          borderColor: isActive ? dt.color : '#3f3f46',
                          backgroundColor: isActive ? dt.color : 'transparent',
                          boxShadow: isCurrent ? `0 0 8px ${dt.color}60` : 'none',
                        }}
                      />
                      <div className="flex-1">
                        <p className={`text-xs font-medium ${isActive ? 'text-zinc-200' : 'text-zinc-600'}`}>
                          {dt.label}
                        </p>
                        {stageData ? (
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[10px] text-zinc-500">
                              {formatDate(stageData.firstDetected)} → {formatDate(stageData.lastDetected)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-600">Not detected</span>
                        )}
                        {/* Days between */}
                        {i === 1 && road.progression.daysHairlineToAlligator && (
                          <span className="inline-block mt-1 text-[10px] text-amber-400/70 bg-amber-500/10 px-2 py-0.5 rounded-full">
                            {road.progression.daysHairlineToAlligator} days from hairline
                          </span>
                        )}
                        {i === 2 && road.progression.daysAlligatorToPothole && (
                          <span className="inline-block mt-1 text-[10px] text-red-400/70 bg-red-500/10 px-2 py-0.5 rounded-full">
                            {road.progression.daysAlligatorToPothole} days from alligator
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
