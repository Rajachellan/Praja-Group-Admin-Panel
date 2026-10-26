import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn {
  header: string;
  key: string;
}

/**
 * Exports data to an Excel (.xlsx) file
 */
export function exportToExcel(
  data: Record<string, unknown>[],
  fileName: string,
  sheetName: string = 'Data'
) {
  if (!data || data.length === 0) {
    throw new Error('No data available to export');
  }

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Auto-fit column widths based on content length
  const keys = Object.keys(data[0] || {});
  const colWidths = keys.map((key) => {
    let maxLen = key.length;
    data.forEach((row) => {
      const val = row[key];
      const len = val !== null && val !== undefined ? String(val).length : 0;
      if (len > maxLen) maxLen = len;
    });
    return { wch: Math.min(Math.max(maxLen + 3, 12), 45) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

interface PdfExportOptions {
  title: string;
  subtitle?: string;
  fileName: string;
  columns: string[];
  rows: (string | number)[][];
  orientation?: 'portrait' | 'landscape';
}

/**
 * Exports data to a professionally styled PDF document
 */
export function exportToPdf({
  title,
  subtitle,
  fileName,
  columns,
  rows,
  orientation = 'landscape',
}: PdfExportOptions) {
  if (!rows || rows.length === 0) {
    throw new Error('No data available to export');
  }

  const doc = new jsPDF({
    orientation,
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const generatedDate = new Date().toLocaleString();

  // Header Banner
  doc.setFillColor(22, 101, 52); // #166534 - Brand Deep Green
  doc.rect(0, 0, pageWidth, 54, 'F');

  // Brand Accent Line
  doc.setFillColor(243, 121, 36); // #F37924 - Brand Orange Accent
  doc.rect(0, 54, pageWidth, 4, 'F');

  // Title Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('PRAJHA GROUP', 36, 32);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(240, 253, 244);
  doc.text(` |  ${title}`, 175, 32);

  // Subtitle / Metadata
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const metadataText = `${subtitle ? `${subtitle}  •  ` : ''}Total Records: ${rows.length}  •  Generated: ${generatedDate}`;
  doc.text(metadataText, 36, 75);

  // AutoTable
  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 85,
    margin: { left: 36, right: 36, bottom: 45 },
    styles: {
      fontSize: 8,
      cellPadding: 6,
      textColor: [30, 41, 59],
      valign: 'top',
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [22, 101, 52], // #166534
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didDrawPage: (data) => {
      // Footer on every page
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);

      const footerText = 'Prajha Group Confidential Admin Export';
      doc.text(footerText, 36, pageHeight - 18);

      const pageNumber = `Page ${data.pageNumber}`;
      doc.text(pageNumber, pageWidth - 36 - doc.getTextWidth(pageNumber), pageHeight - 18);
    },
  });

  doc.save(`${fileName}.pdf`);
}
