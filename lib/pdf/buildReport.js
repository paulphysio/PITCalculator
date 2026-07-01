import PDFDocument from "pdfkit";

export function buildPDFReport(record) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(18).text("Nigerian Personal Income Tax Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Taxpayer: ${record.profiles?.full_name || "N/A"}`);
    doc.text(`Gross Annual Income: ₦${record.gross_income.toLocaleString()}`);
    doc.text(`Pension Contribution: ₦${record.pension_contribution.toLocaleString()}`);
    doc.text(`NHF Contribution: ₦${record.nhf_contribution.toLocaleString()}`);
    doc.text(`Life Assurance Premium: ₦${record.life_assurance_premium.toLocaleString()}`);
    doc.text(`Total Deductions: ₦${record.total_deductions.toLocaleString()}`);
    doc.text(`Chargeable Income: ₦${record.chargeable_income.toLocaleString()}`);
    doc.text(`Annual Tax: ₦${record.annual_tax.toLocaleString()}`);
    doc.text(`Monthly Tax: ₦${record.monthly_tax.toLocaleString()}`);
    doc.text(`Date: ${new Date(record.calculation_date).toLocaleDateString()}`);
    doc.end();
  });
}
