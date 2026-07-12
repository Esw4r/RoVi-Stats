// KPI values and chart time-series data
export const kpiData = [
  { id: 'total-detections', label: 'Total Detections', value: 2847, trend: 12.5, trendUp: true, icon: 'ScanLine' },
  { id: 'hairline-cracks', label: 'Hairline Cracks', value: 1234, trend: 8.2, trendUp: true, icon: 'Minus' },
  { id: 'alligator-cracks', label: 'Alligator Cracks', value: 891, trend: 15.1, trendUp: true, icon: 'Grid3x3' },
  { id: 'potholes', label: 'Potholes', value: 722, trend: 3.4, trendUp: false, icon: 'Circle' },
  { id: 'high-priority', label: 'High Priority Roads', value: 38, trend: 5.7, trendUp: true, icon: 'AlertTriangle' },
  { id: 'repairs-done', label: 'Repairs Completed', value: 1156, trend: 22.3, trendUp: true, icon: 'CheckCircle' },
]

export const damageDistribution = [
  { name: 'Hairline Cracks', value: 1234, color: '#22C55E' },
  { name: 'Alligator Cracks', value: 891, color: '#F59E0B' },
  { name: 'Potholes', value: 722, color: '#EF4444' },
]

export const damageTrend = [
  { month: 'Jan', hairline: 180, alligator: 120, pothole: 95 },
  { month: 'Feb', hairline: 210, alligator: 140, pothole: 110 },
  { month: 'Mar', hairline: 195, alligator: 155, pothole: 125 },
  { month: 'Apr', hairline: 230, alligator: 160, pothole: 130 },
  { month: 'May', hairline: 215, alligator: 170, pothole: 140 },
  { month: 'Jun', hairline: 204, alligator: 146, pothole: 122 },
]

export const repairsPerWeek = [
  { week: 'W1', repairs: 28 },
  { week: 'W2', repairs: 35 },
  { week: 'W3', repairs: 22 },
  { week: 'W4', repairs: 42 },
  { week: 'W5', repairs: 38 },
  { week: 'W6', repairs: 31 },
  { week: 'W7', repairs: 45 },
  { week: 'W8', repairs: 40 },
]

export const severityBreakdown = [
  { name: 'Low', value: 820, color: '#22C55E' },
  { name: 'Medium', value: 945, color: '#3B82F6' },
  { name: 'High', value: 748, color: '#F59E0B' },
  { name: 'Critical', value: 334, color: '#EF4444' },
]

export const costComparison = [
  { road: 'Station Rd', reactive: 285000, preventive: 85000 },
  { road: 'KPHB Main', reactive: 320000, preventive: 95000 },
  { road: 'Uppal Cross', reactive: 250000, preventive: 72000 },
  { road: 'Kothapet', reactive: 290000, preventive: 88000 },
  { road: 'Road No.10', reactive: 310000, preventive: 92000 },
  { road: 'Bio Park Rd', reactive: 275000, preventive: 80000 },
]

export const roadHealthScores = [
  { road: 'Secunderabad Station Road', score: 28, district: 'Secunderabad' },
  { road: 'Kukatpally Housing Board', score: 22, district: 'Kukatpally' },
  { road: 'Jubilee Hills Road No. 36', score: 78, district: 'Jubilee Hills' },
  { road: 'Madhapur Hi-Tech City Road', score: 55, district: 'Madhapur' },
  { road: 'Banjara Hills Road No. 12', score: 35, district: 'Banjara Hills' },
  { road: 'LB Nagar Ring Road', score: 82, district: 'LB Nagar' },
]
