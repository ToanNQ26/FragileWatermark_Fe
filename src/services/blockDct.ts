const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export type EmbedDctResponse = {
  image_base64: string;
};

export type TamperDctResponse = {
  image_base64: string;
};

export type VerifyDctResponse = {
  is_valid: boolean;
  tamper_count: number;
  total_blocks: number;
  verified_count: number;
  mask_base64: string;
  overlay_base64: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }
  return response.json();
}

export async function embedDctBlock(params: {
  file: File;
  key: string;
}): Promise<EmbedDctResponse> {
  const formData = new FormData();
  formData.append("file", params.file);
  formData.append("key", params.key);

  const response = await fetch(`${API_BASE_URL}/block/embed-dct`, {
    method: "POST",
    body: formData,
  });

  return handleResponse<EmbedDctResponse>(response);
}

export async function tamperDctBlock(params: {
  file: File;
  region: string;
}): Promise<TamperDctResponse> {
  const formData = new FormData();
  formData.append("file", params.file);
  formData.append("region", params.region);

  const response = await fetch(`${API_BASE_URL}/block/tamper-dct`, {
    method: "POST",
    body: formData,
  });

  return handleResponse<TamperDctResponse>(response);
}

export async function verifyDctBlock(params: {
  file: File;
  key: string;
}): Promise<VerifyDctResponse> {
  const formData = new FormData();
  formData.append("file", params.file);
  formData.append("key", params.key);

  const response = await fetch(`${API_BASE_URL}/block/verify-dct`, {
    method: "POST",
    body: formData,
  });

  return handleResponse<VerifyDctResponse>(response);
}

export function base64ToImageSrc(base64: string): string {
  return `data:image/jpeg;base64,${base64}`;
}
