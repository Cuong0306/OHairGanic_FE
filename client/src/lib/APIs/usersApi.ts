import type { UserDTO, CreateUserDTO, UpdateUserDTO } from "@/types/UserDTO";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";
const baseInit: RequestInit = { mode: "cors", credentials: "omit" }; // 👈 quan trọng

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

export const usersApi = {
  async list(): Promise<UserDTO[]> {
    const res = await fetch(`${API_BASE}/user/all`, {
      ...baseInit,
      headers: authHeader(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async create(payload: CreateUserDTO): Promise<UserDTO> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      ...baseInit,
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    return res.json();
  },

  async update(id: number, patch: UpdateUserDTO): Promise<UserDTO | string> {
    const res = await fetch(`${API_BASE}/user/update`, {
      ...baseInit,
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : res.text();
  },

  async remove(id: number): Promise<void | string> {
    const res = await fetch(`${API_BASE}/user/delete-soft/${id}`, {
      ...baseInit,
      method: "DELETE",
      headers: authHeader(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : undefined;
  },
};
