export function exportToCSV(inspections) {
  const headers = [
    'ID',
    'Type',
    'Location',
    'Date',
    'Inspector',
    'Status',
    'Summary',
    'Findings Count',
    'Finding Severities',
    'Finding Descriptions',
    'OSHA References',
    'Corrective Actions',
    'Next Inspection Due',
  ]

  const rows = inspections.map(i => [
    i.id,
    i.type,
    i.location,
    i.date,
    i.inspector,
    i.status,
    i.summary,
    (i.findings || []).length,
    (i.findings || []).map(f => f.severity).join('; '),
    (i.findings || []).map(f => f.description).join('; '),
    (i.findings || []).map(f => f.osha_ref).filter(Boolean).join('; '),
    (i.corrective_actions || []).map(a => a.action).join('; '),
    i.next_inspection_due || '',
  ])

  const escape = (val) => {
    const str = String(val ?? '')
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const csv = [
    headers.map(escape).join(','),
    ...rows.map(row => row.map(escape).join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `inspection-records-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
