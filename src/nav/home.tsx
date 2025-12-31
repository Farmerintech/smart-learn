// import { useState, useRef } from "react";
// import { Nav } from "./nav/nav";
// import { Document, Page, pdfjs } from "react-pdf";
// import mammoth from "mammoth";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// function App() {
//   const [file, setFile] = useState<File | null>(null);
//   const [docContent, setDocContent] = useState<string>("");
//   const [highlightedText, setHighlightedText] = useState<string>("");
//   const [aiExplanation, setAIExplanation] = useState<string>("");
//   const [showAIModal, setShowAIModal] = useState<boolean>(false);
//   const [loading, setLoading] = useState(false);

//   const contentRef = useRef<HTMLDivElement | null>(null);

//   const handleFileUpload = async (file: File) => {
//     setFile(file);
//     setDocContent("");
//     setHighlightedText("");
//     setAIExplanation("");
//     setShowAIModal(false);

//     if (
//       file.type ===
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//     ) {
//       const arrayBuffer = await file.arrayBuffer();
//       const result = await mammoth.extractRawText({ arrayBuffer });
//       setDocContent(result.value);
//     } else if (file.type === "application/pdf") {
//       setDocContent(""); // optional: can extract text if needed
//     } else {
//       alert("Unsupported file type. Only PDF and DOCX are supported.");
//     }
//   };

//   const fetchAIExplanation = async (text: string) => {
//     if (!text) return;
//     setLoading(true);
//     try {
//       const res = await fetch("https://api.openai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "gpt-4",
//           messages: [
//             {
//               role: "user",
//               content: `Explain the following highlighted text in detail based on the document content:\n\nHighlighted: ${text}\n\nDocument content: ${docContent || "N/A"}`,
//             },
//           ],
//           temperature: 0.7,
//         }),
//       });

//       const data = await res.json();
//       const explanation = data.choices?.[0]?.message?.content || "No explanation.";
//       setAIExplanation(explanation);
//     } catch (error) {
//       console.error(error);
//       setAIExplanation("Failed to generate explanation.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTextHighlight = () => {
//     const selection = window.getSelection();
//     if (selection && selection.toString().trim() !== "") {
//       const text = selection.toString();
//       setHighlightedText(text);
//       fetchAIExplanation(text);

//       if (window.innerWidth < 768) {
//         setShowAIModal(true);
//       }
//     }
//   };

//   return (
//     <section className="bg-[#F0F1F0] min-h-screen">
//       <header className="bg-white">
//         <Nav onFileUpload={handleFileUpload} />
//       </header>

//       {file && (
//         <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
//           {/* Material Display (75%) */}
//           <div
//             className="w-full md:w-3/4 overflow-auto p-4"
//             onMouseUp={handleTextHighlight}
//             ref={contentRef}
//           >
//             {file.type === "application/pdf" && (
//               <Document file={file}>
//                 <Page pageNumber={1} width={800} />
//               </Document>
//             )}
//             {file.type ===
//               "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
//               <div className="whitespace-pre-wrap text-gray-800">{docContent}</div>
//             )}
//           </div>

//           {/* AI Panel for Desktop */}
//           <div className="hidden md:block w-1/4 bg-white p-4 overflow-auto border-l border-gray-200">
//             <h2 className="font-bold mb-2">AI Explanation</h2>
//             {loading ? (
//               <p className="text-gray-500">Generating explanation...</p>
//             ) : highlightedText ? (
//               <p>{aiExplanation}</p>
//             ) : (
//               <p className="text-gray-400">Select text to get explanation.</p>
//             )}
//           </div>

//           {/* AI Modal for Mobile */}
//           {showAIModal && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 md:hidden">
//               <div className="bg-white w-full rounded-lg p-4 max-h-[80vh] overflow-auto relative">
//                 <button
//                   onClick={() => setShowAIModal(false)}
//                   className="absolute top-2 right-2 text-gray-500 font-bold"
//                 >
//                   X
//                 </button>
//                 <h2 className="font-bold mb-2">AI Explanation</h2>
//                 {loading ? (
//                   <p className="text-gray-500">Generating explanation...</p>
//                 ) : (
//                   <p>{aiExplanation}</p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </section>
//   );
// }

