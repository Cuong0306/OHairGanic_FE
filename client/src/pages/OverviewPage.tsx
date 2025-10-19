import { useEffect, useState } from "react";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { dashboardApi, DashboardSummary } from "@/lib/APIs/dashboardApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function OverviewPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await dashboardApi.getSummary();
        setData(result);
      } catch (err) {
        console.error("❌ Lỗi tải Dashboard:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="p-8 text-sm text-muted-foreground">Đang tải dữ liệu...</div>
    );

  if (!data)
    return (
      <div className="p-8 text-sm text-red-500">
        Không thể tải dữ liệu Dashboard.
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Tổng quan</h1>
        <p className="text-sm text-muted-foreground">
          Thống kê tổng quan hệ thống
        </p>
      </div>

      {/* Thống kê tổng */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng Users"
          value={data.totalUsers.toLocaleString("vi-VN")}
          icon={Users}
          description="Người dùng đã đăng ký"
          trend={{ value: "+12.5%", isPositive: true }}
        />
        <StatsCard
          title="Tổng Products"
          value={data.totalProducts.toLocaleString("vi-VN")}
          icon={Package}
          description="Sản phẩm đang bán"
          trend={{ value: "+8.2%", isPositive: true }}
        />
        <StatsCard
          title="Tổng Orders"
          value={data.totalOrders.toLocaleString("vi-VN")}
          icon={ShoppingCart}
          description="Đơn hàng trong hệ thống"
          trend={{ value: "+15.3%", isPositive: true }}
        />
        <StatsCard
          title="Doanh thu (đã thanh toán)"
          value={`${data.totalRevenue.toLocaleString("vi-VN")} VNĐ`}
          icon={DollarSign}
          description="Chỉ tính các đơn hàng PAID"
          trend={{ value: "+21.8%", isPositive: true }}
        />
      </div>

      {/* Biểu đồ */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Doanh thu 6 tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(v) =>
                    v.toLocaleString("vi-VN", { maximumFractionDigits: 0 })
                  }
                />
                <Tooltip
                  formatter={(value: number) => `${value.toLocaleString("vi-VN")} VNĐ`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Đơn hàng 6 tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  formatter={(value: number) => `${value.toLocaleString("vi-VN")} đơn`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Bar dataKey="orders" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Thêm bảng hiển thị đơn hàng đã thanh toán */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Đơn hàng đã thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Trạng thái thanh toán</TableHead>
                  <TableHead className="text-right">Tổng tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.orders && data.orders.length > 0 ? (
                  data.orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>#{o.id}</TableCell>
                      <TableCell>{new Date(o.createdAt).toLocaleString("vi-VN")}</TableCell>
                      <TableCell>
                        <span className="text-green-600 font-medium">
                          {o.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600">
                        {o.totalAmount.toLocaleString("vi-VN")}₫
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      Không có đơn hàng PAID nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
