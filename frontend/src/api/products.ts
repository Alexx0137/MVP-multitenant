import api from './axios';
import { Product, ProductRequest } from '@/types/product';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: ProductRequest): Promise<Product> => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: number, data: ProductRequest): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

export const assignedProductService = {
  getAssigned: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/assigned-products');
    return response.data;
  },

  assign: async (productId: number): Promise<void> => {
    await api.post(`/assigned-products/${productId}`);
  },

  unassign: async (productId: number): Promise<void> => {
    await api.delete(`/assigned-products/${productId}`);
  },
};
