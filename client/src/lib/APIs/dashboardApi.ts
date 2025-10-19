import { fetchJson } from "./fetchJson";

export interface DashboardSummary {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: { month: string; revenue: number }[];
  monthlyOrders: { month: string; orders: number }[];

  // ✅ thêm: danh sách đơn hàng đã thanh toán
  orders: {
    id: number;
    totalAmount: number;
    paymentStatus: string;
    createdAt: string;
  }[];
}

export const dashboardApi = {
  getSummary: () => fetchJson<DashboardSummary>("/api/dashboard/summary"),
};
