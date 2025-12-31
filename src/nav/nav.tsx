// nav/nav.tsx
import { useRef, useState } from "react";
import { BiFile, BiUpload } from "react-icons/bi";
import { FaBookOpen } from "react-icons/fa";

interface NavProps {
  onFileUpload: (file: File) => void;
}

export const Nav = ({ onFileUpload }: NavProps) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileUpload(file); // send file to App
    }
  };

  return (
    <nav className="py-3 px-4 flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4 md:gap-0">
      {/* Logo Section */}
      <div className="flex justify-start items-center gap-3 md:gap-5 w-full md:w-auto">
        <div className="bg-[#4052A6] w-[40px] h-[40px] text-white flex items-center justify-center rounded-xl">
          <FaBookOpen />
        </div>
        <div>
          <p className="font-bold text-[20px] md:text-[24px] text-[#312D29]">Lexicon</p>
          <p className="text-[12px] md:text-[14px] text-stone-600">Smart Academic Reader</p>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-3 md:gap-5 w-full md:w-auto">
        <div className="flex gap-2 items-center justify-center bg-[#F0F1F0] rounded-lg px-3 py-2 w-full md:w-auto">
          <BiFile color="#4052A6" />
          <p className="text-[12px] truncate">{fileName || "Demo: Quantum Mechanism"}</p>
        </div>

        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <button
          onClick={handleFileClick}
          className="flex text-[12px] font-bold gap-2 items-center justify-center text-white bg-[#4052A6] py-2 px-4 rounded-full w-full md:w-auto"
        >
          <BiUpload color="white" />
          {fileName ? "Change File" : "Open Course Material"}
        </button>
      </div>
    </nav>
  );
};
