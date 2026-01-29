import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from 'docx'
import fs from 'fs'

// Document 1: Structural Inspection Report (FAIL)
const structuralInspection = new Document({
  sections: [{
    properties: {},
    children: [
      new Paragraph({
        children: [new TextRun({ text: "GULF COAST ENERGY PARTNERS", bold: true, size: 32 })],
        alignment: "center",
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Structural Inspection Report", bold: true, size: 28 })],
        alignment: "center",
        spacing: { after: 400 }
      }),
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
      new Paragraph({
        children: [
          new TextRun({ text: "INSPECTION TYPE: ", bold: true }),
          new TextRun("Quarterly Grating & Walkway Integrity Check")
        ],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "SCOPE:", bold: true })],
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: "Visual and physical inspection of all steel grating on production deck and cellar deck per API RP 2A-WSD Section 17.3.2.",
        spacing: { after: 300 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "FINDINGS", bold: true, size: 28 })],
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Zone A (Production Deck):", bold: true })],
        spacing: { after: 100 }
      }),
      new Paragraph({ text: "• Grating sections G-31 through G-35: Significant corrosion detected, 40% material loss", spacing: { after: 50 } }),
      new Paragraph({ text: "• Recommendation: Immediate replacement required", spacing: { after: 200 } }),
      new Paragraph({
        children: [new TextRun({ text: "Zone B (Cellar Deck):", bold: true })],
        spacing: { after: 100 }
      }),
      new Paragraph({ text: "• All grating sections in acceptable condition", spacing: { after: 300 } }),
      new Paragraph({
        children: [new TextRun({ text: "CORRECTIVE ACTIONS REQUIRED", bold: true, size: 28 })],
        spacing: { after: 200 }
      }),
      new Paragraph({ text: "1. Replace grating sections G-31 through G-35 within 14 days", spacing: { after: 50 } }),
      new Paragraph({ text: "2. Install temporary barriers around affected area immediately", spacing: { after: 50 } }),
      new Paragraph({ text: "3. Update grating inspection schedule to monthly for Zone A", spacing: { after: 300 } }),
      new Paragraph({
        children: [
          new TextRun({ text: "OVERALL STATUS: ", bold: true }),
          new TextRun({ text: "FAIL", bold: true, color: "FF0000" })
        ],
        spacing: { after: 400 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Signed: ", bold: true }), new TextRun("Sarah Mitchell, PE")],
        spacing: { after: 50 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Date: ", bold: true }), new TextRun("January 25, 2025")]
      }),
    ]
  }]
})

// Document 2: Contractor Safety Orientation Certificate (PASS)
const orientationCertificate = new Document({
  sections: [{
    properties: {},
    children: [
      new Paragraph({
        children: [new TextRun({ text: "GULF COAST ENERGY PARTNERS", bold: true, size: 32 })],
        alignment: "center",
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "CONTRACTOR SAFETY ORIENTATION CERTIFICATE", bold: true, size: 24 })],
        alignment: "center",
        spacing: { after: 400 }
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Contractor Company:", bold: true })] })] }),
              new TableCell({ children: [new Paragraph("Acadian Mechanical Services")] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Employee Name:", bold: true })] })] }),
              new TableCell({ children: [new Paragraph("James Boudreau")] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Work Location:", bold: true })] })] }),
              new TableCell({ children: [new Paragraph("Platform 7")] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Orientation Date:", bold: true })] })] }),
              new TableCell({ children: [new Paragraph("January 3, 2025")] }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Badge Number:", bold: true })] })] }),
              new TableCell({ children: [new Paragraph("C-4782")] }),
            ]
          }),
        ]
      }),
      new Paragraph({ spacing: { after: 300 } }),
      new Paragraph({
        children: [new TextRun({ text: "ORIENTATION TOPICS COVERED", bold: true, size: 24 })],
        spacing: { after: 200 }
      }),
      new Paragraph({ text: "[X] General safety rules and policies", spacing: { after: 50 } }),
      new Paragraph({ text: "[X] Emergency response procedures", spacing: { after: 50 } }),
      new Paragraph({ text: "[X] PPE requirements (hard hat, safety glasses, steel-toed boots, FR clothing)", spacing: { after: 50 } }),
      new Paragraph({ text: "[X] H2S hazards and escape procedures", spacing: { after: 50 } }),
      new Paragraph({ text: "[X] Permit-to-work system", spacing: { after: 50 } }),
      new Paragraph({ text: "[ ] Confined space entry (N/A for this scope)", spacing: { after: 50 } }),
      new Paragraph({ text: "[X] Hot work procedures", spacing: { after: 50 } }),
      new Paragraph({ text: "[X] Fall protection and working at heights", spacing: { after: 50 } }),
      new Paragraph({ text: "[X] Dropped objects prevention", spacing: { after: 300 } }),
      new Paragraph({
        children: [new TextRun({ text: "WORK SCOPE BRIEFING", bold: true, size: 24 })],
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: "James will be performing valve maintenance on the production separator system. Work involves potential for:",
        spacing: { after: 100 }
      }),
      new Paragraph({ text: "- H2S exposure (LEL monitoring required)", spacing: { after: 50 } }),
      new Paragraph({ text: "- Hot work (cutting/welding permit needed)", spacing: { after: 50 } }),
      new Paragraph({ text: "- Work above 4 feet", spacing: { after: 200 } }),
      new Paragraph({
        children: [
          new TextRun({ text: "JSA REVIEWED: ", bold: true }),
          new TextRun("JSA-2025-003 \"Separator Valve Maintenance\"")
        ],
        spacing: { after: 300 }
      }),
      new Paragraph({
        children: [new TextRun({ text: "VERIFICATION", bold: true, size: 24 })],
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: "I acknowledge that I have received safety orientation and understand the hazards associated with my work scope.",
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Contractor Signature: ", bold: true }),
          new TextRun("J. Boudreau")
        ],
        spacing: { after: 50 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Date: ", bold: true }),
          new TextRun("1/3/2025")
        ],
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Platform Safety Supervisor: ", bold: true }),
          new TextRun("Mike Thibodaux")
        ],
        spacing: { after: 50 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Supervisor Signature: ", bold: true }),
          new TextRun("M. Thibodaux")
        ],
        spacing: { after: 300 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "ORIENTATION STATUS: ", bold: true }),
          new TextRun({ text: "COMPLETE", bold: true, color: "008000" })
        ],
      }),
    ]
  }]
})

// Generate both files
async function generateFiles() {
  const buffer1 = await Packer.toBuffer(structuralInspection)
  fs.writeFileSync('data/example-inspection.docx', buffer1)
  console.log('Created data/example-inspection.docx')

  const buffer2 = await Packer.toBuffer(orientationCertificate)
  fs.writeFileSync('data/example-orientation.docx', buffer2)
  console.log('Created data/example-orientation.docx')
}

generateFiles()
