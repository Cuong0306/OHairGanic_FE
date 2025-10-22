// src/lib/APIs/productsApi.ts
import type { ApiProduct, CreateProductDTO, UpdateProductDTO, UiProduct } from "@/types/ProductDTO";

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

function isJsonLike(res: Response) {
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json");
}

async function request<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const token = localStorage.getItem("access_token");
  const hasBody = !!init.body && !(init.body instanceof FormData);
  const baseHeaders: HeadersInit = hasBody ? { "Content-Type": "application/json" } : {};
  const headers: HeadersInit = { ...baseHeaders, ...(init.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) };

  const res = await fetch(url, { credentials: "include", ...init, headers });
  if (!res.ok) {
    let detail = "";
    try { detail = isJsonLike(res) ? JSON.stringify(await res.json()) : await res.text(); } catch {}
    console.error("❌ API ERROR", { url, status: res.status, method: init.method, sentBody: init.body, detail });
    throw new Error(detail || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  if (!isJsonLike(res)) return undefined as T;
  return res.json() as Promise<T>;
}

// Map BE <-> UI
const toUi = (p: ApiProduct): UiProduct => ({
  productId: p.productId,
  name: p.productName,
  category: p.tags ?? "",
  price: p.price,
  stock: p.stock,
  status: p.isActive ? "active" : "inactive",
  imageUrl: p.imageUrl ?? "",
  createdAt: p.createdAt,
});

const toCreateDto = (u: Partial<UiProduct>): CreateProductDTO => {
  const dto: CreateProductDTO = {
    productName: (u.name ?? "").trim(),
    tags: (u.category ?? "").trim(),
    price: typeof u.price === "number" ? u.price : Number(u.price ?? 0),
    stock: typeof u.stock === "number" ? u.stock : Number(u.stock ?? 0),
    isActive: u.status === "active",
  };
  if (u.imageUrl && u.imageUrl.trim() !== "") dto.imageUrl = u.imageUrl.trim();
  return dto;
};

const toUpdateDto = (u: Partial<UiProduct>): UpdateProductDTO => {
  const dto: UpdateProductDTO = {
    name: (u.name ?? "").trim(),
    tags: (u.category ?? "").trim(),
    price: typeof u.price === "number" ? u.price : Number(u.price ?? 0),
    stock: typeof u.stock === "number" ? u.stock : Number(u.stock ?? 0),
    isActive: u.status === "active",
  };
  if (u.imageUrl && u.imageUrl.trim() !== "") dto.imageUrl = u.imageUrl.trim();
  return dto;
};

export const productsApi = {
  list: async (): Promise<UiProduct[]> => {
    const data = await request<ApiProduct[]>("/products");
    return (data || []).map(toUi);
  },
  create: async (u: Partial<UiProduct>): Promise<UiProduct> => {
    const dto = toCreateDto(u);
    const created = await request<ApiProduct>("/products", { method: "POST", body: JSON.stringify(dto) });
    return toUi(created);
  },
  update: async (id: number, u: Partial<UiProduct>): Promise<UiProduct | void> => {
    const dto = toUpdateDto(u);
    // Nếu BE trả về body sau khi update, giữ lại kiểu ApiProduct; nếu trả 204 thì hàm trả void
    const updated = await request<ApiProduct | void>(`/products/${id}`, { method: "PUT", body: JSON.stringify(dto) });
    
    return updated ? toUi(updated as ApiProduct) : undefined;
  },
  remove: (id: number) => request<void>(`/products/${id}`, { method: "DELETE" }),
};
