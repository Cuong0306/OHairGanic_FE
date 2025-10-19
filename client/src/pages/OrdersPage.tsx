import { useEffect, useState } from "react";
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
import { ordersApi } from "@/lib/APIs/ordersApi";
import { useToast } from "@/hooks/use-toast";
import OrderDetailDialog from "@/components/OrderDetailDialog";

interface Order {
  id: number;
  userId: number;
  customerName?: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const loadOrders = async () => {
    try {
      const data = await ordersApi.list();
      setOrders(data);
    } catch (e: any) {
      toast({
        title: "Lỗi tải danh sách đơn hàng",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = orders.filter(
    (o) =>
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.status.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  // ✅ Helper: màu cho trạng thái đơn hàng
  const getStatusClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-sky-100 text-sky-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // ✅ Helper: màu cho trạng thái thanh toán
  const getPaymentClass = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "UNPAID":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Quản lý đơn hàng</h1>
        <p className="text-sm text-muted-foreground">
          Danh sách tất cả đơn hàng từ hệ thống
        </p>
      </div>

      {/* Ô tìm kiếm */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm khách hàng hoặc trạng thái..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Bảng hiển thị */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Thanh toán</TableHead>
              <TableHead>Ngày tạo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((o) => (
              <TableRow
                key={o.id}
                onClick={() => {
                  setSelectedOrder(o.id);
                  setOpen(true);
                }}
                className="cursor-pointer hover:bg-muted/30"
              >
                <TableCell>#{o.id}</TableCell>
                <TableCell>{o.customerName || "Ẩn danh"}</TableCell>

                {/* ✅ Màu trạng thái đơn hàng */}
                <TableCell>
                  <Badge className={getStatusClass(o.status)}>
                    {o.status}
                  </Badge>
                </TableCell>

                <TableCell>{formatCurrency(o.totalAmount)}</TableCell>

                {/* ✅ Màu trạng thái thanh toán */}
                <TableCell>
                  <Badge className={getPaymentClass(o.paymentStatus)}>
                    {o.paymentStatus}
                  </Badge>
                </TableCell>

                {/* ✅ Hiển thị ngày tạo dạng dd/MM/yyyy */}
                <TableCell>
                  {new Date(o.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <OrderDetailDialog
        id={selectedOrder}
        open={open}
        onOpenChange={setOpen}
        onUpdated={loadOrders}
      />
    </div>
  );
}
