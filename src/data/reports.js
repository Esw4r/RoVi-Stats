// Report definitions for the Reports page
const reports = [
  {
    id: 'RPT-001',
    title: 'Monthly Damage Summary',
    description: 'Comprehensive overview of all road damage detections for the current month, including severity distribution and trend analysis.',
    generatedAt: '2026-07-01T00:00:00Z',
    dateRange: { start: '2026-06-01', end: '2026-06-30' },
    type: 'summary',
    stats: { totalDetections: 478, criticalIssues: 34, repairedRoads: 89 },
  },
  {
    id: 'RPT-002',
    title: 'Most Damaged Roads',
    description: 'Ranked list of roads with the highest damage frequency and severity scores. Includes district-wise breakdown.',
    generatedAt: '2026-07-01T00:00:00Z',
    dateRange: { start: '2026-01-01', end: '2026-06-30' },
    type: 'roads',
    stats: { totalRoads: 156, criticalRoads: 38, averageScore: 62 },
  },
  {
    id: 'RPT-003',
    title: 'Cost Estimation Report',
    description: 'Estimated repair costs for all pending damage sites. Compares reactive vs. preventive maintenance costs.',
    generatedAt: '2026-07-01T00:00:00Z',
    dateRange: { start: '2026-06-01', end: '2026-06-30' },
    type: 'cost',
    stats: { totalEstimate: 4850000, savingsIfPreventive: 2100000, pendingRepairs: 42 },
  },
  {
    id: 'RPT-004',
    title: 'Severity Breakdown',
    description: 'Detailed severity analysis across all detection categories — low, medium, high, and critical.',
    generatedAt: '2026-07-01T00:00:00Z',
    dateRange: { start: '2026-06-01', end: '2026-06-30' },
    type: 'severity',
    stats: { low: 820, medium: 945, high: 748, critical: 334 },
  },
  {
    id: 'RPT-005',
    title: 'Repair History Log',
    description: 'Complete log of all repair activities — completed, in-progress, and deferred — with assigned teams and timestamps.',
    generatedAt: '2026-07-01T00:00:00Z',
    dateRange: { start: '2026-01-01', end: '2026-06-30' },
    type: 'history',
    stats: { completed: 1156, inProgress: 28, deferred: 15 },
  },
  {
    id: 'RPT-006',
    title: 'District-wise Analysis',
    description: 'Damage detection and repair statistics grouped by district. Highlights under-served areas requiring attention.',
    generatedAt: '2026-07-01T00:00:00Z',
    dateRange: { start: '2026-06-01', end: '2026-06-30' },
    type: 'district',
    stats: { districts: 12, worstDistrict: 'Secunderabad', bestDistrict: 'LB Nagar' },
  },
]

export default reports
