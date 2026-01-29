export default function InspectionDetail({ inspection }) {
  const severityColors = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
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
    <div className="border-t border-interface-border px-6 py-5 bg-interface-dark/50">
      {/* Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Inspector</span>
          <p className="text-gray-300 mt-1">{inspection.inspector}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Date</span>
          <p className="text-gray-300 mt-1">{formatDate(inspection.date)}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Location</span>
          <p className="text-gray-300 mt-1">{inspection.location}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500 uppercase tracking-wider">ID</span>
          <p className="text-gray-300 mt-1 font-mono text-sm">{inspection.id}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <span className="text-xs text-gray-500 uppercase tracking-wider">Summary</span>
        <p className="text-gray-300 mt-2">{inspection.summary}</p>
      </div>

      {/* Findings */}
      {inspection.findings && inspection.findings.length > 0 ? (
        <div>
          <span className="text-xs text-gray-500 uppercase tracking-wider">Findings</span>
          <div className="mt-3 space-y-3">
            {inspection.findings.map((finding, index) => (
              <div 
                key={index}
                className="bg-interface-card border border-interface-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded border capitalize ${severityColors[finding.severity] || severityColors.medium}`}>
                        {finding.severity}
                      </span>
                      {finding.osha_ref && (
                        <span className="text-xs text-gray-500 font-mono">
                          OSHA {finding.osha_ref}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300">{finding.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-emerald-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">No findings recorded</span>
        </div>
      )}
    </div>
  )
}
