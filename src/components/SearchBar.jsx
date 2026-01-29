export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <svg 
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-interface-text-muted" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by location or inspection type..."
        className="w-full pl-11 pr-4 py-2.5 bg-white border border-interface-border rounded-lg text-interface-text placeholder-interface-text-muted focus:outline-none focus:border-interface-accent focus:ring-1 focus:ring-interface-accent transition-colors shadow-card"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-interface-text-muted hover:text-interface-text-secondary"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
