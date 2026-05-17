import { useState } from "react";
import FileDropzone from "../components/FileDropZone";
import { embedImage, verifyImage } from "../services/api";
import { Link } from "react-router-dom";

const Lossless = () => {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState("");
  const [mode, setMode] = useState<"embed" | "verify">("embed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleProcess = async () => {
    if (!file) {
    setError("Vui lòng chọn ảnh.");
    return;
  }

    setLoading(true);
    setResult(null);
    try {
      const data =
        mode === "embed"
          ? await embedImage(file, key)
          : await verifyImage(file, key);

      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Lỗi khi xử lý");
    }

    setLoading(false);
  };

  const handleDownload = () => {
    if (!result?.image_base64) return;

    const a = document.createElement("a");

    a.href = result.image_base64;
    a.download = "watermarked.png";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isValid = result?.is_valid;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-6xl">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Lossless Watermark
          </h1>

          <Link
            to="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            ← Trang chủ
          </Link>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Input</p>

            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setMode("embed")}
                className={`px-4 py-2 rounded-lg ${
                  mode === "embed"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Embed
              </button>

              <button
                onClick={() => setMode("verify")}
                className={`px-4 py-2 rounded-lg ${
                  mode === "verify"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Verify
              </button>
            </div>

            <FileDropzone
              file={file}
              onFileSelect={(selectedFile) => {
                setFile(selectedFile);
                setError("");
              }}
              onRemove={() => {
                setFile(null);
                setError("");
              }}
              accept="image/png,image/bmp,image/tiff"
              description="PNG, BMP, TIFF (lossless)"
              onError={setError}
            />

            <input
              type="text"
              placeholder="Secret key..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="mt-4 w-full border p-3 rounded-lg"
            />

            {error && (
              <div className="mt-4 bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleProcess}
              disabled={loading}
              className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg hover:opacity-90"
            >
              {loading
                ? "Processing..."
                : mode === "embed"
                ? "Embed"
                : "Verify"}
            </button>
          </div>

          {/* RIGHT */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Result</p>

            <div className="bg-gray-50 rounded-xl p-4 min-h-[400px] border-2 border-dashed flex flex-col items-center justify-center">

              {/* NO FILE */}
              {!file && (
                <p className="text-gray-400">Chưa có ảnh</p>
              )}

              {/* PREVIEW */}
              {file && !result && (
                <img
                  src={URL.createObjectURL(file)}
                  className="rounded-lg max-h-[300px] object-contain opacity-50"
                />
              )}

              {/* EMBED RESULT */}
                {mode === "embed" && result?.image_base64 && (
                  <img
                    src={result.image_base64}
                    className="rounded-lg max-h-[300px] object-contain"
                  />
                )}

              {/* VERIFY RESULT */}
              {mode === "verify" && result && (
                <div className="w-full text-center">

                  {/* STATUS */}
                  <p
                    className={`text-lg font-semibold ${
                      isValid ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isValid
                      ? "✔ Ảnh không bị chỉnh sửa"
                      : "⚠ Ảnh đã bị chỉnh sửa"}
                  </p>

                  {/* STATS */}
                  <p className="text-sm text-gray-500 mt-2">
                    {result.tamper_count} / {result.total_blocks} blocks bị thay đổi
                  </p>

                  <div className="grid grid-cols-2 gap-6 mt-4">
                    {/* OVERLAY */}
                    <div>
                      <p className="text-gray-500">Overlay:</p>
                      {result.overlay_base64 && (
                        <img
                          src={`data:image/png;base64,${result.overlay_base64}`}
                          className="mt-4 rounded-lg border max-h-[150px] object-contain mx-auto"
                        />
                      )}
                    </div>

                    {/* MASK */}
                    <div>
                      <p className="text-gray-500">Mask:</p>
                      {result.mask_base64 && (
                        <img
                          src={`data:image/png;base64,${result.mask_base64}`}
                          className="mt-4 rounded-lg border max-h-[150px] object-contain mx-auto"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DOWNLOAD */}
            {mode === "embed" && result?.image_base64 && (
              <div className="mt-4">
                <button
                  onClick={handleDownload}
                  className="w-full px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:opacity-90 shadow"
                >
                  ⬇ Download Image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lossless;