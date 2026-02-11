# Implementation Plan: Gulf Coast Inspection Records

This document outlines every bug fix, quality improvement, and above-and-beyond feature planned for the Gulf Coast Inspection Records app. Each item includes the problem, root cause, and solution.

---

## Phase 1: Bug Fixes

### 1.1 Date Off By One (March 15 → March 14)

- [x] **Fix date timezone bug**
- **Problem:** Document says "March 15, 2023" but the app displays "March 14, 2023"
- **Root Cause:** `new Date("2023-03-15")` parses as UTC midnight. `toLocaleDateString()` then converts to the user's local timezone (US Central/Eastern), shifting it back one day.
- **Files:** `InspectionItem.jsx` (line 27-33), `InspectionDetail.jsx` (line 21-28)
- **Fix:** Parse dates with timezone awareness — append `T00:00:00` or use UTC formatting methods to prevent the shift.

### 1.2 Report ID Ignored (SI-2023-047 → INS-2023-001)

- [x] **Fix ID extraction in LLM prompt**
- **Problem:** The document contains Report ID `SI-2023-047`, but the LLM generates `INS-2023-001` instead.
- **Root Cause:** The prompt says `"generate one like INS-YYYY-XXX if not found"`, which biases the LLM to always generate an INS-prefixed ID instead of using the document's actual ID.
- **File:** `extractInspection.js` (line 47)
- **Fix:** Rewrite prompt to say: "Use the document's report/inspection ID exactly as written. Only generate an ID as a last resort if none exists."

### 1.3 Status Mismatch (PASS with conditions → Open)

- [x] **Handle "pass with conditions" status**
- **Problem:** Document says "PASS with conditions" but the app shows "Open."
- **Root Cause:** The prompt constrains status to only `"pass, fail, or open"`. The LLM can't represent a conditional pass, so it guesses "open."
- **File:** `extractInspection.js` (line 52), `InspectionItem.jsx` (statusConfig)
- **Fix:** Add `"pass_with_conditions"` as a valid status in the prompt and add corresponding UI badge styling.

### 1.4 Ambiguous Severity Levels

- [x] **Add severity extraction heuristics to prompt**
- **Problem:** The structural inspection report doesn't have explicit severity labels. The LLM guesses inconsistently.
- **Root Cause:** No guidance in the prompt for how to infer severity from inspection language.
- **File:** `extractInspection.js` (system prompt)
- **Fix:** Add explicit heuristics: "If the document doesn't state severity, infer it: immediate replacement/safety risk = critical, corrosion/overdue maintenance = high, monitoring/recoating recommendations = medium, informational notes = low."

### 1.5 Missing Zone C Data & Corrective Actions

- [x] **Expand extraction schema for full document coverage**
- **Problem:** Zone C (Helideck Access) findings and the "Corrective Actions Required" section are completely missing from the extracted output.
- **Root Cause:** The JSON schema in the prompt has no fields for corrective actions or section-level detail. The LLM drops data that doesn't fit the schema.
- **File:** `extractInspection.js` (system prompt schema)
- **Fix:** Add `corrective_actions` array to the schema. Instruct the LLM to capture ALL findings from ALL sections/zones, not just flagged items.

---

## Phase 2: Quality & Safety Improvements

### 2.1 Post-Extraction Review UI

- [x] **Add review/edit step before saving extracted inspection**
- **Problem:** Extracted data goes straight into the list with no chance to verify or correct. For safety-critical OSHA data, this is unacceptable.
- **Solution:** After LLM extraction, show a modal/panel with the extracted fields alongside the raw document text. User can edit any field before confirming. This directly addresses every extraction bug — even if the LLM gets it wrong, the user catches it.

### 2.2 Extraction Confidence Indicators

- [x] **Flag inferred vs. explicit fields**
- **Problem:** The user can't tell which fields came directly from the document vs. which the LLM guessed.
- **Solution:** Ask the LLM to return a `confidence` object alongside the data, or flag fields like severity/status that were inferred. Display these with a subtle indicator in the review UI.

### 2.3 Persist Uploaded Inspections

- [x] **Save uploaded inspections to localStorage**
- **Problem:** Uploaded inspections vanish on page refresh.
- **Solution:** Sync the inspections array to `localStorage`. On load, merge saved uploads with the base JSON data. Simple, no backend needed.

---

## Phase 3: Above & Beyond — Scenario-Driven Features

### 3.1 Overdue Inspection Alerts

