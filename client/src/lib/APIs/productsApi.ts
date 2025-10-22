import type {
  ApiProduct,
  CreateProductDTO,
  UpdateProductDTO,
  UiProduct,
} from "@/types/ProductDTO";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

// ─────────────────────────────
//  Helper function: chuẩn hóa header & fetch
// ─────────────────────────────
async function request<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const token = localStorage.getItem("access_token");

  const headers: HeadersInit = {
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`HTTP ${res.status}: ${msg}`);
  }

  if (res.status === 204) return undefined as T;
  try {
    return (await res.json()) as T;
  } catch {
    return undefined as T;
  }
}

// ─────────────────────────────
//  Mapping giữa BE ↔ UI
// ─────────────────────────────
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

// ─────────────────────────────
//  PRODUCTS API — header giống ordersApi
// ─────────────────────────────
export const productsApi = {
  // 🔹 Lấy danh sách sản phẩm
  async list(): Promise<UiProduct[]> {
    const data = await request<ApiProduct[]>("/products");
    return (data || []).map(toUi);
  },

  // 🔹 Tạo mới sản phẩm
  async create(u: Partial<UiProduct>): Promise<UiProduct> {
    const dto = toCreateDto(u);
    const res = await request<ApiProduct>("/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return toUi(res);
  },

  // 🔹 Cập nhật sản phẩm
  async update(id: number, u: Partial<UiProduct>): Promise<UiProduct | void> {
    const dto = toUpdateDto(u);
    const res = await request<ApiProduct | void>(`/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return res ? toUi(res as ApiProduct) : undefined;
  },

  // 🔹 Xóa sản phẩm
  async remove(id: number): Promise<void> {
    await request<void>(`/products/${id}`, { method: "DELETE" });
  },
};
 