import mammoth from 'mammoth'

// Get API key from environment variable
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

export async function extractInspection(file) {
  console.log('[1/4] Starting document extraction...')
  console.log(`      File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`)
  
  // Parse .docx to text using mammoth
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  const documentText = result.value

  if (!documentText || documentText.trim().length === 0) {
    console.error('[ERROR] Failed to extract text from document')
    throw new Error('Could not extract text from document')
  }

  console.log('[2/4] Text extracted from document')
  console.log(`      Characters: ${documentText.length}`)
  console.log('      Preview:', documentText.substring(0, 200) + '...')

  // Make LLM call to extract inspection data
  const inspection = await extractWithLLM(documentText)
  
  console.log('[4/4] Extraction complete!')
  console.log('      Extracted inspection:', inspection)
  
  return inspection
}

async function extractWithLLM(documentText) {
  if (!OPENAI_API_KEY) {
    console.error('[ERROR] No API key found')
    throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file.')
  }

  console.log('[3/4] Calling OpenAI API...')
  console.log(`      Model: gpt-4o-mini`)
  console.log(`      API Key: ${OPENAI_API_KEY.substring(0, 7)}...${OPENAI_API_KEY.substring(OPENAI_API_KEY.length - 4)}`)

  const systemPrompt = `You are an expert at extracting structured data from offshore platform inspection documents.
Extract the following information from the document and return it as valid JSON.

CRITICAL RULES:
- Use EXACTLY what the document says. Do not paraphrase, round, or reformat values unless instructed.
- For "id": Use the document's Report ID, Inspection ID, Certificate ID, or any identifier EXACTLY as written (e.g., "SI-2023-047", "GC-HSE-101"). Only generate an ID like "INS-YYYY-XXX" if absolutely no identifier exists in the document.
- For "date": Use the inspection/report date from the document. Format as YYYY-MM-DD. Do NOT shift or adjust the date.
- For "status": Use one of: "pass", "fail", "open", or "pass_with_conditions". 
  - "pass" = no issues found
  - "fail" = significant findings requiring action
  - "pass_with_conditions" = passed overall but with noted conditions, recommendations, or required follow-ups
  - "open" = investigation ongoing or unresolved
  - Use the document's stated status. If it says "PASS with conditions", use "pass_with_conditions".
- For "inspector": Use the full name and title if provided (e.g., "Dave Landry, Senior Structural Engineer").

SEVERITY HEURISTICS (when the document does not explicitly label severity):
- critical: Immediate safety risk, expired permits during active work, structural failure risk
- high: Overdue maintenance on safety equipment, missing required documentation, corrosion requiring replacement
- medium: Surface rust, minor corrosion to monitor, missing training refreshers, PPE violations
- low: Housekeeping items, informational recommendations, items addressed on-site

FINDINGS RULES:
- Capture ALL findings from ALL sections/zones in the document. Do not skip any.
- Each distinct finding should be its own entry, even if they're in the same zone/section.
- Include the zone/section context in the description (e.g., "Zone A (Production Deck): Surface rust on sections G-14 through G-22").
- If a zone has no issues, include it as a finding with severity "low" and note "no action required".

Return this exact JSON structure:

{
  "id": "document's own ID, verbatim",
  "location": "platform or facility name",
  "type": "type of inspection as stated in document",
  "date": "YYYY-MM-DD",
  "inspector": "full name and title",
  "status": "pass | fail | open | pass_with_conditions",
  "summary": "brief 1-2 sentence summary",
  "findings": [
    {
      "severity": "critical | high | medium | low",
      "description": "description including zone/section context",
      "osha_ref": "OSHA reference if applicable, otherwise null"
    }
  ],
  "corrective_actions": [
    {
      "action": "what needs to be done",
      "deadline": "stated deadline or null",
      "status": "pending"
    }
  ],
  "next_inspection_due": "YYYY-MM-DD or null if not stated",
  "completeness": {
    "is_complete": true,
    "missing_items": ["list of any missing signatures, unchecked required modules, incomplete sections, etc."]
  }
}

- corrective_actions: Extract from any "Corrective Actions Required" or similar sections. Empty array [] if none.
- next_inspection_due: Extract if the document states a next scheduled inspection date. null if not mentioned.
- completeness: Flag if signatures are missing, required fields are blank, modules are unchecked, or handwritten notes indicate incomplete items.
- findings array should be empty [] only if there are truly no findings in the entire document.
- Always return valid JSON only, no other text.`

  const startTime = performance.now()

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Extract inspection data from this document:\n\n${documentText}` }
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    })
  })

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('[ERROR] API request failed:', response.status, errorData)
    throw new Error(errorData.error?.message || `API request failed: ${response.status}`)
  }

  const data = await response.json()
  
  console.log(`[OK] API response received (${elapsed}s)`)
  console.log(`     Tokens used: ${data.usage?.total_tokens || 'unknown'}`)
  
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    console.error('[ERROR] No content in response')
    throw new Error('No response from LLM')
  }

  console.log('     Raw response:', content)

  try {
    const inspection = JSON.parse(content)
    
    // Validate required fields
    if (!inspection.type || !inspection.location || !inspection.date) {
      console.error('[ERROR] Missing required fields:', { 
        type: inspection.type, 
        location: inspection.location, 
        date: inspection.date 
      })
      throw new Error('Missing required fields in extracted data')
    }

    // Normalize status
    const validStatuses = ['pass', 'fail', 'open', 'pass_with_conditions']
    if (!validStatuses.includes(inspection.status)) {
      console.warn(`[WARN] Unknown status "${inspection.status}", defaulting to "open"`)
      inspection.status = 'open'
    }

    // Ensure arrays exist
    if (!Array.isArray(inspection.findings)) {
      inspection.findings = []
    }
    if (!Array.isArray(inspection.corrective_actions)) {
      inspection.corrective_actions = []
    }

    // Ensure completeness object exists
    if (!inspection.completeness) {
      inspection.completeness = { is_complete: true, missing_items: [] }
    }

    return inspection
  } catch (parseError) {
    console.error('[ERROR] Failed to parse JSON:', parseError)
    throw new Error('Failed to parse LLM response as JSON')
  }
}
