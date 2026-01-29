export default function FilterToggle({ checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <span className="text-gray-400 text-sm whitespace-nowrap">Failed only</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-interface-accent focus:ring-offset-2 focus:ring-offset-interface-dark ${
          checked ? 'bg-interface-accent' : 'bg-interface-border'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  )
}
