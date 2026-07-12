import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import repairQueueData from '../../data/repairQueue'
import { DAMAGE_TYPES, SEVERITY_LEVELS, STATUS_OPTIONS } from '../../utils/constants'
import { formatCurrency } from '../../utils/formatters'

export default function RepairTable({ filters }) {
  const [sorting, setSorting] = useState([{ id: 'priorityScore', desc: true }])

  const data = useMemo(() => {
    let filtered = [...repairQueueData]
    if (filters.district) filtered = filtered.filter((r) => r.district === filters.district)
    if (filters.severity) filtered = filtered.filter((r) => r.severity === filters.severity)
    if (filters.status) filtered = filtered.filter((r) => r.status === filters.status)
    if (filters.search) {
      const s = filters.search.toLowerCase()
      filtered = filtered.filter(
        (r) => r.road.toLowerCase().includes(s) || r.district.toLowerCase().includes(s)
      )
    }
    return filtered
  }, [filters])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'road',
        header: 'Road',
        cell: ({ getValue }) => (
          <span className="text-zinc-200 font-medium">{getValue()}</span>
        ),
        size: 200,
      },
      {
        accessorKey: 'district',
        header: 'District',
        cell: ({ getValue }) => (
          <span className="text-zinc-400">{getValue()}</span>
        ),
      },
      {
        accessorKey: 'damageType',
        header: 'Type',
        cell: ({ getValue }) => {
          const dt = DAMAGE_TYPES[getValue()]
          return (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${dt.textClass}`}
              style={{ backgroundColor: `${dt.color}15` }}>
              {dt.label}
            </span>
          )
        },
      },
      {
        accessorKey: 'severity',
        header: 'Severity',
        cell: ({ getValue }) => {
          const sev = SEVERITY_LEVELS[getValue()]
          return (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sev.bgClass} ${sev.textClass}`}>
              {sev.label}
            </span>
          )
        },
      },
      {
        accessorKey: 'priorityScore',
        header: 'Priority',
        cell: ({ getValue }) => {
          const score = getValue()
          const color = score >= 80 ? '#EF4444' : score >= 50 ? '#F59E0B' : '#22C55E'
          return (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${score}%`, backgroundColor: color }}
                />
              </div>
              <span className="text-xs font-semibold text-zinc-200 tabular-nums w-6">{score}</span>
            </div>
          )
        },
      },
      {
        accessorKey: 'frequency',
        header: 'Freq.',
        cell: ({ getValue }) => (
          <span className="text-zinc-300 text-xs tabular-nums">{getValue()}</span>
        ),
      },
      {
        accessorKey: 'estimatedCost',
        header: 'Est. Cost',
        cell: ({ getValue }) => (
          <span className="text-zinc-300 text-xs font-medium tabular-nums">
            {formatCurrency(getValue())}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const st = STATUS_OPTIONS[getValue()]
          return (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.bgClass} ${st.textClass}`}>
              {st.label}
            </span>
          )
        },
      },
      {
        id: 'assign',
        header: '',
        cell: ({ row }) => (
          <button
            onClick={() => {
              toast.success(`Assigned team to ${row.original.road}`)
            }}
            className="p-1.5 rounded-md text-zinc-500 hover:text-accent hover:bg-zinc-800 transition-colors"
            title="Assign Team"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        ),
        size: 50,
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-zinc-800">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-wider font-medium cursor-pointer select-none hover:text-zinc-300 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <ArrowUpDown className="w-3 h-3 opacity-40" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${
                  i % 2 === 0 ? 'bg-transparent' : 'bg-zinc-900/20'
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
        <span className="text-xs text-zinc-500">
          Showing {table.getRowModel().rows.length} of {data.length} entries
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-zinc-400 tabular-nums">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
