import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set the worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Interface to define the structure of rectangle data
interface RectangleData {
  pageNumber: number; // Page number where the rectangle is drawn
  top: number;        // Top position of the rectangle
  left: number;       // Left position of the rectangle
}

export default function App() {
  // State variables to manage PDF file and rectangle data
  const [numPages, setNumPages] = useState<number | null>(null); // Total number of pages in the PDF
  const [rectData, setRectData] = useState<RectangleData | null>(null); // Data for the rectangle
  const [pdfFile, setPdfFile] = useState<File | null>(null); // The uploaded PDF file

  // Callback function when the document is successfully loaded
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages); // Set the number of pages in state
  }

  // Handle click events on PDF pages to capture coordinates
  const handlePageClick = (
    event: React.MouseEvent<HTMLDivElement>, 
    pageNumber: number
  ) => {
    const rect = event.currentTarget.getBoundingClientRect(); // Get the bounding rectangle of the clicked page
    const top = event.clientY - rect.top; // Calculate top position
    const left = event.clientX - rect.left; // Calculate left position

    setRectData({ pageNumber, top, left }); // Update rectangle data with coordinates
  };

  // Handle file input changes to upload a PDF
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the uploaded file
    if (file && file.type === 'application/pdf') { // Check if the file is a PDF
      setPdfFile(file); // Set the PDF file in state
      setRectData(null); // Reset rectangle data
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-20">
          <h1 className="text-2xl font-bold">PDF Viewer with Click Coordinates</h1>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors">
            Upload PDF
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange} // Handle file change
              className="hidden" // Hide the file input
            />
          </label>
        </div>

        {/* Message to prompt user to upload a PDF if none is uploaded */}
        {!pdfFile && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">Upload a PDF file to get started</p>
          </div>
        )}

        {/* Render the PDF document if a file is uploaded */}
        {pdfFile && (
          <div className="flex">
            <Document
              file={pdfFile} // Pass the uploaded PDF file
              onLoadSuccess={onDocumentLoadSuccess} // Callback on successful load
              className="mx-auto"
            >
              {Array.from(new Array(numPages), (_, index) => {
                const pageNum = index + 1; // Calculate page number
                return (
                  <div 
                    key={pageNum}
                    className="relative mb-4 border border-gray-300 "
                    onClick={(e) => handlePageClick(e, pageNum)} // Handle page click
                  >
                    <Page
                      pageNumber={pageNum} // Render the page
                      scale={1} // Set scale for rendering
                      renderTextLayer={false} // Disable text layer rendering
                      renderAnnotationLayer={false} // Disable annotation layer rendering
                    />
                    
                    {/* Render rectangle if data is available for the current page */}
                    {rectData && rectData.pageNumber === pageNum && (
                      <div
                        style={{
                          position: 'absolute',
                          top: rectData.top, // Position from top
                          left: rectData.left, // Position from left
                          width: '150px', // Width of the rectangle
                          height: '60px', // Height of the rectangle
                          transform: 'translateY(-100%)', // Adjust position
                        }}
                        className="rounded-sm bg-blue-200 border-2 border-blue-500"
                      >
                        <div className="absolute pl-1 p-0.5 text-xs font-mono bottom-0 left-0 leading-tight">
                          <p>Page: {rectData.pageNumber}</p>
                          <p>Top: {Math.round(rectData.top)}</p>
                          <p>Left: {Math.round(rectData.left)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </Document>
          </div>
        )}
      </div>
    </div>
  );
}
