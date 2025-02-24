import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface RectangleData {
  pageNumber: number;
  top: number;
  left: number;
}

export default function App() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [rectData, setRectData] = useState<RectangleData | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  // Fired when user clicks on a particular page container
  const handlePageClick = (
    event: React.MouseEvent<HTMLDivElement>, 
    pageNumber: number
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const top = event.clientY - rect.top;
    const left = event.clientX - rect.left;

    // We store pageNumber so we know which page we clicked
    setRectData({ pageNumber, top, left });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setRectData(null);
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
          <div className="flex justify-center ">
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              className="mx-auto self-center"
            >
              {Array.from(new Array(numPages), (_, index) => {
                const pageNum = index + 1;
                return (
                  // Wrap each Page in its own clickable container
                  <div 
                    key={pageNum}
                    className="relative mb-4 border border-gray-300 "
                    onClick={(e) => handlePageClick(e, pageNum)}
                  >
                    <Page
                      pageNumber={pageNum}
                      scale={1}
                    />
                    
                    {rectData && rectData.pageNumber === pageNum && (
                      <div
                        style={{
                          position: 'absolute',
                          top: rectData.top,
                          left: rectData.left,
                          width: '200px',
                          height: '100px',
                          backgroundColor: 'rgba(59, 130, 246, 0.3)',
                          border: '2px solid rgb(59, 130, 246)',
                          transform: 'translateY(-100%)',
                        }}
                        className="pointer-events-none flex items-center justify-center"
                      >
                        <div className="absolute bg-white px-2 py-1 text-sm border border-blue-500 rounded">
                          Top: {Math.round(rectData.top)}
                          <br />
                          Left: {Math.round(rectData.left)}
                          <br />
                          Page: {rectData.pageNumber}
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
