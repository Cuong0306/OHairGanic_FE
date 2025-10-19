import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserDTO } from "@/types/UserDTO";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserDTO | null;
  onSave: (data: Partial<UserDTO & { password?: string }>) => void | Promise<void>;
}

export default function UserDialog({
  open,
  onOpenChange,
  user,
  onSave,
}: UserDialogProps) {
  const [form, setForm] = useState<Partial<UserDTO & { password?: string }>>({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "User",
    status: "Active",
    password: "",
  });

  // ✅ Khi chọn user hoặc mở dialog → đồng bộ dữ liệu form
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        role: user.role || "User",
        status: user.status || "Active",
      });
    } else {
      setForm({
        fullName: "",
        email: "",
        phoneNumber: "",
        role: "User",
        status: "Active",
        password: "",
      });
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            {user ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label>Họ tên</Label>
            <Input
              className="text-black"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              className="text-black"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {!user && (
            <div>
              <Label>Mật khẩu</Label>
              <Input
                className="text-black"
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          )}

          <div>
            <Label>Số điện thoại</Label>
            <Input
              className="text-black"
              type="tel"
              value={form.phoneNumber ?? ""}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            />
          </div>

          <div>
            <Label>Vai trò</Label>
            <Select
              value={form.role}
              onValueChange={(v) => setForm({ ...form, role: v as UserDTO["role"] })}
            >
              <SelectTrigger className="text-black bg-white">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="User">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Trạng thái</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm({ ...form, status: v as UserDTO["status"] })}
            >
              <SelectTrigger className="text-black bg-white">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Hoạt động</SelectItem>
                <SelectItem value="Inactive">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              className="text-white border-gray-400 hover:bg-gray-800"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90"
            >
              {user ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
