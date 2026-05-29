// src/pages/Base64ToImage.tsx

import { useState } from "react";
import { Link } from "react-router-dom";

const Base64ToImage = () => {

  const [imageUrl, setImageUrl] =
    useState("");

  const [error, setError] =
    useState("");

  const [isDragging, setIsDragging] =
    useState(false);
  const [isJpg, setIsJpg] = useState(true);

  const isJpgBase64 = (base64: string): boolean => {
    const clean = base64.replace(/^data:image\/\w+;base64,/, "");
    const binary = atob(clean);

    const bytes = new Uint8Array(
      [...binary].map(c => c.charCodeAt(0))
    );

    // JPEG signature: FF D8 FF
    return (
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff
    );
  }

  const handleTxtFile = async (
    file: File
  ) => {
    try {

      setError("");
      setImageUrl("");

      if (
        !file.name
          .toLowerCase()
          .endsWith(".txt")
      ) {
        setError(
          "Vui lòng chọn file .txt."
        );
        return;
      }

      if (file.size === 0) {
        setError("File TXT rỗng.");
        return;
      }

      const base64Text =
        (await file.text()).trim();

      if (!base64Text) {
        setError("File TXT rỗng.");
        return;
      }

      const cleanBase64 =
        base64Text.includes(",")
          ? base64Text.split(",")[1]
          : base64Text;

      const normalizedBase64 =
        cleanBase64.replace(
          /\s/g,
          ""
        );

      const base64Regex =
        /^[A-Za-z0-9+/]+={0,2}$/;

      if (
        !base64Regex.test(
          normalizedBase64
        ) ||
        normalizedBase64.length %
          4 !==
          0
      ) {
        setError(
          "Nội dung file không phải chuỗi Base64 hợp lệ."
        );
        return;
      }

      const fullBase64 = normalizedBase64;

      const isJpgImage = isJpgBase64(fullBase64);

      setIsJpg(isJpgImage);

      setImageUrl(
        `data:image/${isJpgImage ? "jpeg" : "png"};base64,${fullBase64}`
      );

    } catch {

      setError(
        "Không thể đọc file TXT."
      );

    }
  };

  const handleFileChange =
    async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      const file =
        e.target.files?.[0];

      if (!file) return;

      await handleTxtFile(file);
    };

  const handleDrop = async (
    e: React.DragEvent<HTMLLabelElement>
  ) => {

    e.preventDefault();

    setIsDragging(false);

    const file =
      e.dataTransfer.files?.[0];

    if (!file) return;

    await handleTxtFile(file);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] p-6 flex justify-center ">
      <div className="bg-[#1a1a2e]/80 backdrop-blur-lg p-6 rounded-xl shadow-2xl w-full max-w-6xl border border-[#00ffff]/20 ">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-6">

          <div>

            <h1 className="text-2xl font-bold text-[#00ffff]">
              Base64 To Image
            </h1>

            <p className="text-sm text-gray-400 mt-2">
              Decode file TXT chứa Base64 thành ảnh JPG.
            </p>

          </div>

          <Link
            to="/"
            className="px-4 py-2 bg-[#00ffff]/20 text-[#00ffff] rounded-lg hover:bg-[#00ffff]/30 transition"
          >
            ← Trang chủ
          </Link>

        </div>

        {/* MAIN */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* INPUT */}

          <div>

            <p className="text-sm text-gray-400 mb-2">
              Input
            </p>

            <label

              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}

              onDragLeave={() =>
                setIsDragging(false)
              }

              onDrop={handleDrop}

              className={`block rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${
                isDragging
                  ? "border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/30"
                  : "border-cyan-500/20 bg-slate-900/40 hover:border-cyan-400/60"
              }`}
            >

              <input
                type="file"
                accept=".txt,text/plain"
                onChange={
                  handleFileChange
                }
                className="hidden"
              />

              <div className="text-6xl mb-4">
                📄
              </div>

              <p className="font-medium text-[#00ffff]">

                Chọn hoặc kéo thả file TXT

              </p>

              <p className="text-sm text-gray-500 mt-3">

                Hỗ trợ file chứa chuỗi Base64

              </p>

            </label>

            {/* ERROR */}

            {error && (

              <div className="mt-4 bg-[#ff0000]/20 text-[#ff4444] px-4 py-3 rounded-xl text-sm">

                {error}

              </div>

            )}

            {/* INFO PANEL */}

            <div className="mt-6 bg-[#16213e]/40 rounded-xl border border-[#ff00ff]/20 p-5">

              <h3 className="text-[#ff00ff] font-semibold mb-3">

                Decode Pipeline

              </h3>

              <div className="space-y-2 text-sm text-gray-400">

                <div>
                  • TXT Upload
                </div>

                <div>
                  • Base64 Validation
                </div>

                <div>
                  • Decode JPEG Stream
                </div>

                <div>
                  • Render Preview
                </div>

              </div>

            </div>

          </div>

          {/* RESULT */}

          <div>

            <p className="text-sm text-gray-400 mb-2">
              Result
            </p>

            <div className="bg-[#16213e]/40 rounded-xl p-4 min-h-105 border-2 border-dashed border-[#00ffff]/20 flex flex-col items-center justify-center text-center">

              {!imageUrl && (

                <div>

                  <div className="text-6xl mb-4 opacity-50">

                    🖼️

                  </div>

                  <p className="text-gray-400">

                    Ảnh sau khi decode
                    sẽ hiển thị ở đây

                  </p>

                </div>

              )}

              {imageUrl && (

                <img
                  src={imageUrl}
                  alt="Decoded"
                  onError={() =>
                    setError(
                      "Base64 không phải ảnh JPEG hợp lệ."
                    )
                  }
                  className="rounded-lg max-h-80 object-contain border border-[#00ffff]/20"
                />

              )}

            </div>

            {/* DOWNLOAD */}

            {imageUrl && (

              <div className="mt-4">

                <a
                  href={imageUrl}
                  download={`decoded-from-base64.${isJpg ? "jpg" : "png"}`}
                  className="block w-full px-6 py-3 text-center bg-linear-to-r from-[#00ff00]/20 to-[#00ffff]/20 text-[#00ffff] rounded-lg hover:from-[#00ff00]/30 hover:to-[#00ffff]/30 hover:shadow-[0_0_10px_5px_#00ffff30]"
                >

                  ⬇ Download Image

                </a>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Base64ToImage;