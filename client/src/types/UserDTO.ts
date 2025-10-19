// =======================
// User Types — Đồng bộ theo backend OHairGanic
// =======================

// 🔹 Dữ liệu trả về từ backend (GET /api/user/all)
export interface UserDTO {
  userId: number; // từ backend
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
  createdAt?: string;
}

// 🔹 Dữ liệu khi tạo mới user (POST /api/auth/register)
export interface CreateUserDTO {
  fullName: string;
  email: string;
  password?: string;
  phoneNumber?: string | null;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
}

// 🔹 Dữ liệu khi cập nhật user (PUT /api/user/update)
export interface UpdateUserDTO {
  displayName: string;
  email: string;
  phoneNumber?: string | null;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
}
