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
    <div className="min-h-screen bg-interface-bg flex">
      {/* Sidebar */}
      <aside className="w-14 bg-white border-r border-interface-border flex flex-col items-center py-4 gap-1">
        <div className="w-8 h-8 bg-interface-accent rounded-lg flex items-center justify-center mb-4">
          <span className="text-white font-bold text-sm">IA</span>
        </div>
        <NavIcon active>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </NavIcon>
        <NavIcon>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </NavIcon>
        <NavIcon>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </NavIcon>
        <NavIcon>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </NavIcon>
        <div className="flex-1" />
        <NavIcon>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </NavIcon>
        <NavIcon>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </NavIcon>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 bg-white border-b border-interface-border px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-interface-text">
              Interface AI
            </span>
            <span className="text-interface-text-muted">|</span>
            <span className="text-interface-text-secondary text-sm">
              Inspection Records
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-interface-text-secondary text-sm">
              {inspectionData.company}
            </span>
            <button className="p-2 hover:bg-interface-bg rounded-lg transition-colors">
              <svg className="w-5 h-5 text-interface-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-interface-accent/10 border border-interface-accent/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-interface-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-interface-text">Inspection Records</h1>
              <p className="text-sm text-interface-text-secondary mt-0.5">
                View and manage platform inspection documentation
              </p>
            </div>
            <UploadButton 
              onUpload={handleNewInspection}
              setIsLoading={setIsLoading}
              setError={setError}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <FilterToggle 
              checked={showFailedOnly} 
              onChange={setShowFailedOnly} 
            />
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Error</span>
              </div>
              <p className="mt-1 text-red-600 text-sm">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-700 hover:text-red-800 font-medium"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3 text-interface-accent">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-blue-700">Processing document and extracting inspection data...</span>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-4 text-sm text-interface-text-secondary">
            Showing {filteredInspections.length} of {inspections.length} inspections
            {showFailedOnly && ' (failed only)'}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>

          {/* Inspection List */}
          <InspectionList inspections={filteredInspections} />
        </main>
      </div>
    </div>
  )
}

function NavIcon({ children, active }) {
  return (
    <button 
      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
        active 
          ? 'bg-interface-accent/10 text-interface-accent' 
          : 'text-interface-text-muted hover:bg-interface-bg hover:text-interface-text-secondary'
      }`}
    >
      {children}
    </button>
  )
}

export default App
