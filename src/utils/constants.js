// Severity colors, map config, and damage type metadata
export const DAMAGE_TYPES = {
  hairline: {
    label: 'Hairline Crack',
    color: '#22C55E',
    bgClass: 'bg-green-500',
    textClass: 'text-green-400',
    glowClass: 'marker-glow-green',
    icon: '🟢',
  },
  alligator: {
    label: 'Alligator Crack',
    color: '#F59E0B',
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-400',
    glowClass: 'marker-glow-amber',
    icon: '🟡',
  },
  pothole: {
    label: 'Pothole',
    color: '#EF4444',
    bgClass: 'bg-red-500',
    textClass: 'text-red-400',
    glowClass: 'marker-glow-red',
    icon: '🔴',
  },
}

export const SEVERITY_LEVELS = {
  low: { label: 'Low', color: '#22C55E', bgClass: 'bg-green-500/20', textClass: 'text-green-400' },
  medium: { label: 'Medium', color: '#3B82F6', bgClass: 'bg-blue-500/20', textClass: 'text-blue-400' },
  high: { label: 'High', color: '#F59E0B', bgClass: 'bg-amber-500/20', textClass: 'text-amber-400' },
  critical: { label: 'Critical', color: '#EF4444', bgClass: 'bg-red-500/20', textClass: 'text-red-400' },
}

export const STATUS_OPTIONS = {
  pending: { label: 'Pending', bgClass: 'bg-zinc-500/20', textClass: 'text-zinc-400' },
  in_progress: { label: 'In Progress', bgClass: 'bg-blue-500/20', textClass: 'text-blue-400' },
  completed: { label: 'Completed', bgClass: 'bg-green-500/20', textClass: 'text-green-400' },
  deferred: { label: 'Deferred', bgClass: 'bg-amber-500/20', textClass: 'text-amber-400' },
}

export const MAP_CONFIG = {
  center: [17.385, 78.4867], // Hyderabad
  zoom: 13,
  tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  tileAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
}

export const DISTRICTS = [
  'Secunderabad', 'Jubilee Hills', 'Banjara Hills', 'Madhapur',
  'Kukatpally', 'Ameerpet', 'Begumpet', 'Mehdipatnam',
  'Dilsukhnagar', 'LB Nagar', 'Uppal', 'ECIL',
]
