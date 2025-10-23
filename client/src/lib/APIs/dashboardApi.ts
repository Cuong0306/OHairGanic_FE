// src/lib/APIs/dashboardApi.ts
export interface DashboardSummary {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: { month: string; revenue: number }[];
  monthlyOrders: { month: string; orders: number }[];
  orders: {
    id: number;
    totalAmount: number;
    paymentStatus: string;
    createdAt: string;
  }[];
}

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";
const baseInit: RequestInit = { mode: "cors", credentials: "omit" };

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

export const dashboardApi = {
  async getSummary(): Promise<DashboardSummary> {
    const res = await fetch(`${API_BASE}/dashboard/summary`, {
      ...baseInit,
      headers: authHeader(),
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`HTTP ${res.status}: ${msg}`);
    }
    return res.json();
  },
};
