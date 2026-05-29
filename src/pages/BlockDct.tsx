import { useState } from "react";
import FileDropzone from "../components/FileDropZone";
import { Link } from "react-router-dom";
import {
  embedDctBlock,
  tamperDctBlock,
  verifyDctBlock,
  base64ToImageSrc,
} from "../services/blockDct";

const REGIONS = [
  "center",
  "all",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "random",
];

const BlockDct = () => {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState("");
  const [region, setRegion] = useState("center");
  const [mode, setMode] = useState<"embed" | "tamper" | "verify">("embed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [resultImage, setResultImage] = useState("");
  const [resultImageBase64, setResultImageBase64] = useState("");
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const resetResult = () => {
    setResultImage("");
    setResultImageBase64("");
    setVerifyResult(null);
    setError("");
  };

  const handleEmbed = async () => {
    if (!file) { setError("Vui lòng chọn ảnh JPEG."); return; }
    const finalKey = key.trim() || "default";
    setLoading(true);
    setError("");
    setVerifyResult(null);
    try {
      const result = await embedDctBlock({ file, key: finalKey });
      setResultImageBase64(result.image_base64);
      setResultImage(base64ToImageSrc(result.image_base64));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Embed thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleTamper = async () => {
    if (!file) { setError("Vui lòng chọn ảnh JPEG."); return; }
    setLoading(true);
    setError("");
    setVerifyResult(null);
    try {
      const result = await tamperDctBlock({ file, region });
      setResultImageBase64(result.image_base64);
      setResultImage(base64ToImageSrc(result.image_base64));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tamper thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!file) { setError("Vui lòng chọn ảnh JPEG."); return; }
    const finalKey = key.trim() || "default";
    setLoading(true);
    setError("");
    setResultImage("");
    setResultImageBase64("");
    try {
      const result = await verifyDctBlock({ file, key: finalKey });
      setVerifyResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verify thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    if (mode === "embed") await handleEmbed();
    else if (mode === "tamper") await handleTamper();
    else await handleVerify();
  };

  const handleDownloadBase64 = () => {
    if (!resultImageBase64) return;
    const blob = new Blob([resultImageBase64], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "watermarked-base64.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] p-6 flex justify-center">
      <div className="bg-[#1a1a2e]/80 backdrop-blur-lg p-6 rounded-xl shadow-2xl w-full max-w-6xl border border-[#00ffff]/20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#00ffff]">
            Block DCT Watermark
          </h1>
          <Link to="/" className="px-4 py-2 bg-[#00ffff]/20 text-[#00ffff] rounded-lg hover:bg-[#00ffff]/30 transition">
            ← Trang chủ
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-gray-400 mb-2">Input</p>

            <div className="flex gap-3 mb-4">
              {(["embed", "tamper", "verify"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); resetResult(); }}
                  className={`px-4 py-2 rounded-lg ${
                    mode === m
                      ? "bg-[#00ffff]/20 text-[#00ffff]"
                      : "bg-[#16213e]/40 text-gray-400"
                  }`}
                >
                  {m === "embed" ? "Embed" : m === "tamper" ? "Tamper" : "Verify"}
                </button>
              ))}
            </div>

            <FileDropzone
              file={file}
              onFileSelect={(selectedFile) => {
                setFile(selectedFile);
                resetResult();
              }}
              onRemove={() => {
                setFile(null);
                resetResult();
              }}
              accept="image/jpeg,image/jpg"
              description="JPG, JPEG (DCT block)"
              onError={setError}
            />

            {mode !== "tamper" && (
              <input
                type="text"
                placeholder="Secret key..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="mt-4 w-full border border-[#00ffff]/20 bg-[#16213e]/40 text-[#00ffff] placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50"
              />
            )}

            {mode === "tamper" && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Vùng tác động:</p>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRegion(r)}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        region === r
                          ? "bg-[#ff00ff]/20 text-[#ff00ff]"
                          : "bg-[#16213e]/40 text-gray-400"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                : mode === "tamper"
                ? "Tamper"
                : "Verify"}
            </button>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">Result</p>
            <div className="bg-[#16213e]/40 rounded-xl p-4 min-h-105 border-2 border-dashed border-[#00ffff]/20 flex flex-col items-center justify-center">
              {!file && (
                <p className="text-gray-400">Chưa có ảnh</p>
              )}

              {file && !resultImage && !verifyResult && (
                <img
                  src={URL.createObjectURL(file)}
                  className="rounded-lg max-h-80 object-contain opacity-50 border border-[#00ffff]/20"
                />
              )}

              {(mode === "embed" || mode === "tamper") && resultImage && (
                <img
                  src={resultImage}
                  className="rounded-lg max-h-80 object-contain border border-[#00ffff]/20"
                />
              )}

              {mode === "verify" && verifyResult && (
                <div className="w-full text-center">
                  <p className={`text-lg font-semibold ${
                    verifyResult.is_valid ? "text-[#00ff00]" : "text-[#ff0000]"
                  }`}>
                    {verifyResult.is_valid
                      ? "✔ Ảnh hợp lệ"
                      : "⚠ Ảnh đã bị thay đổi"}
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    {verifyResult.tamper_count} / {verifyResult.total_blocks} blocks bị thay đổi
                  </p>

                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div>
                      <p className="text-gray-400">Overlay:</p>
                      {verifyResult.overlay_base64 && (
                        <img
                          src={`data:image/png;base64,${verifyResult.overlay_base64}`}
                          className="mt-4 rounded-lg border max-h-40 object-contain mx-auto border-[#00ffff]/20"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-gray-400">Mask:</p>
                      {verifyResult.mask_base64 && (
                        <img
                          src={`data:image/png;base64,${verifyResult.mask_base64}`}
                          className="mt-4 rounded-lg border max-h-40 object-contain mx-auto border-[#00ffff]/20"
                        />
                      )}
                    </div>
                  </div>

                  {import.meta.env.DEV && (
                    <details className="mt-6 text-left">
                      <summary className="cursor-pointer text-sm text-gray-400">
                        Chi tiết kỹ thuật
                      </summary>
                      <pre className="mt-4 overflow-auto rounded-xl bg-[#0f172a] p-4 text-xs text-gray-300 border border-[#00ffff]/20">
                        {JSON.stringify(verifyResult, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>

            {(mode === "embed" || mode === "tamper") && resultImage && (
              <div className="mt-4 space-y-4">
                <a
                  href={resultImage}
                  download={mode === "embed" ? "watermarked.jpg" : "tampered.jpg"}
                  className="block w-full px-6 py-3 text-center bg-linear-to-r from-[#00ff00]/20 to-[#00ffff]/20 text-[#00ffff] rounded-lg hover:from-[#00ff00]/30 hover:to-[#00ffff]/30 hover:shadow-[0_0_10px_5px_#00ffff30]"
                >
                  ⬇ Download Image
                </a>
                <button
                  onClick={handleDownloadBase64}
                  className="w-full px-6 py-3 bg-linear-to-r from-[#ff00ff]/20 to-[#00ffff]/20 text-[#00ffff] rounded-lg hover:from-[#ff00ff]/30 hover:to-[#00ffff]/30 hover:shadow-[0_0_10px_5px_#00ffff30]"
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

export default BlockDct;
