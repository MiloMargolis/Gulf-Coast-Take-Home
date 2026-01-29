import mammoth from 'mammoth'

// Get API key from environment variable
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

export async function extractInspection(file) {
  // Parse .docx to text using mammoth
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  const documentText = result.value

  if (!documentText || documentText.trim().length === 0) {
    throw new Error('Could not extract text from document')
  }

  // Make LLM call to extract inspection data
  const inspection = await extractWithLLM(documentText)
  
  return inspection
}

async function extractWithLLM(documentText) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file.')
  }

  const systemPrompt = `You are an expert at extracting structured data from offshore platform inspection documents. 
Extract the following information from the document and return it as valid JSON:

{
  "id": "unique inspection ID (generate one like INS-YYYY-XXX if not found)",
  "location": "platform or facility name",
  "type": "type of inspection (e.g., Structural Inspection, Safety Orientation, PSM Audit, etc.)",
  "date": "date in YYYY-MM-DD format",
  "inspector": "name of inspector or organization",
  "status": "pass, fail, or open",
  "summary": "brief 1-2 sentence summary of the inspection",
  "findings": [
    {
      "severity": "critical, high, medium, or low",
      "description": "description of the finding",
      "osha_ref": "OSHA reference if applicable, otherwise null"
    }
  ]
}

Important:
- If status is not explicitly stated, infer from findings (no findings = pass, findings = fail or open)
- For safety orientation certificates, status is typically "pass" if completed
- Generate a realistic inspection ID if one is not provided
- findings array should be empty [] if there are no issues
- Always return valid JSON only, no other text`

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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `API request failed: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('No response from LLM')
  }

  try {
    const inspection = JSON.parse(content)
    
    // Validate required fields
    if (!inspection.type || !inspection.location || !inspection.date) {
      throw new Error('Missing required fields in extracted data')
    }

    // Ensure findings is an array
    if (!Array.isArray(inspection.findings)) {
      inspection.findings = []
    }

    return inspection
  } catch (parseError) {
    throw new Error('Failed to parse LLM response as JSON')
  }
}
