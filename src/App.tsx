import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';


// Use pdfjs version from package.json or from node_modules/pdfjs-dist
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


interface Coordinates {
  top: number;
  left: number;
}

function App() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const top = event.clientY - rect.top;
    const left = event.clientX - rect.left;
    
    setCoordinates({ top, left });
  };
 
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setCoordinates(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">PDF Viewer with Click Coordinates</h1>
          
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors">
            Upload PDF
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {!pdfFile && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">Upload a PDF file to get started</p>
          </div>
        )}
        
        {pdfFile && (
          <div 
            className="relative "
            onClick={handleClick}
          >
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              className="mx-auto"
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page 
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  className="mb-4 border border-gray-300"
                />
              ))}
            </Document>

            {coordinates && (
              <div
                style={{
                  position: 'absolute',
                  top: coordinates.top,
                  left: coordinates.left,
                  width: '200px',
                  height: '100px',
                  backgroundColor: 'rgba(59, 130, 246, 0.3)',
                  border: '2px solid rgb(59, 130, 246)',
                  transform: 'translate(0, -100%)',
                }}
                className="pointer-events-none flex items-center justify-center"
              >
                <div className="absolute  bg-white px-2 py-1 text-sm border border-blue-500 rounded">
                  Top: {Math.round(coordinates.top)}px
                  <br />
                  Left: {Math.round(coordinates.left)}px
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App