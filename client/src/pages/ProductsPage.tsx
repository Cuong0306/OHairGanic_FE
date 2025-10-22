// src/pages/ProductsPage.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import ProductDialog from "@/components/ProductDialog";
import { useToast } from "@/hooks/use-toast";
import { productsApi } from "@/lib/APIs/productsApi";
import type { UiProduct } from "@/types/ProductDTO";
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

export default function ProductsPage() {
  const [products, setProducts] = useState<UiProduct[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit" | "view">("create");
  const [selectedProduct, setSelectedProduct] = useState<UiProduct | null>(null);
  const { toast } = useToast();

  const loadProducts = async () => {
    try {
      const data = await productsApi.list();
      setProducts(data);
    } catch (err: any) {
      toast({ title: "Lỗi tải danh sách", description: err.message, variant: "destructive" });
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleAdd = () => {
    setSelectedProduct(null);
    setMode("create");
    setDialogOpen(true);
  };

  const handleEdit = (p: UiProduct) => {
    setSelectedProduct(p);
    setMode("edit");
    setDialogOpen(true);
    console.log("✏️ Edit product", p);
  };

  const handleView = (p: UiProduct) => {
    setSelectedProduct(p);
    setMode("view");
    setDialogOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await productsApi.remove(id);
      toast({ title: "Đã xóa sản phẩm", description: `Sản phẩm ID ${id} đã được xóa.` });
      loadProducts();
    } catch (err: any) {
      toast({ title: "Lỗi khi xóa sản phẩm", description: err.message, variant: "destructive" });
    }
  };

  const handleSave = async (data: Partial<UiProduct>) => {
    try {
      
      console.log("➡️ Update payload", { id: selectedProduct?.productId, data });
      if (selectedProduct?.productId) {
        // Cập nhật
        console.log("➡️ Update payload", { id: selectedProduct.productId, data });
        await productsApi.update(selectedProduct.productId, data);
        toast({ title: "Đã cập nhật sản phẩm" });
      } else {
        // Tạo mới
        console.log("➡️ Create payload", data);
        await productsApi.create(data);
        toast({ title: "Đã thêm sản phẩm mới" });
      }
      setDialogOpen(false);
      loadProducts();
    } catch (err: any) {
      toast({ title: "Lỗi khi lưu sản phẩm", description: err.message, variant: "destructive" });
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const filtered = products.filter((p) =>
    [p.name, p.category].some((x) => (x || "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý Products</h1>
          <p className="text-sm text-muted-foreground">Quản lý danh sách sản phẩm trong hệ thống</p>
        </div>
        <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-2" /> Thêm Product</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Tìm kiếm sản phẩm..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ảnh</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Tồn kho</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.productId}>
                <TableCell>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">(Không ảnh)</span>
                  )}
                </TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{formatPrice(p.price)}</TableCell>
                <TableCell>
                  <Badge variant={p.stock === 0 ? "destructive" : "default"}>{p.stock}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={p.status === "active" ? "default" : "secondary"}>
                    {p.status === "active" ? "Hoạt động" : "Không hoạt động"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(p.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="icon" onClick={() => handleView(p)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.productId)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={mode}
        product={selectedProduct}
        onSave={handleSave}
        onDelete={(id) => id && handleDelete(id)}
      />
    </div>
  );
}
