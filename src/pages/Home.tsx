import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Fragile Watermark
          </h1>
          <p className="text-gray-500 mt-2">
            Chọn phương pháp xử lý watermark
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => navigate("/lossless")}
            className="cursor-pointer p-6 rounded-xl border hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="text-3xl mb-2">🟦</div>
            <h2 className="text-lg font-semibold text-blue-600">Lossless</h2>
            <p className="text-sm text-gray-500 mt-2">
              Không làm thay đổi dữ liệu ảnh
            </p>
          </div>

          <div
            onClick={() => navigate("/lossy")}
            className="cursor-pointer p-6 rounded-xl border hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="text-3xl mb-2">🟪</div>
            <h2 className="text-lg font-semibold text-purple-600">Lossy</h2>
            <p className="text-sm text-gray-500 mt-2">
              Cho phép thay đổi nhẹ để tối ưu watermark
            </p>
          </div>

          <div
            onClick={() => navigate("/base64-to-image")}
            className="cursor-pointer p-6 rounded-xl border hover:shadow-lg hover:-translate-y-1 transition"
          >
            <div className="text-3xl mb-2">🟩</div>
            <h2 className="text-lg font-semibold text-emerald-600">
              Base64 to Image
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Giải mã file base64 .txt thành ảnh JPG
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;