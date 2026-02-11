import { useState, useEffect } from 'react'
import InspectionList from './components/InspectionList'
import PlatformTimeline from './components/PlatformTimeline'
import SearchBar from './components/SearchBar'
import FilterToggle from './components/FilterToggle'
import UploadButton from './components/UploadButton'
import ReviewModal from './components/ReviewModal'
import { exportToCSV } from './utils/exportInspections'
import inspectionData from '../data/gulf_coast_inspections.json'

function App() {
  const [inspections, setInspections] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pendingInspection, setPendingInspection] = useState(null)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'platform'

  useEffect(() => {
    const saved = localStorage.getItem('uploadedInspections')
    const uploaded = saved ? JSON.parse(saved) : []
    setInspections([...uploaded, ...inspectionData.inspections])
  }, [])

  const persistUploaded = (allInspections) => {
    // Only persist inspections that aren't in the base JSON data
    const baseIds = new Set(inspectionData.inspections.map(i => i.id))
    const uploaded = allInspections.filter(i => !baseIds.has(i.id))
    localStorage.setItem('uploadedInspections', JSON.stringify(uploaded))
  }

  const handleExtracted = (extracted) => {
    setPendingInspection(extracted)
  }

  const handleConfirmInspection = (reviewed) => {
    const updated = [reviewed, ...inspections]
    setInspections(updated)
    persistUploaded(updated)
    setPendingInspection(null)
  }

  const handleCancelReview = () => {
    setPendingInspection(null)
  }

  const filteredInspections = inspections
    .filter(inspection => {
      if (statusFilter !== 'all' && inspection.status !== statusFilter) {
        return false
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesBasic = (
          inspection.location.toLowerCase().includes(query) ||
          inspection.type.toLowerCase().includes(query)
        )
        const matchesOsha = inspection.findings?.some(f => 
          f.osha_ref && f.osha_ref.toLowerCase().includes(query)
        )
        return matchesBasic || matchesOsha
      }
      return true
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="min-h-screen bg-interface-bg">
      {/* Header */}
      <header className="bg-white border-b border-interface-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-interface-text">
              Interface AI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-interface-text">Inspection Records</h1>
            <p className="text-sm text-interface-text-secondary mt-1">
              View and manage platform inspection documentation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToCSV(filteredInspections)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-interface-text-secondary border border-interface-border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            <UploadButton 
              onUpload={handleExtracted}
              setIsLoading={setIsLoading}
              setError={setError}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <FilterToggle 
            value={statusFilter} 
            onChange={setStatusFilter} 
          />
          <div className="flex bg-white border border-interface-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm transition-colors ${
                viewMode === 'list' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-interface-text-secondary hover:bg-gray-50'
              }`}
              title="List view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('platform')}
              className={`px-3 py-2 text-sm transition-colors border-l border-interface-border ${
                viewMode === 'platform' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-interface-text-secondary hover:bg-gray-50'
              }`}
              title="Platform view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-sm">Error</span>
            </div>
            <p className="mt-1 text-red-600 text-sm">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="animate-spin w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-blue-700 text-sm">Processing document and extracting inspection data...</span>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-interface-text-secondary">
          Showing {filteredInspections.length} of {inspections.length} inspections
          {statusFilter !== 'all' && ` (${statusFilter.replace('_', ' ')})`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>

        {/* Inspection List / Platform View */}
        {viewMode === 'list' ? (
          <InspectionList inspections={filteredInspections} onSearchOsha={setSearchQuery} />
        ) : (
          <PlatformTimeline inspections={filteredInspections} onSearchOsha={setSearchQuery} />
        )}
      </main>

      {/* Review Modal */}
      {pendingInspection && (
        <ReviewModal
          inspection={pendingInspection}
          onConfirm={handleConfirmInspection}
          onCancel={handleCancelReview}
        />
      )}
    </div>
  )
}

export default App
