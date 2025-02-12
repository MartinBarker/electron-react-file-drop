import React, { useState } from 'react';
import './App.css';

let ipcRenderer;
if (window.require) {
  ipcRenderer = window.require('electron').ipcRenderer;
}

function App() {
  const [files, setFiles] = useState([]);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);
    if (ipcRenderer) {
      ipcRenderer.send('files-dropped', droppedFiles.map(file => ({ name: file.name, path: file.path })));
    }
  };

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    if (ipcRenderer) {
      ipcRenderer.send('files-dropped', selectedFiles.map(file => ({ name: file.name, path: file.path })));
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
          <li key={index}>{file.name} - {file.path}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
