import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { User, PresenceData } from '../types';

export const exportToCSV = (users: User[], presenceData: PresenceData, selectedDays: number[]) => {
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

  const csv = Papa.unparse([headers, ...data]);
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

export const exportToExcel = (users: User[], presenceData: PresenceData, selectedDays: number[]) => {
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

  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Presence Report');
  XLSX.writeFile(wb, `presence-report-${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToPDF = (users: User[], presenceData: PresenceData, selectedDays: number[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Presence/Absence Report', 14, 22);
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

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
    startY: 40,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [59, 130, 246] }
  });

  doc.save(`presence-report-${new Date().toISOString().split('T')[0]}.pdf`);
};