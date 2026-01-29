import { useState } from 'react'
import InspectionDetail from './InspectionDetail'

export default function InspectionItem({ inspection }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const statusConfig = {
    pass: { 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-700',
      label: 'Pass' 
    },
    fail: { 
      bg: 'bg-red-50', 
      text: 'text-red-700',
      label: 'Fail' 
    },
    open: { 
      bg: 'bg-amber-50', 
      text: 'text-amber-700',
      label: 'Open' 
    },
  }

  const status = statusConfig[inspection.status] || statusConfig.open

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white border border-interface-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Status Badge */}
          <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${status.bg} ${status.text}`}>
            {status.label}
          </span>
          
          {/* Type */}
          <div className="min-w-0 flex-1">
            <h3 className="text-interface-text font-medium text-sm truncate">{inspection.type}</h3>
            <p className="text-interface-text-muted text-xs truncate">{inspection.id}</p>
          </div>
          
          {/* Location */}
          <div className="hidden sm:flex items-center gap-1.5 text-interface-text-secondary text-sm min-w-[130px]">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{inspection.location}</span>
          </div>
          
          {/* Date */}
          <div className="hidden md:block text-interface-text-secondary text-sm min-w-[100px]">
            {formatDate(inspection.date)}
          </div>
          
          {/* Findings Count */}
          {inspection.findings && inspection.findings.length > 0 && (
            <div className="hidden lg:flex items-center gap-1.5 text-interface-text-muted text-xs">
              <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                {inspection.findings.length} finding{inspection.findings.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
        
        {/* Expand Icon */}
        <svg 
          className={`w-5 h-5 text-gray-400 ml-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Expanded Detail */}
      {isExpanded && (
        <InspectionDetail inspection={inspection} />
      )}
    </div>
  )
}
