# Gulf Coast Inspection Records

A React application for displaying and managing offshore platform inspection records with AI-powered document extraction.

## Features

- **Inspection List** - View all inspections sorted by date (newest first)
- **Status Indicators** - Pass/Fail/Open badges for quick scanning
- **Expandable Details** - Click any inspection to view full details and findings
- **Search** - Filter by location or inspection type
- **Failed Only Filter** - Toggle to show only failed inspections
- **Document Upload** - Upload .docx inspection documents for automatic data extraction
- **AI Extraction** - Uses OpenAI to parse uploaded documents and extract structured data

## Tech Stack

- React 18 with hooks
- Vite
- Tailwind CSS
- OpenAI API (gpt-4o-mini)
- mammoth.js for .docx parsing

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173

## Project Structure

```
/src
  /components
    InspectionList.jsx    - Renders the list of inspections
    InspectionItem.jsx    - Individual inspection row with expand/collapse
    InspectionDetail.jsx  - Expanded view showing findings
    SearchBar.jsx         - Search input for filtering
    FilterToggle.jsx      - Toggle for failed-only filter
    UploadButton.jsx      - Document upload handler
  /utils
    extractInspection.js  - Document parsing and LLM extraction
  App.jsx                 - Main application component
/data
  gulf_coast_inspections.json  - Initial inspection data
  example-inspection.docx      - Sample structural inspection report
  example-orientation.docx     - Sample contractor orientation certificate
```

## Testing Upload

Two example .docx files are provided in `/data`:
- `example-inspection.docx` - Structural Inspection Report (will extract as "Fail")
- `example-orientation.docx` - Contractor Safety Orientation Certificate (will extract as "Pass")

Upload either file to test the AI extraction functionality.

## Data Model

Each inspection contains:
```json
{
  "id": "INS-2025-018",
  "location": "Platform 7",
  "type": "Incident Investigation",
  "date": "2025-01-10",
  "inspector": "OSHA Region 6",
  "status": "open",
  "summary": "Brief description...",
  "findings": [
    {
      "severity": "critical",
      "description": "Finding description",
      "osha_ref": "1910.22(b)"
    }
  ]
}
```
