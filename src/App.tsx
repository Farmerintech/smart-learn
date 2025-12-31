import { useState, useRef } from "react";
import { Nav } from "./nav/nav";
import { Document, Page, pdfjs } from "react-pdf";
import mammoth from "mammoth";
import { MdCancel } from "react-icons/md";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [docContent, setDocContent] = useState<string>("");
  const [highlightedText, setHighlightedText] = useState<string>("");
  const [aiExplanation, setAIExplanation] = useState<string>("");
  const [showAIModal, setShowAIModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleFileUpload = async (file: File) => {
    setFile(file);
    setDocContent("");
    setHighlightedText("");
    setAIExplanation("");
    setShowAIModal(false);

    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setDocContent(result.value);
    } else if (file.type === "application/pdf") {
      setDocContent(""); // optional: PDF text extraction later
    } else {
      alert("Unsupported file type. Only PDF and DOCX are supported.");
    }
  };

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  const fetchAIExplanation = async (text: string) => {
    if (!text) return;
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Explain the following highlighted text in detail based on the document content:\n\nHighlighted: ${text}\nDocument: ${docContent || "N/A"}`,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
        },
      });
      setAIExplanation(response.text || "");
    } catch (error) {
      console.error(error);
      setAIExplanation("Failed to generate explanation.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextHighlight = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== "") {
      const text = selection.toString();
      setHighlightedText(text);
      fetchAIExplanation(text);

      if (window.innerWidth < 768) {
        setShowAIModal(true);
      }
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <section className="bg-[#F0F1F0] min-h-screen md:px-8 px-3 lg:px-16 py-4 mb-8">
       <header className="bg-white fixed top-0 left-0 right-0 z-50 shadow-md">
    <Nav onFileUpload={handleFileUpload} />
  </header>

      {file && (
        <div className="flex flex-col md:flex-row h-screen px-2 md:px-8 bg-white mt-36 md:mt-16 rounded-3xl ">
          {/* Material Display (75%) */}
          <div
            className="w-full md:w-3/4 overflow-auto p-4"
            onMouseUp={handleTextHighlight}
            ref={contentRef}
          >
            {file.type === "application/pdf" && (
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <div key={`page_${index}`} className="mb-4">
                    <Page pageNumber={index + 1} width={800} />
                  </div>
                ))}
              </Document>
            )}

            {file.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
              <div className="whitespace-pre-wrap text-gray-800">{docContent}</div>
            )}
          </div>

          {/* AI Panel for Desktop */}
          <div className="hidden md:block w-1/4 p-4 overflow-auto border-l bg-white py-5 border-gray-200">
            <h2 className="font-bold mb-2">AI Explanation</h2>
            {loading ? (
              <p className="text-gray-500">Generating explanation...</p>
            ) : highlightedText ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {aiExplanation || "Waiting for AI explanation..."}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400">Select text to get explanation.</p>
            )}
          </div>

          {/* AI Modal for Mobile */}
          {showAIModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:hidden">
              <div className="bg-white w-full rounded-lg p-4 max-h-[80vh] overflow-auto relative">
                <button
                  onClick={() => setShowAIModal(false)}
                  className="absolute top-2 right-2 text-gray-500 font-bold"
                >
                  <MdCancel size={20} />
                </button>
                <h2 className="font-bold mb-2">AI Explanation</h2>
                {loading ? (
                  <p className="text-gray-500">Generating explanation...</p>
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {aiExplanation || "Waiting for AI explanation..."}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default App;
