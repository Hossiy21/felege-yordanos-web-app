import { writeFileSync, mkdirSync } from "fs";

mkdirSync("public", { recursive: true });

// Minimal valid PDF with text content
const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]
   /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj

4 0 obj
<< /Length 386 >>
stream
BT
/F1 24 Tf
100 700 Td
(SST Manager) Tj
0 -40 Td
/F1 14 Tf
(Sunday School Official Letter) Tj
0 -30 Td
/F1 12 Tf
(Reference: SST/EDU/001/2026) Tj
0 -20 Td
(Date: February 8, 2026) Tj
0 -20 Td
(Department: Education) Tj
0 -40 Td
(Subject: Annual Report Submission to Diocese) Tj
0 -30 Td
(Dear Diocese Administration,) Tj
0 -20 Td
(This letter serves as the official submission) Tj
0 -20 Td
(of our annual report for the year 2025.) Tj
0 -30 Td
(Respectfully,) Tj
0 -20 Td
(Admin User - SST Manager) Tj
ET
endstream
endobj

5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000704 00000 n 

trailer
<< /Size 6 /Root 1 0 R >>
startxref
781
%%EOF`;

writeFileSync("public/sample-letter.pdf", pdfContent);
console.log("Sample PDF created at public/sample-letter.pdf");
