import * as XLSX from 'xlsx';
import { Person } from '../types';

export const parseExcelFile = (file: File): Promise<Person[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Skip header row and process data
        const people: Person[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (row.length >= 3 && row[0] && row[1]) {
            const person: Person = {
              id: crypto.randomUUID(),
              fullName: String(row[0]).trim(),
              dateOfBirth: formatExcelDate(row[1]),
              phoneNumber: row[2] ? String(row[2]).trim() : undefined,
              roleOrGroup: row[3] ? String(row[3]).trim() : 'General',
              celebrated: false
            };
            people.push(person);
          }
        }
        
        resolve(people);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + error));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

const formatExcelDate = (excelDate: any): string => {
  try {
    // Handle different date formats
    if (typeof excelDate === 'number') {
      // Excel serial date
      const date = XLSX.SSF.parse_date_code(excelDate);
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    } else if (typeof excelDate === 'string') {
      // Try to parse string date
      const date = new Date(excelDate);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    }
    return String(excelDate);
  } catch (error) {
    return String(excelDate);
  }
};

export const exportToExcel = (people: Person[]): void => {
  const data = [
    ['Full Name', 'Date of Birth', 'Phone Number', 'Role or Group', 'Celebrated'],
    ...people.map(person => [
      person.fullName,
      person.dateOfBirth,
      person.phoneNumber || '',
      person.roleOrGroup,
      person.celebrated ? 'Yes' : 'No'
    ])
  ];
  
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Birthdays');
  
  XLSX.writeFile(workbook, `birthdays-${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToCSV = (people: Person[]): void => {
  const data = [
    ['Full Name', 'Date of Birth', 'Phone Number', 'Role or Group', 'Celebrated'],
    ...people.map(person => [
      person.fullName,
      person.dateOfBirth,
      person.phoneNumber || '',
      person.roleOrGroup,
      person.celebrated ? 'Yes' : 'No'
    ])
  ];
  
  const csvContent = data.map(row => 
    row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `birthdays-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};