'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { tenantService } from '@/api/tenants';
import { TenantRequest } from '@/types/tenant';
import { useEffect } from 'react';

export default function EditTenantPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = Number(params.id);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TenantRequest>();

  const { data: tenant, isLoading } = useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: () => tenantService.getById(tenantId),
    enabled: !!tenantId,
  });

  useEffect(() => {
    if (tenant) {
      reset({
        name: tenant.name,
        nit: tenant.nit,
        status: tenant.status,
      });
    }
  }, [tenant, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: TenantRequest) => tenantService.update(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] });
      router.push(`/dashboard/tenants/${tenantId}`);
    },
  });

  const onSubmit = (data: TenantRequest) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Empresa</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                {...register('name', { required: 'Nombre es requerido' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">NIT</label>
              <input
                type="text"
                {...register('nit', { required: 'NIT es requerido' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              />
              {errors.nit && <p className="text-sm text-red-600">{errors.nit.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Schema (solo lectura)</label>
              <input
                type="text"
                value={tenant?.schemaName || ''}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md text-gray-500 bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">El schema no se puede modificar</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                {...register('status')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              >
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
              </select>
            </div>

            {updateMutation.isError && (
              <div className="bg-red-50 text-red-600 p-3 rounded">Error al actualizar empresa</div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
