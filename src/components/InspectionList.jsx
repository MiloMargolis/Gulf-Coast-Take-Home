import InspectionItem from './InspectionItem'

export default function InspectionList({ inspections }) {
  if (inspections.length === 0) {
    return (
      <div className="bg-white border border-interface-border rounded-lg p-12 text-center">
        <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-interface-text font-medium">No inspections found</p>
        <p className="text-interface-text-secondary text-sm mt-1">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {inspections.map(inspection => (
        <InspectionItem key={inspection.id} inspection={inspection} />
      ))}
    </div>
  )
}
