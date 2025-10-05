import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import type { Order } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// TODO: remove mock data
const mockOrders: Order[] = [
  {
    id: "1",
    customerName: "Nguyễn Văn A",
    productName: "Laptop Dell XPS 13",
    quantity: 1,
    total: "25000000",
    status: "completed",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    customerName: "Trần Thị B",
    productName: "iPhone 15 Pro",
    quantity: 2,
    total: "56000000",
    status: "processing",
    createdAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    customerName: "Lê Văn C",
    productName: "Áo thun Nike",
    quantity: 3,
    total: "1350000",
    status: "pending",
    createdAt: new Date("2024-01-17"),
  },
  {
    id: "4",
    customerName: "Phạm Thị D",
    productName: "Chuột Gaming Logitech",
    quantity: 1,
    total: "1200000",
    status: "completed",
    createdAt: new Date("2024-01-18"),
  },
  {
    id: "5",
    customerName: "Hoàng Văn E",
    productName: "Sách lập trình Python",
    quantity: 2,
    total: "640000",
    status: "cancelled",
    createdAt: new Date("2024-01-19"),
  },
];

const statusColors: Record<string, "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  processing: "default",
  completed: "default",
  cancelled: "destructive",
};

const statusLabels: Record<string, string> = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.productName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN").format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Quản lý Orders</h1>
        <p className="text-sm text-muted-foreground">Quản lý danh sách đơn hàng</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm đơn hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-orders"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="processing">Đang xử lý</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.productName}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{formatPrice(order.total)}</TableCell>
                <TableCell>
                  <Badge variant={statusColors[order.status]}>
                    {statusLabels[order.status]}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
