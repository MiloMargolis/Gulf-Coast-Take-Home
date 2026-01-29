import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, HeadingLevel } from 'docx'
import fs from 'fs'

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      // Title
      new Paragraph({
        children: [
          new TextRun({ text: "GULF COAST ENERGY PARTNERS", bold: true, size: 32 })
        ],
        alignment: "center",
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Structural Inspection Report", bold: true, size: 28 })
        ],
        alignment: "center",
        spacing: { after: 400 }
      }),

      // Info Table
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Platform:", bold: true })] })] }),
              new TableCell({ children: [new Paragraph("Platform 12")] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Inspection Date:", bold: true })] })] }),
              new TableCell({ children: [new Paragraph("January 25, 2025")] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Inspector:", bold: true })] })] }),
              new TableCell({ children: [new Paragraph("Sarah Mitchell, Senior Structural Engineer")] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Report ID:", bold: true })] })] }),
              new TableCell({ children: [new Paragraph("SI-2025-003")] }),
            ]
          }),
        ]
      }),

      new Paragraph({ spacing: { after: 300 } }),

      // Inspection Type
      new Paragraph({
        children: [
          new TextRun({ text: "INSPECTION TYPE: ", bold: true }),
          new TextRun("Quarterly Grating & Walkway Integrity Check")
        ],
        spacing: { after: 200 }
      }),

      // Scope
      new Paragraph({
        children: [new TextRun({ text: "SCOPE:", bold: true })],
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: "Visual and physical inspection of all steel grating on production deck and cellar deck per API RP 2A-WSD Section 17.3.2.",
        spacing: { after: 300 }
      }),

      // Findings Header
      new Paragraph({
        children: [new TextRun({ text: "FINDINGS", bold: true, size: 28 })],
        spacing: { after: 200 }
      }),

      // Zone A
      new Paragraph({
        children: [new TextRun({ text: "Zone A (Production Deck):", bold: true })],
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: "• Grating sections G-31 through G-35: Significant corrosion detected, 40% material loss",
        spacing: { after: 50 }
      }),
      new Paragraph({
        text: "• Recommendation: Immediate replacement required",
        spacing: { after: 200 }
      }),

      // Zone B
      new Paragraph({
        children: [new TextRun({ text: "Zone B (Cellar Deck):", bold: true })],
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: "• All grating sections in acceptable condition",
        spacing: { after: 300 }
      }),

      // Corrective Actions
      new Paragraph({
        children: [new TextRun({ text: "CORRECTIVE ACTIONS REQUIRED", bold: true, size: 28 })],
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: "1. Replace grating sections G-31 through G-35 within 14 days",
        spacing: { after: 50 }
      }),
      new Paragraph({
        text: "2. Install temporary barriers around affected area immediately",
        spacing: { after: 50 }
      }),
      new Paragraph({
        text: "3. Update grating inspection schedule to monthly for Zone A",
        spacing: { after: 300 }
      }),

      // Status
      new Paragraph({
        children: [
          new TextRun({ text: "OVERALL STATUS: ", bold: true }),
          new TextRun({ text: "FAIL", bold: true, color: "FF0000" })
        ],
        spacing: { after: 400 }
      }),

      // Signature
      new Paragraph({
        children: [
          new TextRun({ text: "Signed: ", bold: true }),
          new TextRun("Sarah Mitchell, PE")
        ],
        spacing: { after: 50 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Date: ", bold: true }),
          new TextRun("January 25, 2025")
        ]
      }),
    ]
  }]
})

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('data/example-inspection.docx', buffer)
  console.log('Created data/example-inspection.docx')
})
