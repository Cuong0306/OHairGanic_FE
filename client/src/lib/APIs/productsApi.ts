import type { ProductDTO, CreateProductDTO, UpdateProductDTO } from "@/types/ProductDTO";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
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

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      msg = err?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const productsApi = {
  list: () => fetchJson<ProductDTO[]>("/api/products"),

  create: (data: CreateProductDTO) =>
    fetchJson<ProductDTO>("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateProductDTO) =>
    fetchJson<ProductDTO>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: (id: number) =>
    fetchJson<void>(`/api/products/${id}`, { method: "DELETE" }),
};