- [x] **Extract and display "next scheduled inspection" dates**
- **Why it matters:** The Structural Inspection Report says "Next scheduled inspection: March 2024." It's now January 2025 and that inspection never happened — directly leading to the contractor falling through corroded grating. This is THE central failure in the scenario.
- **Solution:** Add `next_inspection_due` to the extraction schema. Display overdue items with a red warning badge. Show days overdue.
- **Files:** `extractInspection.js`, `InspectionItem.jsx`, `InspectionDetail.jsx`

### 3.2 Corrective Action Tracking

- [x] **Extract corrective actions as trackable items with due dates**
- **Why it matters:** The structural inspection requires "Apply corrosion inhibitor to sections G-47, G-48 within 30 days." Tracking whether this actually happened is exactly what Raquel needs.
- **Solution:** Extract `corrective_actions: [{ action, deadline, status }]` from documents. Display them in the detail view with visual status (overdue/pending/done).
- **Files:** `extractInspection.js`, `InspectionDetail.jsx`

### 3.3 Document Completeness Flags

- [x] **Flag incomplete documents on upload**
- **Why it matters:** The Contractor Safety Orientation Certificate is incomplete — fall protection module unchecked (in red), supervisor signature blank, handwritten note saying "ran out of time." OSHA specifically requested this documentation.
- **Solution:** Have the LLM return a `completeness` object: `{ is_complete, missing_items: [] }`. Show a prominent warning banner on incomplete documents.
- **Files:** `extractInspection.js`, `InspectionDetail.jsx`

### 3.4 "Pass with Conditions" as First-Class Status

- [x] **Add fourth status type with distinct styling**
- **Why it matters:** Real industrial inspections aren't binary. Supporting this shows domain understanding and fixes bug 1.3 properly.
- **Solution:** Add `pass_with_conditions` to status config with a distinct teal/yellow-green badge. Update filter to optionally include conditional passes.
- **Files:** `InspectionItem.jsx`, `FilterToggle.jsx`

### 3.5 Platform Timeline View

- [x] **Add per-platform inspection history**
- **Why it matters:** Platform 7 has a 2023 inspection noting corrosion → a Dec 2024 "pass" → a Jan 2025 incident. Seeing this timeline in one place would have caught the gap immediately. Raquel wouldn't be up until 2am connecting dots across binders and shared drives.
- **Solution:** Add a "View by Platform" toggle that groups inspections by location and shows them as a timeline. Highlight gaps where scheduled inspections were missed.
- **Files:** New component `PlatformTimeline.jsx`, `App.jsx`

### 3.6 OSHA Reference Cross-Linking

- [x] **Make OSHA references searchable/filterable**
- **Why it matters:** OSHA Region 6 is actively investigating. Being able to pull "all findings citing 1910.22(b) across all facilities" is exactly what an HSE director needs during an investigation.
- **Solution:** Make OSHA reference badges clickable — clicking one filters the list to all inspections with findings citing that standard.
- **Files:** `InspectionDetail.jsx`, `App.jsx`

### 3.7 Export / OSHA Response Package

- [x] **Add export functionality for filtered inspections**
- **Why it matters:** Raquel's entire crisis is about pulling records together. An "Export" button that generates a CSV or printable summary of the currently filtered/visible inspections directly solves her problem.
- **Solution:** Add an "Export" button next to the upload button. Exports the current filtered view as CSV (inspection data + findings).
- **Files:** New utility `exportInspections.js`, `App.jsx`

---

## Implementation Order

| Step | Item | Type | Effort |
|------|------|------|--------|
| 1 | 1.1 Date timezone fix | Bug fix | Small |
| 2 | 1.2 ID extraction fix | Bug fix | Small |
| 3 | 1.3 + 3.4 Pass with conditions | Bug fix + Feature | Small |
| 4 | 1.4 Severity heuristics | Bug fix | Small |
| 5 | 1.5 + 3.2 Schema expansion + corrective actions | Bug fix + Feature | Medium |
| 6 | 2.1 Post-extraction review UI | Quality | Medium |
| 7 | 2.3 localStorage persistence | Quality | Small |
| 8 | 3.1 Overdue inspection alerts | Feature | Medium |
| 9 | 3.3 Document completeness flags | Feature | Medium |
| 10 | 3.5 Platform timeline view | Feature | Large |
| 11 | 3.6 OSHA reference cross-linking | Feature | Medium |
| 12 | 3.7 Export functionality | Feature | Medium |
| 13 | 2.2 Confidence indicators | Quality | Small |

---

*Each item will be implemented and committed separately so progress is trackable.*
