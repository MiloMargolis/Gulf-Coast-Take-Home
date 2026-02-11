const STATUS_FILTERS = [
  { value: 'all', label: 'All statuses' },
  { value: 'fail', label: 'Failed' },
  { value: 'open', label: 'Open' },
  { value: 'pass_with_conditions', label: 'Conditional' },
  { value: 'pass', label: 'Passed' },
]

export default function FilterToggle({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-white border border-interface-border rounded-lg px-3 py-2 text-sm text-interface-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
    >
      {STATUS_FILTERS.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
