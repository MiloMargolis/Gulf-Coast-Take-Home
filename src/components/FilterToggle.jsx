export default function FilterToggle({ checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none bg-white border border-interface-border rounded-lg px-4 py-2.5 shadow-card">
      <span className="text-interface-text-secondary text-sm whitespace-nowrap">Failed only</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-interface-accent focus:ring-offset-2 ${
          checked ? 'bg-interface-accent' : 'bg-interface-border'
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
          }`}
        />
      </button>
    </label>
  )
}
