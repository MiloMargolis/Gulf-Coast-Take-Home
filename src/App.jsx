import { useState, useEffect } from 'react'
import InspectionList from './components/InspectionList'
import SearchBar from './components/SearchBar'
import FilterToggle from './components/FilterToggle'
import UploadButton from './components/UploadButton'
import inspectionData from '../data/gulf_coast_inspections.json'

function App() {
  const [inspections, setInspections] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showFailedOnly, setShowFailedOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setInspections(inspectionData.inspections)
  }, [])

  const handleNewInspection = (newInspection) => {
    setInspections(prev => [newInspection, ...prev])
  }

  const filteredInspections = inspections
    .filter(inspection => {
      if (showFailedOnly && inspection.status !== 'fail') {
        return false
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          inspection.location.toLowerCase().includes(query) ||
          inspection.type.toLowerCase().includes(query)
        )
      }
      return true
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="min-h-screen bg-interface-dark">
      {/* Header */}
      <header className="bg-interface-card border-b border-interface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold text-white tracking-tight">
                interf<span className="text-interface-accent">A</span>ce
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400 text-sm">Inspection Records</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">
                {inspectionData.company}
              </span>
              <div className="w-8 h-8 bg-interface-border rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div className="flex items-center gap-4">
            <FilterToggle 
              checked={showFailedOnly} 
              onChange={setShowFailedOnly} 
            />
            <UploadButton 
              onUpload={handleNewInspection}
              setIsLoading={setIsLoading}
              setError={setError}
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Error</span>
            </div>
            <p className="mt-1 text-red-300 text-sm">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-400 hover:text-red-300"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mb-6 p-4 bg-interface-accent/10 border border-interface-accent/30 rounded-lg">
            <div className="flex items-center gap-3 text-interface-accent">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing document and extracting inspection data...</span>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-400">
          Showing {filteredInspections.length} of {inspections.length} inspections
          {showFailedOnly && ' (failed only)'}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>

        {/* Inspection List */}
        <InspectionList inspections={filteredInspections} />
      </main>
    </div>
  )
}

export default App
