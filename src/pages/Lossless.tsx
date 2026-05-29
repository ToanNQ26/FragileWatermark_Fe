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


  const handleDownloadBase64 = () => {
    if (!result?.image_base64) return;

    const base64 = result.image_base64;

    const blob = new Blob([base64], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "watermarked-base64.txt";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

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
    <div className="min-h-screen bg-linear-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] p-6 flex justify-center">
      <div className="bg-[#1a1a2e]/80 backdrop-blur-lg p-6 rounded-xl shadow-2xl w-full max-w-6xl border border-[#00ffff]/20">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#00ffff]">
            Lossless Watermark
          </h1>

          <Link
            to="/"
            className="px-4 py-2 bg-[#00ffff]/20 text-[#00ffff] rounded-lg hover:bg-[#00ffff]/30 transition"
          >
            ← Trang chủ
          </Link>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Input</p>

            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setMode("embed")}
                className={`px-4 py-2 rounded-lg ${
                  mode === "embed"
                    ? "bg-[#00ffff]/20 text-[#00ffff]"
                    : "bg-[#16213e]/40 text-gray-400"
                }`}
              >
                Embed
              </button>

              <button
                onClick={() => setMode("verify")}
                className={`px-4 py-2 rounded-lg ${
                  mode === "verify"
                    ? "bg-[#00ffff]/20 text-[#00ffff]"
                    : "bg-[#16213e]/40 text-gray-400"
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
              className="mt-4 w-full border border-[#00ffff]/20 bg-[#16213e]/40 text-[#00ffff] placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50"
            />

            {error && (
              <div className="mt-4 bg-[#ff0000]/20 text-[#ff0000] px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleProcess}
              disabled={loading}
              className="mt-4 w-full bg-linear-to-r from-[#00ffff]/20 to-[#ff00ff]/20 text-[#00ffff] py-3 rounded-lg hover:from-[#00ffff]/30 hover:to-[#ff00ff]/30 hover:shadow-[0_0_10px_5px_#00ffff30] active:scale-95"
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
            <p className="text-sm text-gray-400 mb-2">Result</p>

            <div className="bg-[#16213e]/40 rounded-xl p-4 min-h-100 border-2 border-dashed border-[#00ffff]/20 flex flex-col items-center justify-center">

              {/* NO FILE */}
              {!file && (
                <p className="text-gray-400">Chưa có ảnh</p>
              )}

              {/* PREVIEW */}
              {file && !result && (
                <img
                  src={URL.createObjectURL(file)}
                  className="rounded-lg max-h-75 object-contain opacity-50 border border-[#00ffff]/20"
                />
              )}

              {/* EMBED RESULT */}
                {mode === "embed" && result?.image_base64 && (
                  <img
                    src={result.image_base64}
                    className="rounded-lg max-h-75 object-contain border border-[#00ffff]/20"
                  />
                )}

              {/* VERIFY RESULT */}
              {mode === "verify" && result && (
                <div className="w-full text-center">

                  {/* STATUS */}
                  <p
                    className={`text-lg font-semibold ${
                      isValid ? "text-[#00ff00]" : "text-[#ff0000]"
                    }`}
                  >
                    {isValid
                      ? "✔ Ảnh không bị chỉnh sửa"
                      : "⚠ Ảnh đã bị chỉnh sửa"}
                  </p>

                  {/* STATS */}
                  <p className="text-sm text-gray-400 mt-2">
                    {result.tamper_count} / {result.total_blocks} blocks bị thay đổi
                  </p>

                  <div className="grid grid-cols-2 gap-6 mt-4">
                    {/* OVERLAY */}
                    <div>
                      <p className="text-gray-400">Overlay:</p>
                      {result.overlay_base64 && (
                        <img
                          src={`data:image/png;base64,${result.overlay_base64}`}
                          className="mt-4 rounded-lg border max-h-37.5 object-contain mx-auto border-[#00ffff]/20"
                        />
                      )}
                    </div>

                    {/* MASK */}
                    <div>
                      <p className="text-gray-400">Mask:</p>
                      {result.mask_base64 && (
                        <img
                          src={`data:image/png;base64,${result.mask_base64}`}
                          className="mt-4 rounded-lg border max-h-37.5 object-contain mx-auto border-[#00ffff]/20"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DOWNLOAD */}
            {mode === "embed" && result?.image_base64 && (
              <div className="mt-4 space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full px-6 py-2 bg-linear-to-r from-[#00ff00]/20 to-[#00ffff]/20 text-[#00ffff] rounded-lg hover:from-[#00ff00]/30 hover:to-[#00ffff]/30 hover:shadow-[0_0_10px_5px_#00ffff30] shadow"
                >
                  ⬇ Download Image
                </button>

                <button
                  onClick={handleDownloadBase64}
                  className="w-full px-6 py-2 bg-linear-to-r from-[#ff00ff]/20 to-[#00ffff]/20 text-[#00ffff] rounded-lg hover:from-[#ff00ff]/30 hover:to-[#00ffff]/30 hover:shadow-[0_0_10px_5px_#00ffff30]"
                >
                  ⬇ Download Base64
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