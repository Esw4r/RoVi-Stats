// Road metadata for health scores and damage progression tracking
const roads = [
  {
    id: 'ROAD-001',
    name: 'Secunderabad Station Road',
    district: 'Secunderabad',
    length: 4.2,
    healthScore: 28,
    progression: {
      stages: [
        { type: 'hairline', firstDetected: '2025-11-15', lastDetected: '2026-01-20' },
        { type: 'alligator', firstDetected: '2026-02-10', lastDetected: '2026-04-18' },
        { type: 'pothole', firstDetected: '2026-05-05', lastDetected: '2026-06-28' },
      ],
      daysHairlineToAlligator: 87,
      daysAlligatorToPothole: 84,
      currentStage: 'pothole',
    },
  },
  {
    id: 'ROAD-002',
    name: 'Kukatpally Housing Board',
    district: 'Kukatpally',
    length: 3.8,
    healthScore: 22,
    progression: {
      stages: [
        { type: 'hairline', firstDetected: '2025-10-01', lastDetected: '2025-12-15' },
        { type: 'alligator', firstDetected: '2026-01-05', lastDetected: '2026-03-20' },
        { type: 'pothole', firstDetected: '2026-04-10', lastDetected: '2026-07-01' },
      ],
      daysHairlineToAlligator: 96,
      daysAlligatorToPothole: 95,
      currentStage: 'pothole',
    },
  },
  {
    id: 'ROAD-003',
    name: 'Jubilee Hills Road No. 36',
    district: 'Jubilee Hills',
    length: 2.5,
    healthScore: 78,
    progression: {
      stages: [
        { type: 'hairline', firstDetected: '2026-04-10', lastDetected: '2026-06-29' },
      ],
      daysHairlineToAlligator: null,
      daysAlligatorToPothole: null,
      currentStage: 'hairline',
    },
  },
  {
    id: 'ROAD-004',
    name: 'Madhapur Hi-Tech City Road',
    district: 'Madhapur',
    length: 5.1,
    healthScore: 55,
    progression: {
      stages: [
        { type: 'hairline', firstDetected: '2025-12-20', lastDetected: '2026-02-28' },
        { type: 'alligator', firstDetected: '2026-03-15', lastDetected: '2026-06-25' },
      ],
      daysHairlineToAlligator: 85,
      daysAlligatorToPothole: null,
      currentStage: 'alligator',
    },
  },
]

export default roads
