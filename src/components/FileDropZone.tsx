
import { useRef, useState } from "react";

type Props = {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onRemove: () => void;

  accept?: string;
  description?: string;

  onError?: (message: string) => void;
};

const FileDropzone = ({
  file,
  onFileSelect,
  onRemove,
  accept = "*",
  description = "Chọn file",
  onError,
}: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const isAcceptedFile = (file: File) => {
    if (accept === "*") return true;

    const acceptedTypes = accept
      .split(",")
      .map((type) => type.trim().toLowerCase());

    return acceptedTypes.some((type) => {
      // validate extension
      if (type.startsWith(".")) {
        return file.name.toLowerCase().endsWith(type);
      }

      // validate mime type
      return file.type.toLowerCase() === type;
    });
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();

    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];

    if (!droppedFile) return;

    if (!isAcceptedFile(droppedFile)) {
      onError?.("File không hợp lệ");
      return;
    }

    onFileSelect(droppedFile);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!isAcceptedFile(selectedFile)) {
      onError?.("File không hợp lệ");
      e.target.value = "";
      return;
    }

    onFileSelect(selectedFile);
  };

  const handleRemove = () => {
    onRemove();

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition
        ${
          isDragging
            ? "bg-blue-50 border-blue-400"
            : "border-gray-300"
        }
      `}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          id="fileUpload"
          accept={accept}
          onChange={handleChange}
        />

        <label
          htmlFor="fileUpload"
          className="cursor-pointer"
        >
          <div className="text-4xl mb-2">
            {isDragging ? "📥" : "📁"}
          </div>

          <p className="text-gray-600 font-medium">
            {file
              ? file.name
              : isDragging
              ? "Thả file vào đây"
              : "Kéo & thả hoặc click để chọn file"}
          </p>

          <p className="text-sm text-gray-400 mt-1">
            {description}
          </p>
        </label>
      </div>

      {file && (
        <div className="mt-4 flex items-center gap-3">
          {file.type.startsWith("image/") && (
            <img
              src={URL.createObjectURL(file)}
              className="w-28 h-28 object-contain rounded-lg border opacity-80"
            />
          )}

          <button
            onClick={handleRemove}
            className="bg-red-500 text-white w-7 h-7 rounded-full hover:bg-red-600 shadow"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;