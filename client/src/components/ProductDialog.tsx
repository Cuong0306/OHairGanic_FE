// src/components/ProductDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import type { UiProduct } from "@/types/ProductDTO";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view";
  product?: UiProduct | null;
  onSave?: (data: Partial<UiProduct>) => Promise<void>;
  onDelete?: (id: number) => void;
}

const CLOUDINARY_CLOUD = "dnmmgmwcp";      // TODO: đổi theo cloud của bạn
const CLOUDINARY_PRESET = "OHairGanic";    // TODO: đổi theo preset của bạn

export default function ProductDialog({
  open,
  onOpenChange,
  mode,
  product,
  onSave,
  onDelete,
}: ProductDialogProps) {
  const [form, setForm] = useState<Partial<UiProduct>>({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    status: "active",
    imageUrl: "",
  });

  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const isView = mode === "view";

  useEffect(() => {
    if (product) {
      setForm({
        productId: product.productId,
        name: product.name ?? "",
        category: product.category ?? "",
        price: Number(product.price ?? 0),
        stock: Number(product.stock ?? 0),
        status: (product.status as "active" | "inactive") ?? "active",
        imageUrl: product.imageUrl ?? "",
      });
    } else {
      setForm({ name: "", category: "", price: 0, stock: 0, status: "active", imageUrl: "" });
    }
  }, [product, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        name === "price" || name === "stock"
          ? (value === "" ? "" : Number(value))
          : value,
    }));
  };

  const handleSubmit = async () => {
    if (onSave) await onSave(form);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", CLOUDINARY_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.secure_url) setForm(p => ({ ...p, imageUrl: data.secure_url as string }));
      else alert("Không thể upload ảnh");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleManualImage = () => setShowUrlInput(p => !p);
  const removeImage = () => {
    if (confirm("Xóa ảnh hiện tại?")) setForm(prev => ({ ...prev, imageUrl: "" }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card text-card-foreground border border-border rounded-2xl shadow-2xl transition-colors duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {mode === "create" ? "Thêm sản phẩm" : mode === "edit" ? "Chỉnh sửa sản phẩm" : "Chi tiết sản phẩm"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="flex flex-col items-center">
            <div className="rounded-2xl p-[2px] bg-gradient-to-br from-emerald-400 via-green-500 to-sky-500 shadow-lg relative">
              <div className="bg-background rounded-2xl overflow-hidden relative">
                <img
                  src={form.imageUrl || "https://placehold.co/400x400?text=No+Image"}
                  alt={form.name}
                  className="w-72 h-72 object-cover"
                />
                {!isView && (
                  <div className="absolute bottom-3 right-3 flex gap-2">
                    <label htmlFor="image-upload" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-2 cursor-pointer shadow-md flex items-center gap-1 text-sm">
                      <Upload className="w-4 h-4" />
                      {uploading ? "Đang tải..." : "Upload"}
                      <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                    <button onClick={handleManualImage} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-md">
                      <LinkIcon className="w-4 h-4" />
                    </button>
                    {form.imageUrl && (
                      <button onClick={removeImage} className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {showUrlInput && !isView && (
              <div className="mt-3 w-full">
                <Label>Nhập link ảnh thủ công</Label>
                <Input
                  placeholder="https://..."
                  value={form.imageUrl || ""}
                  onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                  className="bg-muted border-border text-foreground"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <div>
              <Label>Tên sản phẩm</Label>
              <Input name="name" value={form.name ?? ""} onChange={handleChange} disabled={isView} className="bg-background text-foreground" />
            </div>
            <div>
              <Label>Danh mục (tags)</Label>
              <Input name="category" value={form.category ?? ""} onChange={handleChange} disabled={isView} className="bg-background text-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Giá (VNĐ)</Label>
                <Input type="number" name="price" value={form.price as number | string} onChange={handleChange} disabled={isView} className="bg-background text-foreground" />
              </div>
              <div>
                <Label>Tồn kho</Label>
                <Input type="number" name="stock" value={form.stock as number | string} onChange={handleChange} disabled={isView} className="bg-background text-foreground" />
              </div>
            </div>
            {!isView && (
              <div>
                <Label>Trạng thái</Label>
                <select
                  name="status"
                  value={form.status ?? "active"}
                  onChange={handleChange}
                  className="w-full bg-muted border border-border text-foreground rounded-lg p-2"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          {isView ? (
            <Button onClick={() => onOpenChange(false)} variant="secondary" className="text-foreground">Đóng</Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 text-white" disabled={uploading}>
              {uploading ? "Đang tải..." : mode === "create" ? "Thêm mới" : "Lưu thay đổi"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
