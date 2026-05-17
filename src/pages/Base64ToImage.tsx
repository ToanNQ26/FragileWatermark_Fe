import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Base64ToImage = () => {
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleTxtFile = async (file: File) => {
  try {
    setError("");
    setImageUrl("");

    if (!file.name.toLowerCase().endsWith(".txt")) {
      setError("Vui lòng chọn file .txt.");
      return;
    }

    if (file.size === 0) {
      setError("File TXT rỗng.");
      return;
    }

    const base64Text = (await file.text()).trim();

    if (!base64Text) {
      setError("File TXT rỗng.");
      return;
    }

    const cleanBase64 = base64Text.includes(",")
      ? base64Text.split(",")[1]
      : base64Text;

    const normalizedBase64 = cleanBase64.replace(/\s/g, "");

    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

    if (
      !base64Regex.test(normalizedBase64) ||
      normalizedBase64.length % 4 !== 0
    ) {
      setError("Nội dung file không phải chuỗi Base64 hợp lệ.");
      return;
    }

    setImageUrl(`data:image/jpeg;base64,${normalizedBase64}`);
  } catch {
    setError("Không thể đọc file TXT.");
  }
};

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await handleTxtFile(file);
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLLabelElement>
  ) => {
    e.preventDefault();

    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    await handleTxtFile(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-cyan-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">
              Base64 to Image
            </h1>

            <p className="text-gray-500 mt-2">
              Chọn hoặc kéo thả file .txt chứa base64 để chuyển thành ảnh JPG.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition"
          >
            ← Trang chủ
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-white rounded-2xl shadow p-5 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">
              Input
            </h2>

            <label
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
                isDragging
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-300 hover:border-emerald-500"
              }`}
            >
              <input
                type="file"
                accept=".txt,text/plain"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="text-5xl mb-3">
                📄
              </div>

              <p className="font-medium text-gray-700">
                Chọn hoặc kéo thả file Base64 TXT
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Hỗ trợ file .txt chứa chuỗi base64
              </p>
            </label>

            {error && (
              <div className="mt-4 bg-red-100 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
          </div>

          {/* Result */}
          <div className="bg-white rounded-2xl shadow p-5 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">
              Result
            </h2>

            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt="Decoded"
                  className="w-full max-h-[420px] object-contain rounded-xl border"
                  onError={() =>
                    setError("Base64 không phải ảnh JPEG hợp lệ.")
                  }
                />

                <a
                  href={imageUrl}
                  download="decoded-from-base64.jpg"
                  className="inline-block mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-medium transition"
                >
                  Download JPG
                </a>
              </>
            ) : (
              <div className="h-64 border-2 border-dashed rounded-2xl flex items-center justify-center text-gray-400 text-center px-4">
                Ảnh sau khi decode sẽ hiển thị ở đây
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Base64ToImage;