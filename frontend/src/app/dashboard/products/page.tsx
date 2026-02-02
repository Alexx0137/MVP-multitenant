'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { productService, assignedProductService } from '@/api/products';
import { tenantService } from '@/api/tenants';
import { useAuthStore } from '@/stores/auth-store';
import { Package, Plus, Pencil, Trash2, AlertCircle, Share2, X } from 'lucide-react';
import api from '@/api/axios';

export default function ProductsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isHydrated, user, tenantId } = useAuthStore();
  const [assignModal, setAssignModal] = useState<{ productId: number; productName: string } | null>(null);
  
  const isGlobalAdmin = user?.role === 'ADMIN_GLOBAL';

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', tenantId],
    queryFn: isGlobalAdmin ? productService.getAll : assignedProductService.getAssigned,
    enabled: isHydrated,
  });

  const { data: tenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: tenantService.getAll,
    enabled: isHydrated && isGlobalAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const assignMutation = useMutation({
    mutationFn: async ({ productId, schemaName }: { productId: number; schemaName: string }) => {
      await api.post(`/assigned-products/${productId}`, null, {
        headers: { 'X-Tenant-ID': schemaName }
      });
    },
    onSuccess: () => {
      setAssignModal(null);
      alert('Producto asignado exitosamente');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Error al asignar producto');
    },
  });

  if (!isHydrated || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-2">
        <AlertCircle className="w-5 h-5" /> Error al cargar productos
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="bg-slate-800 rounded-t-xl p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-6 h-6" /> 
              {isGlobalAdmin ? 'Catálogo de Productos' : 'Productos Asignados'}
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              {products?.length || 0} productos
            </p>
          </div>
          {isGlobalAdmin && (
            <button
              onClick={() => router.push('/dashboard/products/new')}
              className="bg-white text-blue-600 px-5 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Nuevo Producto
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-lg overflow-hidden">
        {products?.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              {isGlobalAdmin ? 'No hay productos en el catálogo' : 'No tienes productos asignados'}
            </p>
            {isGlobalAdmin && (
              <button
                onClick={() => router.push('/dashboard/products/new')}
                className="mt-4 text-blue-600 hover:underline"
              >
                Crear primer producto →
              </button>
            )}
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
                {isGlobalAdmin && (
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
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
                  {isGlobalAdmin && (
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setAssignModal({ productId: product.id, productName: product.name })}
                          className="px-3 py-1.5 text-sm text-green-600 hover:bg-green-100 rounded-md transition-colors"
                          title="Asignar a tenant"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/products/${product.id}`)}
                          className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar "${product.name}"?`)) {
                              deleteMutation.mutate(product.id);
                            }
                          }}
                          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para asignar producto a tenant */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Asignar Producto</h2>
              <button onClick={() => setAssignModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">
              Asignar <strong>{assignModal.productName}</strong> a:
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {tenants?.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => assignMutation.mutate({ 
                    productId: assignModal.productId, 
                    schemaName: tenant.schemaName 
                  })}
                  disabled={assignMutation.isPending}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50"
                >
                  <p className="font-medium text-gray-900">{tenant.name}</p>
                  <p className="text-sm text-gray-500">{tenant.schemaName}</p>
                </button>
              ))}
            </div>

            {tenants?.length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay tenants disponibles</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
