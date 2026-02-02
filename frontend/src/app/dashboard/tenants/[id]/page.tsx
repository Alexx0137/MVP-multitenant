'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { tenantService } from '@/api/tenants';
import api from '@/api/axios';
import { User } from '@/types/auth';
import { Product } from '@/types/product';
import { Building2, Users, Package, Pencil, ArrowLeft } from 'lucide-react';

export default function TenantDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = Number(params.id);

  const { data: tenant, isLoading: loadingTenant } = useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: () => tenantService.getById(tenantId),
    enabled: !!tenantId,
  });

  const { data: users } = useQuery({
    queryKey: ['tenant-users', tenantId],
    queryFn: async (): Promise<User[]> => {
      const response = await api.get<User[]>('/users', {
        headers: { 'X-Tenant-ID': tenant?.schemaName }
      });
      return response.data;
    },
    enabled: !!tenant?.schemaName,
  });

  const { data: products } = useQuery({
    queryKey: ['tenant-products', tenantId],
    queryFn: async (): Promise<Product[]> => {
      const response = await api.get<Product[]>('/assigned-products', {
        headers: { 'X-Tenant-ID': tenant?.schemaName }
      });
      return response.data;
    },
    enabled: !!tenant?.schemaName,
  });

  if (loadingTenant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">

      <div className="from-slate-800 to-slate-700 rounded-xl p-8 shadow-lg mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{tenant?.name}</h1>
            <p className="text-slate-300 mt-1">Schema: {tenant?.schemaName}</p>
            <p className="text-slate-400 text-sm">NIT: {tenant?.nit}</p>
          </div>
          <div className="ml-auto">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              tenant?.status === 'ACTIVE' 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-red-500/20 text-red-300'
            }`}>
              {tenant?.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Usuarios</p>
                <p className="text-3xl font-bold text-gray-800">{users?.length || 0}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push(`/dashboard/tenants/${tenantId}/users`)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver Usuarios
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Productos Asignados</p>
                <p className="text-3xl font-bold text-gray-800">{products?.length || 0}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push(`/dashboard/tenants/${tenantId}/products`)}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Ver Productos
          </button>
        </div>
      </div>      
    </div>
  );
}
