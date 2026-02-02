'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { tenantService } from '@/api/tenants';
import { useAuthStore } from '@/stores/auth-store';
import { useEffect } from 'react';
import { Building2, Plus, Users, Pencil, Trash2, AlertCircle, Eye } from 'lucide-react';

export default function TenantsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && user?.role !== 'ADMIN_GLOBAL') {
      router.push('/dashboard');
    }
  }, [isHydrated, user, router]);

  const { data: tenants, isLoading, error } = useQuery({
    queryKey: ['tenants'],
    queryFn: tenantService.getAll,
    enabled: isHydrated && user?.role === 'ADMIN_GLOBAL',
  });

  const deleteMutation = useMutation({
    mutationFn: tenantService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });

  if (!isHydrated || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-2">
        <AlertCircle className="w-5 h-5" /> Error al cargar tenants
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="bg-slate-800 rounded-t-xl p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-6 h-6" /> Empresas
            </h1>
            <p className="text-purple-200 text-sm mt-1">
              {tenants?.length || 0} empresas registradas
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/tenants/new')}
            className="bg-white text-purple-600 px-5 py-2.5 rounded-lg font-medium hover:bg-purple-50 transition-all shadow-md flex items-center gap-2"
          >
                        <Plus className="w-5 h-5" /> Nueva Empresa
          </button>
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-lg overflow-hidden">
        {tenants?.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏢</div>
            <p className="text-gray-500 text-lg">No hay empresas registradas</p>
            <button
              onClick={() => router.push('/dashboard/tenants/new')}
              className="mt-4 text-purple-600 hover:underline"
            >
              Crear primera empresa →
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  NIT
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Schema
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tenants?.map((tenant, index) => (
                <tr 
                  key={tenant.id} 
                  className="hover:bg-purple-50/50 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">{tenant.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 font-mono text-sm">{tenant.nit}</span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                      {tenant.schemaName}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                      tenant.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        tenant.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      {tenant.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/tenants/${tenant.id}`)}
                        className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/dashboard/tenants/${tenant.id}/edit`)}
                        className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>                                    
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar "${tenant.name}"?\n\nEsta acción eliminará también todos sus usuarios.`)) {
                            deleteMutation.mutate(tenant.id);
                          }
                        }}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 rounded-md transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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