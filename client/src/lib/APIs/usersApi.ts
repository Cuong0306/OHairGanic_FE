import type { UserDTO, CreateUserDTO, UpdateUserDTO } from "@/types/UserDTO";

// 🔹 Lấy base URL từ file .env
const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";
console.log("📡 API_BASE =", API_BASE);

// =======================
// Hàm fetchJson chuẩn dùng chung (hỗ trợ text/plain + JSON)
// =======================
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

  const ct = res.headers.get("content-type") || "";

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

  if (res.status === 204) return undefined as T;

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

// =======================
// USERS API (chuẩn Swagger backend)
// =======================
export const usersApi = {
  // 🔹 Lấy toàn bộ danh sách user
  list: () => fetchJson<UserDTO[]>("/api/user/all"),

  // 🔹 Tạo user mới (Swagger: POST /api/auth/register)
  create: (payload: CreateUserDTO) =>
    fetchJson<UserDTO>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // 🔹 Cập nhật user (Swagger: PUT /api/user/update)
  update: (id: number, patch: UpdateUserDTO) =>
    fetchJson<UserDTO | string>("/api/user/update", {
      method: "PUT",
      body: JSON.stringify({ id, ...patch }),
    }),

  // 🔹 Xóa mềm user (Swagger: DELETE /api/user/delete-soft/{id})
  remove: (id: number) =>
    fetchJson<void | string>(`/api/user/delete-soft/${id}`, {
      method: "DELETE",
    }),
};
