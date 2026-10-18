import { create } from 'zustand'

const useAppStore = create((set) => ({
  // ── User Role ──
  userRole: null, // 'admin' | 'user' | null (null = not selected yet)
  setUserRole: (role) => set({ userRole: role }),
  logout: () => set({ userRole: null }),

  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // Global filters
  filters: {
    district: '',
    severity: '',
    damageType: '',
    status: '',
    dateRange: { start: null, end: null },
    search: '',
  },
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),
  resetFilters: () =>
    set({
      filters: {
        district: '',
        severity: '',
        damageType: '',
        status: '',
        dateRange: { start: null, end: null },
        search: '',
      },
    }),

  // Map state
  selectedDetection: null,
  setSelectedDetection: (detection) => set({ selectedDetection: detection }),

  // Map filter toggles
  mapVisibility: {
    hairline: true,
    alligator: true,
    pothole: true,
  },
  toggleMapVisibility: (type) =>
    set((s) => ({
      mapVisibility: {
        ...s.mapVisibility,
        [type]: !s.mapVisibility[type],
      },
    })),
}))

export default useAppStore
