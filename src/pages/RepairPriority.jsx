import { useState } from 'react'
import { Search, Filter, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import Papa from 'papaparse'
import RepairTable from '../components/repair/RepairTable'
import repairQueueData from '../data/repairQueue'
import { DISTRICTS } from '../utils/constants'

export default function RepairPriority() {
  const [filters, setFilters] = useState({
    district: '',
    severity: '',
    status: '',
    search: '',
  })

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const exportCsv = () => {
    const csv = Papa.unparse(repairQueueData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'repair_queue.csv'
    link.click()
    toast.success('CSV exported successfully')
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filter Bar */}
      <div className="bg-slate-950 border border-zinc-800 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search roads..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          {/* District */}
          <select
            value={filters.district}
            onChange={(e) => updateFilter('district', e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Districts</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Severity */}
          <select
            value={filters.severity}
            onChange={(e) => updateFilter('severity', e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="deferred">Deferred</option>
          </select>

          {/* Export */}
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 border border-zinc-800 rounded-xl overflow-hidden">
        <RepairTable filters={filters} />
      </div>
    </div>
  )
}
