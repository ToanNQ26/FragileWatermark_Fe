import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] flex items-center justify-center px-4">
      <div className="bg-[#1a1a2e]/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-5xl border border-[#00ffff]/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00ffff]">
            Fragile Watermark
          </h1>
          <p className="text-gray-400 mt-2">
            Chọn phương pháp xử lý watermark
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => navigate("/lossless")}
            className="cursor-pointer p-6 rounded-xl border border-[#00ffff]/20 bg-[#16213e]/40 hover:bg-[#16213e]/60 hover:shadow-[0_0_15px_5px_#00ffff30] transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-3xl mb-2">🔒</div>
            <h2 className="text-lg font-semibold text-[#00ffff]">Lossless</h2>
            <p className="text-gray-400 mt-2">
              Không làm thay đổi dữ liệu ảnh
            </p>
          </div>

          <div
            onClick={() => navigate("/lossy")}
            className="cursor-pointer p-6 rounded-xl border border-[#00ffff]/20 bg-[#16213e]/40 hover:bg-[#16213e]/60 hover:shadow-[0_0_15px_5px_#00ffff30] transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-3xl mb-2">🗜️</div>
            <h2 className="text-lg font-semibold text-[#00ffff]">Lossy</h2>
            <p className="text-sm text-gray-400 mt-2">
              Cho phép thay đổi nhẹ để tối ưu watermark
            </p>
          </div>

          <div
            onClick={() => navigate("/base64-to-image")}
            className="cursor-pointer p-6 rounded-xl border border-[#00ffff]/20 bg-[#16213e]/40 hover:bg-[#16213e]/60 hover:shadow-[0_0_15px_5px_#00ffff30] transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-3xl mb-2">🔄</div>
            <h2 className="text-lg font-semibold text-[#00ffff]">
              Base64 to Image
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Giải mã file base64 .txt thành ảnh JPG
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;