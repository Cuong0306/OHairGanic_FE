export interface ProductDTO {
  productId: number;
  productName: string;
  tags: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
}

export interface CreateProductDTO {
  productName: string;
  tags: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl?: string; // 🔗 link Cloudinary
}

export interface UpdateProductDTO extends CreateProductDTO {}
