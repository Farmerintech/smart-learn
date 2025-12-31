import { useState, useRef } from "react";
import { Nav } from "./nav/nav";
import { Document, Page, pdfjs } from "react-pdf";
import mammoth from "mammoth";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [docContent, setDocContent] = useState<string>("");
  const [highlightedText, setHighlightedText] = useState<string>("");
  const [showAIModal, setShowAIModal] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleFileUpload = async (file: File) => {
    setFile(file);
    setDocContent("");
    setHighlightedText("");
    setShowAIModal(false);

    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setDocContent(result.value);
    } else if (file.type === "application/pdf") {
      setDocContent("");
    } else {
      alert("Unsupported file type. Only PDF and DOCX are supported.");
    }
  };

  const handleTextHighlight = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== "") {
      setHighlightedText(selection.toString());

      // On mobile, show modal
      if (window.innerWidth < 768) {
        setShowAIModal(true);
      }
    }
  };

  return (
    <section className="bg-[#F0F1F0] min-h-screen">
      <header className="bg-white">
        <Nav onFileUpload={handleFileUpload} />
      </header>

      {file && (
        <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
          {/* Material Display (75%) */}
          <div
            className="w-full md:w-3/4 overflow-auto p-4"
            onMouseUp={handleTextHighlight}
            ref={contentRef}
          >
            {file.type === "application/pdf" && (
              <Document file={file}>
                <Page pageNumber={1} width={800} />
              </Document>
            )}

            {file.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
              <div className="whitespace-pre-wrap text-gray-800">{docContent}</div>
            )}
          </div>

          {/* AI Panel for Desktop */}
          <div className="hidden md:block w-1/4 bg-white p-4 overflow-auto border-l border-gray-200">
            <h2 className="font-bold mb-2">AI Explanation</h2>
            {highlightedText ? (
              <p>
                Highlighted: <span className="font-semibold">{highlightedText}</span>
                <br />
                AI Explanation will appear here based on selected text.
              </p>
            ) : (
              <p className="text-gray-400">Select text to get explanation.</p>
            )}
          </div>

          {/* AI Modal for Mobile */}
          {showAIModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 md:hidden">
              <div className="bg-white w-full rounded-lg p-4 max-h-[80vh] overflow-auto relative">
                <button
                  onClick={() => setShowAIModal(false)}
                  className="absolute top-2 right-2 text-gray-500 font-bold"
                >
                  X
                </button>
                <h2 className="font-bold mb-2">AI Explanation</h2>
                <p>
                  Highlighted: <span className="font-semibold">{highlightedText}</span>
                  <br />
                  AI Explanation will appear here based on selected text.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default App;
