import JSZip from 'jszip';
import type { FileSystemAPI } from '@webcontainer/api';

// type FileSystem = {
//   readdir: (path: string) => Promise<string[]>;
//   readFile: (path: string, encoding: string) => Promise<string>;
// };

const isFile = async (fs: FileSystemAPI, path: string): Promise<boolean> => {
  // try {
  //   await fs.readFile(path, 'utf8'); // If this succeeds, it's a file
  //   return true;
  // } catch {
  //   return false; // If it fails, it's not a file
  // }
  try {
    // Attempt to read the directory
    await fs.readdir(path);
    return false; // If readdir succeeds, it's a directory
  } catch {
    try {
      // If readdir fails, check if readFile succeeds
      await fs.readFile(path, 'utf8');
      return true; // If readFile succeeds, it's a file
    } catch {
      return false; // If both fail, it might not exist or is inaccessible
    }
  }
};

const isDirectory = async (fs: FileSystemAPI, path: string): Promise<boolean> => {
  try {
    await fs.readdir(path); // If this succeeds, it's a directory
    console.log("entered into folder from isDirectory Method");
    
    return true;
  } catch {
    console.log("This is not a directory from isSdirectory Method");
    return false; // If it fails, it's not a directory
    
    
  }
};

export const exportFiles = async (fs: FileSystemAPI): Promise<void> => {
  if (!fs) {
    throw new Error('File system is not initialized');
  }

  const zip = new JSZip();

  const addFilesToZip = async (currentDir: string, zipFolder: JSZip): Promise<void> => {
    const entries = await fs.readdir(currentDir);

    for (const entry of entries) {
      const fullPath = `${currentDir}/${entry}`;
      //variable check
      const filecondition = await isFile(fs, fullPath);
      const foldercondition= await isDirectory(fs, fullPath);
      console.log(`Returned as a file -> ${filecondition}`);
      console.log(`Returned as a folder -> ${foldercondition}`);
      
      if (filecondition) {
        const content = await fs.readFile(fullPath, 'utf8');
        zipFolder.file(entry, content);
      } else if (foldercondition) {
        // const newFolder = zipFolder.folder(entry)!;
        // await addFilesToZip(fullPath, newFolder);
        const subFolder = zipFolder.folder(entry)!;
         await addFilesToZip(fullPath, subFolder);
      }
    }
  };

  // Start zipping from the root directory
  await addFilesToZip('/', zip);

  // Generate the zip as a Blob
  const zipBlob = await zip.generateAsync({ type: 'blob' });

  // Trigger download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(zipBlob);
  link.download = 'webcontainer-files.zip';
  link.click();

  URL.revokeObjectURL(link.href);
};
// export const exportFiles = async (fs: FileSystemAPI): Promise<void> => {
//   if (!fs) {
//         throw new Error('File system is not initialized');
//        }
//   const zip = new JSZip();

//   const addFilesToZip = async (dir: string, folder: JSZip) => {
//     // Use readdir with options to get file type information
//     const entries = await fs.readdir(dir, { withFileTypes: true });

//     for (const entry of entries) {
//       const entryPath = `${dir}/${entry.name}`;

//       if (await isDirectory(fs, entryPath)) {
//         // Create a subfolder in the ZIP and recursively add its contents
//         const subFolder = folder.folder(entry.name)!;
//         await addFilesToZip(entryPath, subFolder);
//       } else if (await isFile(fs, entryPath)) {
//         // Read file content and add it to the ZIP
//         const fileContent = await fs.readFile(entryPath, 'utf8');
//         folder.file(entry.name, fileContent);
//       }
//     }
//   };

//   try {
//     // Start adding files and folders from the root directory
//     await addFilesToZip('/', zip);

//     // Generate the ZIP file blob
//     const zipBlob = await zip.generateAsync({ type: 'blob' });

//     // Create a downloadable link for the ZIP file
//     const url = URL.createObjectURL(zipBlob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'webcontainer-files.zip';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     console.log('Files exported successfully');
//   } catch (error) {
//     console.error('Failed to export files:', error);
//     alert('An error occurred while exporting files.');
//   }
// };


