// src/pages/Lossy.tsx

import { useState } from "react";
import FileDropzone from "../components/FileDropZone";
import { useNavigate } from "react-router-dom";

import {
  embedDctImage,
  verifyDctImage,
  base64ToImageSrc,
} from "../services/lossy";

const Lossy = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState("");

  const [resultImage, setResultImage] = useState("");
  const [resultImageBase64, setResultImageBase64] = useState("");
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // EMBED
  // =========================
  const handleEmbed = async () => {
    if (!file) {
      setError("Vui lòng chọn ảnh JPEG.");
      return;
    }

    const finalKey = key.trim() || "default";

    try {
      setLoading(true);
      setError("");
      setVerifyResult(null);

      const result = await embedDctImage({
        file,
        key: finalKey,
      });

      setResultImageBase64(result.image_base64);
      setResultImage(
        base64ToImageSrc(result.image_base64)
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

    const finalKey = key.trim() || "default";

    try {
      setLoading(true);
      setError("");
      setResultImage("");
      setResultImageBase64("");

      const result = await verifyDctImage({
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

  const handleDownloadBase64 = () => {
    if (!resultImageBase64) return;

    const blob = new Blob(
      [resultImageBase64],
      { type: "text/plain;charset=utf-8" }
    );

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
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Lossy Watermark - DCT
            </h1>

            <p className="text-gray-500 mt-2">
              Fragile watermark cho ảnh JPEG bằng DCT.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="
              bg-blue-500
              hover:bg-blue-600
              text-white
              px-5
              py-3
              rounded-xl
              font-medium
              transition
              w-full
              md:w-auto
            "
          >
            ← Trang chủ
          </button>
        </div>

        {/* MAIN */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-5">
              Input
            </h2>

            {/* DROPZONE */}
            <FileDropzone
              file={file}
              onFileSelect={(selectedFile) => {
                setFile(selectedFile);
                setResultImage("");
                setResultImageBase64("");
                setVerifyResult(null);
                setError("");
              }}
              onRemove={() => {
                setFile(null);
                setResultImage("");
                setResultImageBase64("");
                setVerifyResult(null);
                setError("");
              }}
              accept="image/jpeg,image/jpg"
              description="JPG, JPEG (lossy / DCT)"
              onError={setError}
            />

            {/* KEY */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret key
              </label>

              <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Nhập secret key..."
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-4 bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEmbed}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition disabled:opacity-60"
              >
                {loading ? "Processing..." : "Embed"}
              </button>

              <button
                onClick={handleVerify}
                disabled={loading}
                className="bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-xl font-medium transition disabled:opacity-60"
              >
                {loading ? "Processing..." : "Verify"}
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-5">
              Result
            </h2>

            {/* IMAGE RESULT */}
            {resultImage && (
              <div>
                <img
                  src={resultImage}
                  alt="Embedded Result"
                  className="w-full max-h-[420px] object-contain rounded-xl border"
                />

                <a
                  href={resultImage}
                  download="watermarked.jpg"
                  className=" mt-4 block bg-green-600 text-center hover:bg-green-700 text-white px-5 py-3 rounded-xl font-medium"
                >
                  Download Image
                </a>

                <button
                  onClick={handleDownloadBase64}
                  type="button"
                  className=" w-full block mt-4 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 rounded-xl font-medium"
                >
                  Download Base64 Image
                </button>
              </div>
            )}

            {/* VERIFY RESULT */}
            {/* VERIFY RESULT */}
            {!resultImage && verifyResult && (
              <div
                className={`rounded-2xl border p-6 transition-all ${
                  verifyResult.is_valid
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-3xl font-bold ${
                      verifyResult.is_valid
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {verifyResult.is_valid ? "✓" : "!"}
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`text-xl font-semibold ${
                        verifyResult.is_valid
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {verifyResult.is_valid
                        ? "Ảnh hợp lệ"
                        : "Ảnh đã bị thay đổi"}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {verifyResult.is_valid
                        ? "Watermark được xác minh thành công. Ảnh chưa bị chỉnh sửa."
                        : "Watermark không còn khớp. Ảnh có thể đã bị chỉnh sửa hoặc secret key không chính xác."}
                    </p>

                    {!verifyResult.is_valid &&
                      verifyResult.bit_errors !== undefined && (
                        <div className="mt-4 inline-flex items-center rounded-full bg-red-100 px-4 py-2 text-xs font-medium text-red-700">
                          Hash mismatch: {verifyResult.bit_errors} bit
                        </div>
                      )}
                  </div>
                </div>

                {import.meta.env.DEV && (
                  <details className="mt-5">
                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                      Chi tiết kỹ thuật
                    </summary>

                    <pre className="mt-3 overflow-auto rounded-xl bg-white p-4 text-xs text-gray-700 border">
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

            {/* EMPTY */}
            {!resultImage && !verifyResult && (
              <div className="h-[320px] border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400">
                Chưa có kết quả
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lossy;
