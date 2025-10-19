import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ordersApi } from "@/lib/APIs/ordersApi";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider"; // ✅ dùng ThemeProvider của bạn

interface Props {
  id: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
}

export default function OrderDetailDialog({
  id,
  open,
  onOpenChange,
  onUpdated,
}: Props) {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const { toast } = useToast();
  const { theme } = useTheme(); // ✅ lấy theme từ context của bạn
  const isDark = theme === "dark";

  useEffect(() => {
    if (open && id) {
      ordersApi
        .getById(id)
        .then((d) => {
          setData(d);
          setStatus(d.status);
          setPaymentStatus(d.paymentStatus);
        })
        .catch((e) =>
          toast({
            title: "Lỗi tải đơn hàng",
            description: e.message,
            variant: "destructive",
          })
        );
    }
  }, [open, id]);

  const handleUpdate = async () => {
    if (!data) return;
    try {
      await ordersApi.adminUpdateStatus(data.id, status, paymentStatus);
      toast({
        title: "Cập nhật thành công",
        description: `Đơn hàng #${data.id} đã được cập nhật.`,
      });
      onOpenChange(false);
      onUpdated?.();
    } catch (err: any) {
      toast({
        title: "Lỗi cập nhật",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`max-w-lg rounded-2xl border shadow-2xl backdrop-blur-xl transition-colors duration-300 ${
          isDark
            ? "bg-zinc-950/95 text-white border-zinc-800"
            : "bg-white text-gray-900 border-zinc-200"
        }`}
      >
        <DialogHeader>
          <DialogTitle
            className={`text-xl font-semibold text-center mb-2 ${
              isDark ? "text-zinc-100" : "text-gray-800"
            }`}
          >
            Chi tiết đơn hàng #{data.id}
          </DialogTitle>
        </DialogHeader>

        {/* Thông tin khách hàng */}
        <div className="space-y-2 text-sm mt-2">
          <p>
            <span
              className={`font-semibold ${
                isDark ? "text-zinc-400" : "text-gray-600"
              }`}
            >
              Khách hàng:
            </span>{" "}
            <span className={isDark ? "text-zinc-200" : "text-gray-800"}>
              {data.customerName}
            </span>
          </p>
        </div>

        {/* Trạng thái & Thanh toán */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p
              className={`font-semibold mb-1 ${
                isDark ? "text-zinc-400" : "text-gray-600"
              }`}
            >
              Trạng thái
            </p>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger
                className={`border ${
                  isDark
                    ? "bg-zinc-900 border-zinc-700 text-zinc-100"
                    : "bg-gray-50 border-gray-300 text-gray-800"
                }`}
              >
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent
                className={`border ${
                  isDark
                    ? "bg-zinc-900 text-zinc-100 border-zinc-700"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
              >
                <SelectItem value="PENDING">🕓 PENDING</SelectItem>
                <SelectItem value="CONFIRMED">✅ CONFIRMED</SelectItem>
                <SelectItem value="SHIPPED">🚚 SHIPPED</SelectItem>
                <SelectItem value="COMPLETED">🎉 COMPLETED</SelectItem>
                <SelectItem value="CANCELLED">❌ CANCELLED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p
              className={`font-semibold mb-1 ${
                isDark ? "text-zinc-400" : "text-gray-600"
              }`}
            >
              Thanh toán
            </p>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger
                className={`border ${
                  isDark
                    ? "bg-zinc-900 border-zinc-700 text-zinc-100"
                    : "bg-gray-50 border-gray-300 text-gray-800"
                }`}
              >
                <SelectValue placeholder="Chọn thanh toán" />
              </SelectTrigger>
              <SelectContent
                className={`border ${
                  isDark
                    ? "bg-zinc-900 text-zinc-100 border-zinc-700"
                    : "bg-white text-gray-800 border-gray-300"
                }`}
              >
                <SelectItem value="UNPAID">💳 UNPAID</SelectItem>
                <SelectItem value="PAID">✅ PAID</SelectItem>
                <SelectItem value="REFUNDED">↩ REFUNDED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div
          className={`mt-5 p-3 rounded-lg ${
            isDark ? "bg-zinc-900/60" : "bg-gray-50"
          }`}
        >
          <h3
            className={`font-semibold mb-2 ${
              isDark ? "text-zinc-300" : "text-gray-700"
            }`}
          >
            🧴 Danh sách sản phẩm
          </h3>
          <ul
            className={`list-disc ml-5 space-y-1 text-sm ${
              isDark ? "text-zinc-200" : "text-gray-800"
            }`}
          >
            {data.details.map((d: any) => (
              <li key={d.productId}>
                {d.productName} — SL: {d.quantity} —{" "}
                <span className={isDark ? "text-zinc-400" : "text-gray-500"}>
                  {d.price.toLocaleString()}₫
                </span>
              </li>
            ))}
          </ul>
          <p
            className={`mt-3 font-semibold text-lg text-right ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}
          >
            Tổng cộng: {data.totalAmount.toLocaleString()}₫
          </p>
        </div>

        {/* Nút hành động */}
        <div className="flex justify-end mt-6 space-x-2">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className={`${
              isDark
                ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Đóng
          </Button>
          <Button
            onClick={handleUpdate}
            className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white hover:opacity-90 shadow-md"
          >
            Cập nhật
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
