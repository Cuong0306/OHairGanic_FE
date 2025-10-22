// src/types/UserDTO.ts
// =======================
// User Types — Đồng bộ theo backend OHairGanic
// =======================

export interface UserDTO {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
  // Backend có thể trả nhiều tên field khác nhau cho thời điểm tạo → normalize ở UI
  createdAt?: string;
  createdDate?: string;
  created?: string;
}

// Dữ liệu khi tạo mới user (POST /api/auth/register)
export interface CreateUserDTO {
  fullName: string;
  email: string;
  password?: string;
  phoneNumber?: string | null;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
}

// Dữ liệu khi cập nhật user (PUT /api/user/update) — dùng fullName, KHÔNG dùng displayName
export interface UpdateUserDTO {
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
}
