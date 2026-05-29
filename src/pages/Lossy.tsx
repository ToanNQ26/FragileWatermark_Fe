// src/pages/Lossy.tsx

import { useState } from "react";
import FileDropzone from "../components/FileDropZone";
import { Link } from "react-router-dom";

import {
  embedDctImage,
  verifyDctImage,
  base64ToImageSrc,
} from "../services/lossy";

const Lossy = () => {
  const [file, setFile] = useState<File | null>(null);

  const [key, setKey] = useState("");

  const [mode, setMode] =
    useState<"embed" | "verify">("embed");

  const [resultImage, setResultImage] =
    useState("");

  const [resultImageBase64, setResultImageBase64] =
    useState("");

  const [verifyResult, setVerifyResult] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================
  // EMBED
  // =========================

  const handleEmbed = async () => {
    if (!file) {
      setError("Vui lòng chọn ảnh JPEG.");
      return;
    }

    const finalKey =
      key.trim() || "default";

    try {
      setLoading(true);
      setError("");
      setVerifyResult(null);

      const result =
        await embedDctImage({
          file,
          key: finalKey,
        });

      setResultImageBase64(
        result.image_base64
      );

      setResultImage(
        base64ToImageSrc(
          result.image_base64
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Embed thất bại."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFY
  // =========================

  const handleVerify = async () => {
    if (!file) {
      setError("Vui lòng chọn ảnh JPEG.");
      return;
    }

    const finalKey =
      key.trim() || "default";

    try {
      setLoading(true);

      setError("");

      setResultImage("");

      setResultImageBase64("");

      const result =
        await verifyDctImage({
          file,
          key: finalKey,
        });

      setVerifyResult(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Verify thất bại."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PROCESS
  // =========================

  const handleProcess = async () => {
  if (mode === "embed") {
    await handleEmbed();
  } else {
    await handleVerify();
  }
};

  // =========================
  // DOWNLOAD BASE64
  // =========================

  const handleDownloadBase64 =
    () => {
      if (!resultImageBase64)
        return;

      const blob = new Blob(
        [resultImageBase64],
        {
          type:
            "text/plain;charset=utf-8",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;

      a.download =
        "watermarked-base64.txt";

      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] p-6 flex justify-center">

      <div className="bg-[#1a1a2e]/80 backdrop-blur-lg p-6 rounded-xl shadow-2xl w-full max-w-6xl border border-[#00ffff]/20">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-6">

          <h1 className="text-2xl font-bold text-[#00ffff]">
            Lossy Watermark — DCT
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

            <p className="text-sm text-gray-400 mb-2">
              Input
            </p>

            {/* OPERATION MODE */}

            <div className="flex gap-3 mb-4">

              <button
                onClick={() =>
                  setMode("embed")
                }
                className={`px-4 py-2 rounded-lg ${
                  mode === "embed"
                    ? "bg-[#00ffff]/20 text-[#00ffff]"
                    : "bg-[#16213e]/40 text-gray-400"
                }`}
              >
                Embed
              </button>

              <button
                onClick={() =>
                  setMode("verify")
                }
                className={`px-4 py-2 rounded-lg ${
                  mode === "verify"
                    ? "bg-[#00ffff]/20 text-[#00ffff]"
                    : "bg-[#16213e]/40 text-gray-400"
                }`}
              >
                Verify
              </button>

            </div>

                        {/* BASIC MODE */}

    
              <>
                <FileDropzone
                  file={file}
                  onFileSelect={(
                    selectedFile
                  ) => {
                    setFile(
                      selectedFile
                    );

                    setResultImage(
                      ""
                    );

                    setResultImageBase64(
                      ""
                    );

                    setVerifyResult(
                      null
                    );

                    setError("");
                  }}
                  onRemove={() => {
                    setFile(null);

                    setResultImage("");

                    setResultImageBase64(
                      ""
                    );

                    setVerifyResult(
                      null
                    );

                    setError("");
                  }}
                  accept="image/jpeg,image/jpg"
                  description="JPG, JPEG (lossy / DCT)"
                  onError={setError}
                />

                {/* SECRET KEY */}

                <input
                  type="text"
                  placeholder="Secret key..."
                  value={key}
                  onChange={(e) =>
                    setKey(
                      e.target.value
                    )
                  }
                  className="mt-4 w-full border border-[#00ffff]/20 bg-[#16213e]/40 text-[#00ffff] placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50"
                />

                {/* ERROR */}

                {error && (
                  <div className="mt-4 bg-[#ff0000]/20 text-[#ff0000] px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                {/* PROCESS */}

                <button
                  onClick={
                    handleProcess
                  }
                  disabled={loading}
                  className="mt-4 w-full bg-linear-to-r from-[#00ffff]/20 to-[#ff00ff]/20 text-[#00ffff] py-3 rounded-lg hover:from-[#00ffff]/30 hover:to-[#ff00ff]/30 hover:shadow-[0_0_10px_5px_#00ffff30] active:scale-95"
                >
                  {loading
                    ? "Processing..."
                    : mode ===
                      "embed"
                    ? "Embed"
                    : "Verify"}
                </button>

              </>
          
          </div>

          {/* RIGHT */}

          <div>

            <p className="text-sm text-gray-400 mb-2">
              Result
            </p>

            <div className="bg-[#16213e]/40 rounded-xl p-4 min-h-105 border-2 border-dashed border-[#00ffff]/20 flex flex-col items-center justify-center">

              {/* EMPTY */}

              {!file && (
                <p className="text-gray-400">
                  Chưa có ảnh
                </p>
              )}

              {/* INPUT PREVIEW */}

              {file &&
                !resultImage &&
                !verifyResult && (
                  <img
                    src={URL.createObjectURL(
                      file
                    )}
                    className="rounded-lg max-h-80 object-contain opacity-50 border border-[#00ffff]/20"
                  />
                )}

              {/* EMBED RESULT */}

              {mode ===
                "embed" &&
                resultImage && (
                  <img
                    src={resultImage}
                    className="rounded-lg max-h-80 object-contain border border-[#00ffff]/20"
                  />
                )}

              {/* VERIFY RESULT */}

              {mode ===
                "verify" &&
                verifyResult && (
                  <div className="w-full text-center">

                    <p
                      className={`text-lg font-semibold ${
                        verifyResult.is_valid
                          ? "text-[#00ff00]"
                          : "text-[#ff0000]"
                      }`}
                    >
                      {verifyResult.is_valid
                        ? "✔ Ảnh hợp lệ"
                        : "⚠ Ảnh đã bị thay đổi"}
                    </p>

                    <p className="text-sm text-gray-400 mt-4">

                      {verifyResult.is_valid
                        ? "Watermark được xác minh thành công."
                        : "Watermark không còn khớp hoặc secret key không đúng."}

                    </p>

                    {!verifyResult
                      .is_valid &&
                      verifyResult.bit_errors !==
                        undefined && (
                        <div className="mt-5 inline-flex items-center rounded-full bg-[#ff0000]/20 px-4 py-2 text-xs text-[#ff4444]">

                          Hash mismatch :
                          {" "}
                          {
                            verifyResult.bit_errors
                          }
                          {" "}
                          bit

                        </div>
                      )}

                    {import.meta.env
                      .DEV && (
                      <details className="mt-6 text-left">

                        <summary className="cursor-pointer text-sm text-gray-400">

                          Chi tiết kỹ thuật

                        </summary>

                        <pre className="mt-4 overflow-auto rounded-xl bg-[#0f172a] p-4 text-xs text-gray-300 border border-[#00ffff]/20">

                          {JSON.stringify(
                            verifyResult,
                            null,
                            2
                          )}

                        </pre>

                      </details>
                    )}

                  </div>
                )}

            </div>

            {/* DOWNLOADS */}

            {mode ===
              "embed" &&
              resultImage && (
                <div className="mt-4 space-y-4">

                  <a
                    href={
                      resultImage
                    }
                    download="watermarked.jpg"
                    className="block w-full px-6 py-3 text-center bg-linear-to-r from-[#00ff00]/20 to-[#00ffff]/20 text-[#00ffff] rounded-lg hover:from-[#00ff00]/30 hover:to-[#00ffff]/30 hover:shadow-[0_0_10px_5px_#00ffff30]"
                  >
                    ⬇ Download
                    Image
                  </a>

                  <button
                    onClick={
                      handleDownloadBase64
                    }
                    className="w-full px-6 py-3 bg-linear-to-r from-[#ff00ff]/20 to-[#00ffff]/20 text-[#00ffff] rounded-lg hover:from-[#ff00ff]/30 hover:to-[#00ffff]/30 hover:shadow-[0_0_10px_5px_#00ffff30]"
                  >
                    ⬇ Download
                    Base64
                  </button>

                </div>
              )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Lossy;