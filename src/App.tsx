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

  const handlePageClick = (
    event: React.MouseEvent<HTMLDivElement>, 
    pageNumber: number
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const top = event.clientY - rect.top;
    const left = event.clientX - rect.left;

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
        <div className="flex items-center justify-between mb-20">
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
          <div className="flex">
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              className="mx-auto"
            >
              {Array.from(new Array(numPages), (_, index) => {
                const pageNum = index + 1;
                return (
                  <div 
                    key={pageNum}
                    className="relative mb-4 border border-gray-300 "
                    onClick={(e) => handlePageClick(e, pageNum)}
                  >
                    <Page
                      pageNumber={pageNum}
                      scale={1}
                      renderTextLayer={false}
                    />
                    
                    {rectData && rectData.pageNumber === pageNum && (
                      <div
                        style={{
                          position: 'absolute',
                          top: rectData.top,
                          left: rectData.left,
                          width: '150px',
                          height: '60px',
                          transform: 'translateY(-100%)',
                        }}
                        className="rounded-sm bg-blue-200 border-2 border-blue-500"
                      >
                        <div className="absolute pl-1  text-xs font-mono bottom-0 left-0 leading-tight">
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
