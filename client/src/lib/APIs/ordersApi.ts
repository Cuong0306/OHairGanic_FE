const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

export const ordersApi = {
  // Lấy danh sách đơn hàng
  async list() {
    const res = await fetch(`${API_BASE}/api/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  // Lấy chi tiết đơn hàng theo id
  async getById(id: number) {
    const res = await fetch(`${API_BASE}/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  },

  // ✅ Admin cập nhật trạng thái đơn hàng và thanh toán
  async adminUpdateStatus(orderId: number, orderStatus: string, paymentStatus?: string) {
    const res = await fetch(`${API_BASE}/api/orders/admin/update-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ orderId, orderStatus, paymentStatus }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`HTTP ${res.status}: ${msg}`);
    }

    return await res.json();
  },
};
