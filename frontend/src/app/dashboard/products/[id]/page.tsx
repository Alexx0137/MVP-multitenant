'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { productService } from '@/api/products';
import { ProductRequest } from '@/types/product';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const productId = Number(params.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductRequest>();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getById(productId),
    enabled: !!productId,
  });

  useEffect(() => {
    if (product) {
      reset({ name: product.name });
    }
  }, [product, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: ProductRequest) => productService.update(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      router.push('/dashboard/products');
    },
  });

  const onSubmit = (data: ProductRequest) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Producto</h1>

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

            {updateMutation.isError && (
              <div className="bg-red-50 text-red-600 p-3 rounded">
                Error al actualizar producto
              </div>
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
