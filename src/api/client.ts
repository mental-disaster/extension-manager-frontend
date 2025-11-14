const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!API_BASE_URL) {
  console.warn("API_BASE_URL is not defined.");
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = API_BASE_URL || "http://localhost:8080";
  const url = `${baseUrl}${path}`;

  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!resp.ok) {
    const text = await resp.text();
    let msg = '요청 처리 중 오류가 발생했습니다.';;
  
    try {
      const json = JSON.parse(text);
      if (json && typeof json === "object" && json.message) {
        msg = json.message;
      }
    } catch {}

    throw new Error(msg);
  }

  if (resp.status === 204) {
    return undefined as T;
  }
  return (await resp.json()) as T;
}

export const apiClient = {
  request,
};
