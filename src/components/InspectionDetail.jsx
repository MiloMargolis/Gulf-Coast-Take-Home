export default function InspectionDetail({ inspection }) {
  const severityConfig = {
    critical: { 
      bg: 'bg-red-50', 
      text: 'text-red-700'
    },
    high: { 
      bg: 'bg-orange-50', 
      text: 'text-orange-700'
    },
    medium: { 
      bg: 'bg-amber-50', 
      text: 'text-amber-700'
    },
    low: { 
      bg: 'bg-blue-50', 
      text: 'text-blue-700'
    },
  }

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="border-t border-interface-border px-5 py-5 bg-gray-50/50">
      {/* Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <div>
          <span className="text-xs text-interface-text-muted uppercase tracking-wide">Inspector</span>
          <p className="text-interface-text text-sm mt-1">{inspection.inspector}</p>
        </div>
        <div>
          <span className="text-xs text-interface-text-muted uppercase tracking-wide">Date</span>
          <p className="text-interface-text text-sm mt-1">{formatDate(inspection.date)}</p>
        </div>
        <div>
          <span className="text-xs text-interface-text-muted uppercase tracking-wide">Location</span>
          <p className="text-interface-text text-sm mt-1">{inspection.location}</p>
        </div>
        <div>
          <span className="text-xs text-interface-text-muted uppercase tracking-wide">ID</span>
          <p className="text-interface-text text-sm mt-1 font-mono">{inspection.id}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-5">
        <span className="text-xs text-interface-text-muted uppercase tracking-wide">Summary</span>
        <p className="text-interface-text text-sm mt-1">{inspection.summary}</p>
      </div>

      {/* Document Completeness Warning */}
      {inspection.completeness && !inspection.completeness.is_complete && (
        <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-amber-700 mb-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-medium">Incomplete Document</span>
          </div>
          <ul className="ml-6 text-sm text-amber-600 list-disc">
            {inspection.completeness.missing_items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Findings */}
      {inspection.findings && inspection.findings.length > 0 ? (
        <div>
          <span className="text-xs text-interface-text-muted uppercase tracking-wide">Findings</span>
          <div className="mt-2 space-y-2">
            {inspection.findings.map((finding, index) => {
              const severity = severityConfig[finding.severity] || severityConfig.medium
              return (
                <div 
                  key={index}
                  className="bg-white border border-interface-border rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${severity.bg} ${severity.text}`}>
                      {finding.severity}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-interface-text text-sm">{finding.description}</p>
                      {finding.osha_ref && (
                        <p className="text-interface-text-muted text-xs mt-1 font-mono">
                          OSHA {finding.osha_ref}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-emerald-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">No findings recorded</span>
        </div>
      )}

      {/* Corrective Actions */}
      {inspection.corrective_actions && inspection.corrective_actions.length > 0 && (
        <div className="mt-5">
          <span className="text-xs text-interface-text-muted uppercase tracking-wide">Corrective Actions</span>
          <div className="mt-2 space-y-2">
            {inspection.corrective_actions.map((action, index) => (
              <div key={index} className="bg-white border border-interface-border rounded-lg p-4 flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-interface-text text-sm">{action.action}</p>
                  {action.deadline && (
                    <p className="text-interface-text-muted text-xs mt-1">
                      Deadline: {action.deadline}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Inspection Due */}
      {inspection.next_inspection_due && (
        <div className="mt-5">
          <span className="text-xs text-interface-text-muted uppercase tracking-wide">Next Inspection Due</span>
          <p className="text-interface-text text-sm mt-1 flex items-center gap-2">
            {formatDate(inspection.next_inspection_due)}
            {new Date(inspection.next_inspection_due) < new Date() && (
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-50 text-red-700">
                Overdue
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
