import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { User, PresenceData } from '../types';

export const exportToCSV = (users: User[], presenceData: PresenceData, selectedDays: number[], reportTitle?: string) => {
  const headers = ['Name', 'Total Present', 'Total Absent', ...selectedDays.map(day => `Day ${day}`)];
  
  const data = users.map(user => {
    const row = [
      user.name,
      user.totalPresent.toString(),
      user.totalAbsent.toString(),
      ...selectedDays.map(day => {
        const status = presenceData[user.id]?.[day];
        return status === 'present' ? 'P' : status === 'absent' ? 'A' : '-';
      })
    ];
    return row;
  });

  // Add title row if provided
  const csvData = reportTitle 
    ? [[reportTitle], [], headers, ...data]
    : [headers, ...data];

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `presence-report-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (users: User[], presenceData: PresenceData, selectedDays: number[], reportTitle?: string) => {
  const headers = ['Name', 'Total Present', 'Total Absent', ...selectedDays.map(day => `Day ${day}`)];
  
  const data = users.map(user => {
    const row = [
      user.name,
      user.totalPresent,
      user.totalAbsent,
      ...selectedDays.map(day => {
        const status = presenceData[user.id]?.[day];
        return status === 'present' ? 'P' : status === 'absent' ? 'A' : '-';
      })
    ];
    return row;
  });

  // Create worksheet data
  const wsData = [];
  
  if (reportTitle) {
    wsData.push([reportTitle]);
    wsData.push([]);
  }
  
  wsData.push(headers);
  wsData.push(...data);

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Style the title if present
  if (reportTitle) {
    ws['A1'] = { v: reportTitle, t: 's', s: { font: { bold: true, sz: 16 } } };
    // Merge cells for title
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];
  }
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Presence Report');
  XLSX.writeFile(wb, `presence-report-${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToPDF = (users: User[], presenceData: PresenceData, selectedDays: number[], reportTitle?: string) => {
  const doc = new jsPDF();
  
  let yPosition = 22;
  
  // Add custom title if provided
  if (reportTitle) {
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text(reportTitle, 14, yPosition);
    yPosition += 15;
  }
  
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('Presence/Absence Report', 14, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, yPosition);
  yPosition += 10;

  const headers = [['Name', 'Present', 'Absent', 'Attendance Rate']];
  
  const data = users.map(user => [
    user.name,
    user.totalPresent.toString(),
    user.totalAbsent.toString(),
    `${Math.round((user.totalPresent / (user.totalPresent + user.totalAbsent)) * 100) || 0}%`
  ]);

  (doc as any).autoTable({
    head: headers,
    body: data,
    startY: yPosition,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246] }
  });

  doc.save(`presence-report-${new Date().toISOString().split('T')[0]}.pdf`);
};