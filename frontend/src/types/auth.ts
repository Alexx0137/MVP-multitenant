export type Role = 'ADMIN_GLOBAL' | 'ADMIN_TENANT' | 'USER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  tenantId?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
  status: string;
  tenantId: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  tenantName?: string;
}

export type LoginFormData = LoginRequest;
