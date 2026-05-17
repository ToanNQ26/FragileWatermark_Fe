export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const embedImage = async (file: File, key: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("key", key);

  const res = await fetch(`${API_BASE}/api/embed`, {
    method: "POST",
    body: formData,
  });

  return res.json();
};

export const verifyImage = async (file: File, key: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("key", key);

  const res = await fetch(`${API_BASE}/api/verify`, {
    method: "POST",
    body: formData,
  });

  return res.json();
};