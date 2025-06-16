import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { Person } from '../types';
import { parseExcelFile } from '../utils/excelUtils';

interface FileUploadProps {
  onImport: (people: Person[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onImport }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<Person[] | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setPreviewData(null);

    try {
      // Check file type
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error('Please upload an Excel file (.xlsx or .xls)');
      }

      const people = await parseExcelFile(file);
      
      if (people.length === 0) {
        throw new Error('No valid data found in the Excel file');
      }

      setPreviewData(people);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmImport = () => {
    if (previewData) {
      onImport(previewData);
      setPreviewData(null);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      ['Full Name', 'Date of Birth', 'Phone Number', 'Role or Group'],
      ['John Doe', '1990-01-15', '+1234567890', 'Family'],
      ['Jane Smith', '1985-06-22', '+0987654321', 'Friends'],
      ['Bob Johnson', '1992-12-03', '', 'Colleagues']
    ];
    
    const csvContent = templateData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'birthday-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Excel File Format</h3>
        <p className="text-sm text-blue-700 mb-3">
          Your Excel file should have the following columns in order:
        </p>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Full Name</strong> (required)</li>
          <li>• <strong>Date of Birth</strong> (required, format: YYYY-MM-DD or MM/DD/YYYY)</li>
          <li>• <strong>Phone Number</strong> (optional)</li>
          <li>• <strong>Role or Group</strong> (optional, defaults to "General")</li>
        </ul>
        <button
          onClick={downloadTemplate}
          className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          <Download className="h-4 w-4" />
          Download Template
        </button>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-indigo-400 bg-indigo-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="space-y-4">
          <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto" />
          <div>
            <p className="text-lg font-medium text-gray-900">
              {uploading ? 'Processing file...' : 'Drop your Excel file here'}
            </p>
            <p className="text-gray-600">
              or click to browse (.xlsx, .xls files only)
            </p>
          </div>
          
          {uploading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-900">Upload Error</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Preview Data */}
      {previewData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">File Processed Successfully</h4>
              <p className="text-sm text-green-700 mt-1">
                Found {previewData.length} people. Review the data below and click "Import" to add them.
              </p>
            </div>
          </div>

          {/* Preview Table */}
          <div className="bg-white rounded-lg border border-green-200 overflow-hidden mb-4">
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-900">Name</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-900">Birthday</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-900">Phone</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-900">Group</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(0, 10).map((person, index) => (
                    <tr key={index} className="border-t border-gray-100">
                      <td className="px-4 py-2">{person.fullName}</td>
                      <td className="px-4 py-2">{person.dateOfBirth}</td>
                      <td className="px-4 py-2">{person.phoneNumber || '-'}</td>
                      <td className="px-4 py-2">{person.roleOrGroup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {previewData.length > 10 && (
              <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600 text-center">
                ... and {previewData.length - 10} more people
              </div>
            )}
          </div>

          {/* Import Button */}
          <div className="flex gap-3">
            <button
              onClick={handleConfirmImport}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Import {previewData.length} People
            </button>
            <button
              onClick={() => setPreviewData(null)}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};