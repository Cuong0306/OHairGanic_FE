// src/types/ProductDTO.ts
// ✅ Định nghĩa type theo BE (name) + type dùng trong UI

// Dữ liệu từ BE (Swagger hiển thị body có "name")
export interface ApiProduct {
  productId: number;
  productName: string;
  tags: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt?: string;
}

// DTO tạo/cập nhật theo BE
export interface CreateProductDTO {
  productName: string;
  tags: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
}
export interface UpdateProductDTO{
  name: string;
  tags: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
}

// Dạng dùng trong UI
export interface UiProduct {
  productId?: number;
  name: string;
  category: string;    // map từ tags
  price: number;
  stock: number;
  status: "active" | "inactive"; // map từ isActive
  imageUrl?: string;
  createdAt?: string;
}
