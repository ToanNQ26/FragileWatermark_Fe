// front_end/src/services/dctApi.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export type EmbedDctResponse = {
  image_base64: string;
};

export type VerifyDctResponse = {
  is_valid: boolean;
  bit_errors?: number;
  embedded_hash?: string;
  recomputed_hash?: string;
  reason?: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return response.json();
}

export async function embedDctImage(params: {
  file: File;
  key: string;
}): Promise<EmbedDctResponse> {
  const formData = new FormData();
  formData.append("file", params.file);
  formData.append("key", params.key);

  const response = await fetch(`${API_BASE_URL}/embed-dct`, {
    method: "POST",
    body: formData,
  });

  return handleResponse<EmbedDctResponse>(response);
}

export async function verifyDctImage(params: {
  file: File;
  key: string;
}): Promise<VerifyDctResponse> {
  const formData = new FormData();
  formData.append("file", params.file);
  formData.append("key", params.key);

  const response = await fetch(`${API_BASE_URL}/verify-dct`, {
    method: "POST",
    body: formData,
  });

  return handleResponse<VerifyDctResponse>(response);
}

export function base64ToImageSrc(base64: string): string {
  return `data:image/jpeg;base64,${base64}`;
}