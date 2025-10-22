// src/pages/UsersPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import UserDialog from "@/components/UserDialog";
import { useToast } from "@/hooks/use-toast";
import { usersApi } from "@/lib/APIs/usersApi";
import type { UserDTO, CreateUserDTO, UpdateUserDTO } from "@/types/UserDTO";

export default function UsersPage() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const { toast } = useToast();

  // ===== Load danh sách user & normalize createdAt =====
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const list = await usersApi.list();
        const normalized = list.map((u) => ({
          ...u,
          createdAt: u.createdAt ?? (u as any).createdDate ?? (u as any).created ?? undefined,
          phoneNumber: u.phoneNumber ?? null,
        }));
        if (!cancelled) setUsers(normalized);
      } catch (e: any) {
        toast({ title: "Lỗi tải danh sách", description: e.message, variant: "destructive" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [toast]);

  // ===== Lọc theo tìm kiếm =====
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  // ===== CRUD actions =====
  const handleAdd = () => { setSelectedUser(null); setDialogOpen(true); };
  const handleEdit = (user: UserDTO) => { setSelectedUser(user); setDialogOpen(true); };

  const handleDelete = async (id: number) => {
    const prev = users;
    setUsers(prev.filter((u) => u.id !== id)); // optimistic
    try {
      await usersApi.remove(id);
      toast({ title: "Đã xóa user", description: "Người dùng đã được xóa thành công" });
    } catch (e: any) {
      setUsers(prev); // rollback
      toast({ title: "Xóa thất bại", description: e.message, variant: "destructive" });
    }
  };

  const handleSave = async (userData: Partial<UserDTO & { password?: string }>) => {
    try {
      if (selectedUser) {
        const patch: UpdateUserDTO = {
          
          fullName: userData.fullName || selectedUser.fullName,
          email: userData.email || selectedUser.email,
          role: (userData.role as UserDTO["role"]) ?? selectedUser.role,
          status: (userData.status as UserDTO["status"]) ?? selectedUser.status,
          phoneNumber: userData.phoneNumber ?? selectedUser.phoneNumber ?? null,
        };
        console.log("userId", selectedUser.id);
        const updated = await usersApi.update(selectedUser.id, patch);
        const merged =
          typeof updated === "string"
            ? { ...selectedUser, ...patch }
            : { ...selectedUser, ...updated, createdAt: (updated as any).createdAt ?? selectedUser.createdAt };

        setUsers((list) => list.map((u) => (u.id === selectedUser.id ? merged : u)));
        toast({
          title: "Đã cập nhật user",
          description: typeof updated === "string" ? updated : "Thông tin người dùng đã được cập nhật",
        });
      } else {
        const payload: CreateUserDTO = {
          fullName: userData.fullName || "",
          email: userData.email || "",
          password: userData.password ?? undefined,
          role: (userData.role as UserDTO["role"]) ?? "User",
          status: (userData.status as UserDTO["status"]) ?? "Active",
          phoneNumber: userData.phoneNumber ?? null,
        };
        const created = await usersApi.create(payload);
        if (typeof created !== "string") {
          const mapped = {
            ...created,
            createdAt: (created as any).createdAt ?? (created as any).createdDate ?? (created as any).created ?? undefined,
          };
          setUsers((list) => [mapped, ...list]);
          toast({ title: "Đã thêm user", description: "Người dùng mới đã được thêm thành công" });
        } else {
          toast({ title: "Tạo user", description: created });
        }
      }
      setDialogOpen(false);
    } catch (e: any) {
      toast({ title: "Lưu thất bại", description: e.message, variant: "destructive" });
    }
  };

  // ===== Helper: định dạng ngày an toàn cho ISO string hoặc millis =====
  const formatDate = (v?: string) => {
    if (!v) return "";
    const num = Number(v);
    const d = Number.isFinite(num) && num > 0 ? new Date(num) : new Date(v);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  // ===== Render =====
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý Users</h1>
          <p className="text-sm text-muted-foreground">Quản lý danh sách người dùng trong hệ thống</p>
        </div>
        <Button onClick={handleAdd} data-testid="button-add-user">
          <Plus className="h-4 w-4 mr-2" />
          Thêm User
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm theo tên hoặc email..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="pl-9" data-testid="input-search-users" />
        </div>
      </div>

      <div className="border rounded-md">
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Đang tải...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên (Full Name)</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.phoneNumber || (
                      <span className="text-muted-foreground italic">Không có</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "Admin" ? "default" : "secondary"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                      {user.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-muted-foreground p-6">
                    Không có user nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <UserDialog open={dialogOpen} onOpenChange={setDialogOpen} user={selectedUser} onSave={handleSave} />
    </div>
  );
}
