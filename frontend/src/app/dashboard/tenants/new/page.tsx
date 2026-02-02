'use client';

import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { tenantService } from '@/api/tenants';
import { TenantRequest } from '@/types/tenant';

export default function NewTenantPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantRequest>();

  const createMutation = useMutation({
    mutationFn: tenantService.create,
    onSuccess: () => {
      router.push('/dashboard/tenants');
    },
  });

  const onSubmit = (data: TenantRequest) => {
    createMutation.mutate({ ...data, status: 'ACTIVE' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Nueva Empresa</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                {...register('name', { required: 'Nombre es requerido' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                placeholder="Empresa XYZ"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">NIT</label>
              <input
                type="text"
                {...register('nit', { required: 'NIT es requerido' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                placeholder="123456789-0"
              />
              {errors.nit && <p className="text-sm text-red-600">{errors.nit.message}</p>}
            </div>

            {createMutation.isError && (
              <div className="bg-red-50 text-red-600 p-3 rounded">Error al crear empresa</div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creando...' : 'Crear Empresa'}
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