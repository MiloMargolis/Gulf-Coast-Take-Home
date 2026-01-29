export default function InspectionDetail({ inspection }) {
  const severityConfig = {
    critical: { 
      bg: 'bg-red-50', 
      text: 'text-red-700', 
      border: 'border-red-200' 
    },
    high: { 
      bg: 'bg-orange-50', 
      text: 'text-orange-700', 
      border: 'border-orange-200' 
    },
    medium: { 
      bg: 'bg-amber-50', 
      text: 'text-amber-700', 
      border: 'border-amber-200' 
    },
    low: { 
      bg: 'bg-blue-50', 
      text: 'text-blue-700', 
      border: 'border-blue-200' 
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
    <div className="border-t border-interface-border px-5 py-5 bg-interface-bg/50">
      {/* Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div>
          <span className="text-xs text-interface-text-muted uppercase tracking-wider font-medium">Inspector</span>
          <p className="text-interface-text mt-1">{inspection.inspector}</p>
        </div>
        <div>
          <span className="text-xs text-interface-text-muted uppercase tracking-wider font-medium">Date</span>
          <p className="text-interface-text mt-1">{formatDate(inspection.date)}</p>
        </div>
        <div>
          <span className="text-xs text-interface-text-muted uppercase tracking-wider font-medium">Location</span>
          <p className="text-interface-text mt-1">{inspection.location}</p>
        </div>
        <div>
          <span className="text-xs text-interface-text-muted uppercase tracking-wider font-medium">ID</span>
          <p className="text-interface-text mt-1 font-mono text-sm">{inspection.id}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <span className="text-xs text-interface-text-muted uppercase tracking-wider font-medium">Summary</span>
        <p className="text-interface-text mt-2">{inspection.summary}</p>
      </div>

      {/* Findings */}
      {inspection.findings && inspection.findings.length > 0 ? (
        <div>
          <span className="text-xs text-interface-text-muted uppercase tracking-wider font-medium">Findings</span>
          <div className="mt-3 space-y-3">
            {inspection.findings.map((finding, index) => {
              const severity = severityConfig[finding.severity] || severityConfig.medium
              return (
                <div 
                  key={index}
                  className="bg-white border border-interface-border rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded border capitalize ${severity.bg} ${severity.text} ${severity.border}`}>
                          {finding.severity}
                        </span>
                        {finding.osha_ref && (
                          <span className="text-xs text-interface-text-muted font-mono bg-interface-bg px-2 py-0.5 rounded">
                            OSHA {finding.osha_ref}
                          </span>
                        )}
                      </div>
                      <p className="text-interface-text">{finding.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-emerald-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">No findings recorded</span>
        </div>
      )}
    </div>
  )
}
