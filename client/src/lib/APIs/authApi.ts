const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export const authApi = {
  login: (payload: LoginRequest) =>
    fetchJson<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
