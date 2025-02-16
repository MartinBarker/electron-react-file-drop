import React, { useState } from 'react';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);

  const handleDrop = async (event) => {
    // Get dropped files
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    console.log('Dropped files:', droppedFiles);

    // Send dropped files to backend main.js process
    window.api.send('get-filepaths', droppedFiles);

    // Handle returned file paths
    window.api.receive('get-filepaths-response', ( filepathsRsp ) => {
      console.log('Received file paths:', filepathsRsp);
    });
    /*
    setFiles(droppedFiles);
    for (const file of droppedFiles) {
      const filePath = await window.electron.getPathForFile(file);
      console.log(`File dropped: ${file.name} - ${filePath}`);
    }
    if (window.electron) {
      console.log('Sending files-dropped event to main process');
      const filesWithPaths = await Promise.all(droppedFiles.map(async (file) => ({
        name: file.name,
        path: await window.electron.getPathForFile(file)
      })));
      window.electron.sendFiles(filesWithPaths);
    }
      */
  };

  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    for (const file of selectedFiles) {
      const filePath = await window.electron.getPathForFile(file);
      console.log(`File selected: ${file.name} - ${filePath}`);
    }
    if (window.electron) {
      console.log('Sending files-dropped event to main process');
      const filesWithPaths = await Promise.all(selectedFiles.map(async (file) => ({
        name: file.name,
        path: await window.electron.getPathForFile(file)
      })));
      window.electron.sendFiles(filesWithPaths);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="App">
      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p>Drag and drop files here, or click to select files</p>
        <input type="file" multiple onChange={handleFileSelect} />
      </div>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;