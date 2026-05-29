import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Lossless from "./pages/Lossless";
import Lossy from "./pages/Lossy";
import Base64ToImage from "./pages/Base64ToImage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/base64-to-image" element={<Base64ToImage />} />
        <Route path="/lossless" element={<Lossless />} />
        <Route path="/lossy" element={<Lossy />} />
      </Routes>
  );
}

export default App;