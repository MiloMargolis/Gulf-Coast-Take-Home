import { useState } from 'react'

const STATUS_OPTIONS = [
  { value: 'pass', label: 'Pass' },
  { value: 'pass_with_conditions', label: 'Pass with Conditions' },
  { value: 'fail', label: 'Fail' },
  { value: 'open', label: 'Open' },
]

const SEVERITY_OPTIONS = ['critical', 'high', 'medium', 'low']

export default function ReviewModal({ inspection, onConfirm, onCancel }) {
  const [draft, setDraft] = useState({ ...inspection })
  const confidence = inspection.confidence || {}

  const updateField = (field, value) => {
    setDraft(prev => ({ ...prev, [field]: value }))
  }

  const updateFinding = (index, field, value) => {
    setDraft(prev => {
      const findings = [...prev.findings]
      findings[index] = { ...findings[index], [field]: value }
      return { ...prev, findings }
    })
  }

  const removeFinding = (index) => {
    setDraft(prev => ({
      ...prev,
      findings: prev.findings.filter((_, i) => i !== index)
    }))
  }

  const updateCorrectiveAction = (index, field, value) => {
    setDraft(prev => {
      const actions = [...(prev.corrective_actions || [])]
      actions[index] = { ...actions[index], [field]: value }
      return { ...prev, corrective_actions: actions }
    })
  }

  const removeCorrectiveAction = (index) => {
    setDraft(prev => ({
      ...prev,
      corrective_actions: (prev.corrective_actions || []).filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40" onClick={onCancel} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl border border-interface-border w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-interface-border px-6 py-4 rounded-t-xl z-10">
          <h2 className="text-lg font-semibold text-interface-text">Review Extracted Data</h2>
          <p className="text-sm text-interface-text-secondary mt-0.5">
            Verify the AI-extracted fields before adding to your records.
          </p>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Core Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Inspection Type" value={draft.type} onChange={v => updateField('type', v)} />
            <Field label="Location" value={draft.location} onChange={v => updateField('location', v)} />
            <Field 
              label="Date" 
              value={draft.date} 
              onChange={v => updateField('date', v)} 
              type="date" 
              inferred={confidence.date === 'inferred'}
            />
            <Field 
              label="Report ID" 
              value={draft.id} 
              onChange={v => updateField('id', v)} 
              inferred={confidence.id === 'generated'}
            />
            <Field label="Inspector" value={draft.inspector} onChange={v => updateField('inspector', v)} />
            <div>
              <label className="block text-xs text-interface-text-muted uppercase tracking-wide mb-1.5">
                Status
                {confidence.status === 'inferred' && <InferredBadge />}
              </label>
              <select
                value={draft.status}
                onChange={e => updateField('status', e.target.value)}
                className="w-full px-3 py-2 border border-interface-border rounded-lg text-sm text-interface-text bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs text-interface-text-muted uppercase tracking-wide mb-1.5">Summary</label>
            <textarea
              value={draft.summary}
              onChange={e => updateField('summary', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-interface-border rounded-lg text-sm text-interface-text focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Completeness Warning */}
          {draft.completeness && !draft.completeness.is_complete && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-700 text-sm font-medium mb-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Document flagged as incomplete
              </div>
              <ul className="ml-6 text-sm text-amber-600 list-disc">
                {draft.completeness.missing_items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Findings */}
          <div>
            <label className="block text-xs text-interface-text-muted uppercase tracking-wide mb-2">
              Findings ({draft.findings?.length || 0})
              {confidence.severity === 'inferred' && <InferredBadge />}
            </label>
            <div className="space-y-3">
              {(draft.findings || []).map((finding, index) => (
                <div key={index} className="bg-gray-50 border border-interface-border rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <select
                      value={finding.severity}
                      onChange={e => updateFinding(index, 'severity', e.target.value)}
                      className="px-2 py-1 border border-interface-border rounded text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {SEVERITY_OPTIONS.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={finding.description}
                        onChange={e => updateFinding(index, 'description', e.target.value)}
                        className="w-full px-2 py-1 border border-interface-border rounded text-sm text-interface-text bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={finding.osha_ref || ''}
                        onChange={e => updateFinding(index, 'osha_ref', e.target.value || null)}
                        placeholder="OSHA reference (optional)"
                        className="w-full mt-1.5 px-2 py-1 border border-interface-border rounded text-xs text-interface-text-secondary bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => removeFinding(index)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove finding"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Corrective Actions */}
          {draft.corrective_actions && draft.corrective_actions.length > 0 && (
            <div>
              <label className="block text-xs text-interface-text-muted uppercase tracking-wide mb-2">
                Corrective Actions ({draft.corrective_actions.length})
              </label>
              <div className="space-y-3">
                {draft.corrective_actions.map((action, index) => (
                  <div key={index} className="bg-gray-50 border border-interface-border rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={action.action}
                          onChange={e => updateCorrectiveAction(index, 'action', e.target.value)}
                          className="w-full px-2 py-1 border border-interface-border rounded text-sm text-interface-text bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={action.deadline || ''}
                          onChange={e => updateCorrectiveAction(index, 'deadline', e.target.value || null)}
                          placeholder="Deadline (optional)"
                          className="w-full mt-1.5 px-2 py-1 border border-interface-border rounded text-xs text-interface-text-secondary bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        onClick={() => removeCorrectiveAction(index)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove action"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Inspection Due */}
          {draft.next_inspection_due && (
            <Field 
              label="Next Inspection Due" 
              value={draft.next_inspection_due} 
              onChange={v => updateField('next_inspection_due', v)} 
              type="date" 
            />
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-interface-border px-6 py-4 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-interface-text-secondary hover:text-interface-text border border-interface-border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Discard
          </button>
          <button
            onClick={() => onConfirm(draft)}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          >
            Add to Records
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', inferred = false }) {
  return (
    <div>
      <label className="block text-xs text-interface-text-muted uppercase tracking-wide mb-1.5">
        {label}
        {inferred && <InferredBadge />}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg text-sm text-interface-text focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          inferred ? 'border-amber-300 bg-amber-50/30' : 'border-interface-border'
        }`}
      />
    </div>
  )
}

function InferredBadge() {
  return (
    <span className="inline-flex items-center ml-2 px-1.5 py-0.5 text-[10px] font-medium rounded bg-amber-100 text-amber-700 normal-case tracking-normal">
      AI inferred
    </span>
  )
}