// export default App;
// import.meta.env.VITE_GEMINI_API_KEY
// import { useState, useRef } from "react";
// import { Nav } from "./nav/nav";
// import { Document, Page, pdfjs } from "react-pdf";
// import mammoth from "mammoth";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// function App() {
//   const [file, setFile] = useState<File | null>(null);
//   const [docContent, setDocContent] = useState<string>("");
//   const [highlightedText, setHighlightedText] = useState<string>("");
//   const [aiExplanation, setAIExplanation] = useState<string>("");
//   const [showAIModal, setShowAIModal] = useState<boolean>(false);
//   const [loading, setLoading] = useState(false);

//   const contentRef = useRef<HTMLDivElement | null>(null);

//   const handleFileUpload = async (file: File) => {
//     setFile(file);
//     setDocContent("");
//     setHighlightedText("");
//     setAIExplanation("");
//     setShowAIModal(false);

//     if (
//       file.type ===
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//     ) {
//       const arrayBuffer = await file.arrayBuffer();
//       const result = await mammoth.extractRawText({ arrayBuffer });
//       setDocContent(result.value);
//     } else if (file.type === "application/pdf") {
//       setDocContent(""); // optional: PDF text extraction can be added
//     } else {
//       alert("Unsupported file type. Only PDF and DOCX are supported.");
//     }
//   };

//   const fetchAIExplanation = async (text: string) => {
//     if (!text) return;
//     setLoading(true);

//     try {
//       const response = await fetch(
//         "https://api.generativeai.google/v1beta2/models/text-bison-001:generateText",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
//           },
//           body: JSON.stringify({
//             prompt: `Explain the following highlighted text in detail based on the document content:\n\nHighlighted: ${text}\n\nDocument content: ${docContent || "N/A"}`,
//             temperature: 0.7,
//             maxOutputTokens: 512,
//           }),
//         }
//       );

//       const data = await response.json();
//       const explanation =
//         data?.candidates?.[0]?.content || "No explanation received.";
//       setAIExplanation(explanation);
//     } catch (error) {
//       console.error(error);
//       setAIExplanation("Failed to generate explanation.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTextHighlight = () => {
//     const selection = window.getSelection();
//     if (selection && selection.toString().trim() !== "") {
//       const text = selection.toString();
//       setHighlightedText(text);
//       fetchAIExplanation(text);

//       if (window.innerWidth < 768) {
//         setShowAIModal(true);
//       }
//     }
//   };

//   return (
//     <section className="bg-[#F0F1F0] min-h-screen">
//       <header className="bg-white">
//         <Nav onFileUpload={handleFileUpload} />
//       </header>

//       {file && (
//         <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
//           {/* Material Display (75%) */}
//           <div
//             className="w-full md:w-3/4 overflow-auto p-4"
//             onMouseUp={handleTextHighlight}
//             ref={contentRef}
//           >
//             {file.type === "application/pdf" && (
//               <Document file={file}>
//                 <Page pageNumber={1} width={800} />
//               </Document>
//             )}
//             {file.type ===
//               "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
//               <div className="whitespace-pre-wrap text-gray-800">{docContent}</div>
//             )}
//           </div>

//           {/* AI Panel for Desktop */}
//           <div className="hidden md:block w-1/4 bg-white p-4 overflow-auto border-l border-gray-200">
//             <h2 className="font-bold mb-2">AI Explanation</h2>
//             {loading ? (
//               <p className="text-gray-500">Generating explanation...</p>
//             ) : highlightedText ? (
//               <p>{aiExplanation}</p>
//             ) : (
//               <p className="text-gray-400">Select text to get explanation.</p>
//             )}
//           </div>

//           {/* AI Modal for Mobile */}
//           {showAIModal && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 md:hidden">
//               <div className="bg-white w-full rounded-lg p-4 max-h-[80vh] overflow-auto relative">
//                 <button
//                   onClick={() => setShowAIModal(false)}
//                   className="absolute top-2 right-2 text-gray-500 font-bold"
//                 >
//                   X
//                 </button>
//                 <h2 className="font-bold mb-2">AI Explanation</h2>
//                 {loading ? (
//                   <p className="text-gray-500">Generating explanation...</p>
//                 ) : (
//                   <p>{aiExplanation}</p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </section>
//   );
// }

// export default App;

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "How does AI work?",
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    }
  });
  console.log(response.text);
}

await main();