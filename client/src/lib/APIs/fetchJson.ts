// src/lib/APIs/fetchJson.ts
export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const token = localStorage.getItem("access_token");

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    ...init,
  });

  const ct = res.headers.get("content-type") || "";

  // 🔹 Kiểm tra lỗi
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      if (ct.includes("application/json")) {
        const j = await res.json();
        msg = j?.message || JSON.stringify(j);
      } else {
        msg = await res.text();
      }
    } catch {}
    throw new Error(msg);
  }

  // 🔹 Nếu là No Content
  if (res.status === 204) return undefined as T;

  // 🔹 Xử lý response
  if (ct.includes("application/json")) {
    return (await res.json()) as T;
  } else {
    const text = await res.text();
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }
}
