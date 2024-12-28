import React from 'react';
import { exportFiles } from '../exportFiles';
import type { FileSystemAPI } from '@webcontainer/api';
// Import the exportFiles function

// type FileSystem = {
//   readdir: (path: string) => Promise<string[]>;
//   readFile: (path: string, encoding: string) => Promise<string>;
// };

interface ExportButtonProps {
  fs: FileSystemAPI | null; // Accept null for uninitialized state
}

const ExportButton: React.FC<ExportButtonProps> = ({ fs }) => {
  const handleExport = async () => {
    if (!fs) {
      console.error('File system is not initialized');
      alert('Error: File system is not ready.');
      return;
    }

    try {
      await exportFiles(fs); // Call the export function
    } catch (error) {
      console.error('Failed to export files:', error);
      alert('An error occurred while exporting files. Please try again.');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Export Files
    </button>
  );
};

export default ExportButton;

  // "bg-blue-600 text-white font-medium py-2 px-6 rounded-lg shadow-lg hover:bg-blue-500 hover:shadow-xl transition-all duration-200"