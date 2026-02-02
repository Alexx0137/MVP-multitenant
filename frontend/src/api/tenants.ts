import api from './axios';
import { Tenant, TenantRequest } from '@/types/tenant';

export const tenantService = {
  getAll: async (): Promise<Tenant[]> => {
    const response = await api.get<Tenant[]>('/tenants');
    return response.data;
  },

  getById: async (id: number): Promise<Tenant> => {
    const response = await api.get<Tenant>(`/tenants/${id}`);
    return response.data;
  },

  create: async (data: TenantRequest): Promise<Tenant> => {
    const response = await api.post<Tenant>('/tenants', data);
    return response.data;
  },

  update: async (id: number, data: TenantRequest): Promise<Tenant> => {
    const response = await api.put<Tenant>(`/tenants/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tenants/${id}`);
  },
};