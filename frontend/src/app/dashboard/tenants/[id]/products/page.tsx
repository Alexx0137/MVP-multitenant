'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { tenantService } from '@/api/tenants';
import api from '@/api/axios';
import { Product } from '@/types/product';
import { Package, ArrowLeft } from 'lucide-react';

export default function TenantProductsPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = Number(params.id);

  const { data: tenant } = useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: () => tenantService.getById(tenantId),
    enabled: !!tenantId,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['tenant-products', tenantId],
    queryFn: async (): Promise<Product[]> => {
      const response = await api.get<Product[]>('/assigned-products', {
        headers: { 'X-Tenant-ID': tenant?.schemaName }
      });
      return response.data;
    },
    enabled: !!tenant?.schemaName,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="bg-slate-800 rounded-t-xl p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-6 h-6" /> Productos de {tenant?.name}
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              {products?.length || 0} productos asignados
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-lg overflow-hidden">
        {products?.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No hay productos asignados a este tenant</p>
            <p className="text-gray-400 text-sm mt-2">
              Puedes asignar productos desde el catálogo global
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fecha Creación
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products?.map((product) => (
                <tr key={product.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
