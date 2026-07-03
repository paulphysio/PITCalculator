import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function buildPDFReport(record) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  let y = height - 50;

  // Title
  page.drawText("Nigerian Personal Income Tax Report", {
    x: 50,
    y,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= 30;

  // Taxpayer Info
  page.drawText(`Taxpayer: ${record.profiles?.full_name || "N/A"}`, {
    x: 50,
    y,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  page.drawText(`Date: ${new Date(record.calculation_date).toLocaleDateString()}`, {
    x: 50,
    y,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  y -= 30;

  // Income Summary
  page.drawText("Income Summary", {
    x: 50,
    y,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  page.drawText(`Gross Annual Income: N${record.gross_income.toLocaleString()}`, {
    x: 50,
    y,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  page.drawText(`Pension Contribution: N${record.pension_contribution.toLocaleString()}`, {
    x: 50,
    y,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  page.drawText(`NHF Contribution: N${record.nhf_contribution.toLocaleString()}`, {
    x: 50,
    y,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  page.drawText(`Total Deductions: N${record.total_deductions.toLocaleString()}`, {
    x: 50,
    y,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  page.drawText(`Chargeable Income: N${record.chargeable_income.toLocaleString()}`, {
    x: 50,
    y,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= 30;

  // Tax Summary
  page.drawText("Tax Summary", {
    x: 50,
    y,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  page.drawText(`Annual Tax: N${record.annual_tax.toLocaleString()}`, {
    x: 50,
    y,
    size: 12,
    font: boldFont,
    color: rgb(0, 0.5, 0),
  });
  y -= 20;

  page.drawText(`Monthly Tax: N${record.monthly_tax.toLocaleString()}`, {
    x: 50,
    y,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
