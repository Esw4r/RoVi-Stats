import { useState } from 'react'
import { FileText, Download, Eye, Calendar, BarChart3, DollarSign, Shield, Clock, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import Papa from 'papaparse'
import reportsData from '../data/reports'
import repairQueueData from '../data/repairQueue'
import { formatDate, formatCurrency, formatNumber } from '../utils/formatters'

const reportIcons = {
  summary: BarChart3,
  roads: MapPin,
  cost: DollarSign,
  severity: Shield,
  history: Clock,
  district: MapPin,
}

function generatePdf(report) {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(20)
  doc.setTextColor(139, 30, 63)
  doc.text('GOPHER AI', 20, 25)
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text('Road Damage Intelligence Platform', 20, 32)

  // Report Title
  doc.setFontSize(16)
  doc.setTextColor(30)
  doc.text(report.title, 20, 50)

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Generated: ${formatDate(report.generatedAt)}`, 20, 58)
  doc.text(`Period: ${formatDate(report.dateRange.start)} - ${formatDate(report.dateRange.end)}`, 20, 64)

  // Description
  doc.setFontSize(11)
  doc.setTextColor(60)
  const lines = doc.splitTextToSize(report.description, 170)
  doc.text(lines, 20, 78)

  // Stats Table
  const statsRows = Object.entries(report.stats).map(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
    const formatted = typeof value === 'number' && value > 10000 ? formatCurrency(value) : String(value)
    return [label, formatted]
  })

  doc.autoTable({
    startY: 95,
    head: [['Metric', 'Value']],
    body: statsRows,
    theme: 'grid',
    headStyles: { fillColor: [139, 30, 63], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  })

  // Top Repair Queue
  const topRepairs = repairQueueData
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 10)
    .map((r) => [r.road, r.district, r.damageType, String(r.priorityScore), formatCurrency(r.estimatedCost)])

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 15,
    head: [['Road', 'District', 'Type', 'Priority', 'Est. Cost']],
    body: topRepairs,
    theme: 'grid',
    headStyles: { fillColor: [139, 30, 63], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  })

  doc.save(`gopher_ai_${report.type}_report.pdf`)
  toast.success('PDF downloaded successfully')
}

function exportReportCsv(report) {
  const csv = Papa.unparse(repairQueueData)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `gopher_ai_${report.type}_data.csv`
  link.click()
  toast.success('CSV exported successfully')
}

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(null)

  return (
    <div className="animate-fade-in">
      <div className="flex gap-4 h-[calc(100vh-112px)]">
        {/* Report Cards */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {reportsData.map((report) => {
              const Icon = reportIcons[report.type] || FileText
              const isSelected = selectedReport?.id === report.id
              return (
                <div
                  key={report.id}
                  className={`bg-slate-950 border rounded-xl p-5 cursor-pointer transition-all duration-300 hover:border-zinc-600 ${
                    isSelected ? 'border-accent ring-1 ring-accent/20' : 'border-zinc-800'
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-zinc-900">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-zinc-200">{report.title}</h4>
                      <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(report.dateRange.start)} – {formatDate(report.dateRange.end)}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                    {report.description}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Object.entries(report.stats).slice(0, 3).map(([key, value]) => (
                      <span
                        key={key}
                        className="text-[10px] px-2 py-1 rounded-full bg-zinc-900 text-zinc-400 font-medium"
                      >
                        {typeof value === 'number' && value > 10000
                          ? formatCurrency(value)
                          : formatNumber(value)}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        generatePdf(report)
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent text-xs font-medium rounded-lg hover:bg-accent/20 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      PDF
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        exportReportCsv(report)
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs font-medium rounded-lg hover:bg-zinc-700 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      CSV
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Report Preview Panel */}
        <div className="w-[360px] flex-shrink-0 bg-slate-950 border border-zinc-800 rounded-xl p-5 overflow-y-auto hidden xl:block">
          {selectedReport ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-semibold text-zinc-200">Preview</h3>
              </div>

              <div className="bg-white rounded-lg p-4 text-gray-800 text-xs space-y-3">
                {/* Simulated PDF Preview */}
                <div className="border-b pb-2">
                  <p className="text-lg font-bold" style={{ color: '#8B1E3F' }}>GOPHER AI</p>
                  <p className="text-[10px] text-gray-500">Road Damage Intelligence Platform</p>
                </div>
                <h4 className="font-semibold text-sm">{selectedReport.title}</h4>
                <p className="text-[10px] text-gray-500">
                  {formatDate(selectedReport.dateRange.start)} – {formatDate(selectedReport.dateRange.end)}
                </p>
                <p className="text-gray-600 leading-relaxed">{selectedReport.description}</p>

                <div className="border-t pt-2 space-y-1.5">
                  <p className="font-semibold text-[10px] uppercase text-gray-400">Key Metrics</p>
                  {Object.entries(selectedReport.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="font-medium">
                        {typeof value === 'number' && value > 10000
                          ? formatCurrency(value)
                          : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => generatePdf(selectedReport)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileText className="w-10 h-10 text-zinc-700 mb-3" />
              <p className="text-sm text-zinc-500">Select a report to preview</p>
              <p className="text-xs text-zinc-600 mt-1">Click on any report card</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
