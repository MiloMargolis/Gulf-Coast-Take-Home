import { useRef } from 'react'
import { extractInspection } from '../utils/extractInspection'

export default function UploadButton({ onUpload, setIsLoading, setError }) {
  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset input
    event.target.value = ''

    // Validate file type
    if (!file.name.endsWith('.docx')) {
      setError('Please upload a .docx file')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const inspection = await extractInspection(file)
      onUpload(inspection)
    } catch (err) {
      console.error('Extraction error:', err)
      setError(err.message || 'Failed to extract inspection data from document')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Upload Document
      </button>
    </>
  )
}
