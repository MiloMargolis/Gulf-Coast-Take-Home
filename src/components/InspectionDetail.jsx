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
    const date = new Date(dateString)
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
    </div>
  )
}
