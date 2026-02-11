import { useState } from 'react'
import InspectionItem from './InspectionItem'

export default function PlatformTimeline({ inspections, onSearchOsha }) {
  const [expandedPlatform, setExpandedPlatform] = useState(null)

  // Group by location
  const grouped = inspections.reduce((acc, inspection) => {
    const loc = inspection.location
    if (!acc[loc]) acc[loc] = []
    acc[loc].push(inspection)
    return acc
  }, {})

  // Sort locations by most recent inspection date
  const sortedLocations = Object.entries(grouped)
    .map(([location, items]) => ({
      location,
      inspections: items.sort((a, b) => new Date(b.date) - new Date(a.date)),
      latestDate: items.reduce((max, i) => {
        const d = new Date(i.date)
        return d > max ? d : max
      }, new Date(0)),
    }))
    .sort((a, b) => b.latestDate - a.latestDate)

  const getStatusSummary = (items) => {
    const counts = { fail: 0, open: 0, pass_with_conditions: 0, pass: 0 }
    items.forEach(i => { if (counts[i.status] !== undefined) counts[i.status]++ })
    return counts
  }

  return (
    <div className="space-y-3">
      {sortedLocations.map(({ location, inspections: items }) => {
        const isExpanded = expandedPlatform === location
        const counts = getStatusSummary(items)
        const hasIssues = counts.fail > 0 || counts.open > 0

        return (
          <div key={location} className="bg-white border border-interface-border rounded-lg overflow-hidden">
            {/* Platform Header */}
            <button
              onClick={() => setExpandedPlatform(isExpanded ? null : location)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  hasIssues ? 'bg-red-500' : 'bg-emerald-500'
                }`} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-interface-text font-medium text-sm">{location}</h3>
                  <p className="text-interface-text-muted text-xs mt-0.5">
                    {items.length} inspection{items.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Status pills */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {counts.fail > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-50 text-red-700">
                      {counts.fail} failed
                    </span>
                  )}
                  {counts.open > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-amber-50 text-amber-700">
                      {counts.open} open
                    </span>
                  )}
                  {counts.pass_with_conditions > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-teal-50 text-teal-700">
                      {counts.pass_with_conditions} conditional
                    </span>
                  )}
                  <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600">
                    {counts.pass} passed
                  </span>
                </div>
              </div>

              <svg
                className={`w-5 h-5 text-gray-400 ml-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Timeline of inspections */}
            {isExpanded && (
              <div className="border-t border-interface-border px-5 py-4">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[7px] top-3 bottom-3 w-px bg-gray-200" />
                  
                  <div className="space-y-3">
                    {items.map((inspection) => {
                      const [year, month, day] = inspection.date.split('-').map(Number)
                      const date = new Date(year, month - 1, day)
                      const dateStr = date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })

                      return (
                        <div key={inspection.id} className="relative pl-7">
                          {/* Timeline dot */}
                          <div className={`absolute left-0 top-2 w-[15px] h-[15px] rounded-full border-2 bg-white ${
                            inspection.status === 'fail' ? 'border-red-400' :
                            inspection.status === 'open' ? 'border-amber-400' :
                            inspection.status === 'pass_with_conditions' ? 'border-teal-400' :
                            'border-emerald-400'
                          }`} />
                          
                          <div className="text-xs text-interface-text-muted mb-1">{dateStr}</div>
                          <InspectionItem inspection={inspection} onSearchOsha={onSearchOsha} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
