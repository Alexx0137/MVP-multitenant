'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { UserRequest } from '@/api/users';
import { User } from '@/types/auth';

interface UserFormProps {
  user?: User;
  isGlobalAdmin: boolean;
  isEditing: boolean;
  tenantName?: string;
  isPending: boolean;
  isError: boolean;
  onSubmit: (data: Partial<UserRequest>) => void;
  onCancel: () => void;
}

export default function UserForm({
  user,
  isGlobalAdmin,
  isEditing,
  tenantName,
  isPending,
  isError,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<UserRequest>>();

  // Cargar datos cuando es edición
  useEffect(() => {
    if (user && isEditing) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }
  }, [user, isEditing, reset]);

  const handleFormSubmit = (data: Partial<UserRequest>) => {
    if (isGlobalAdmin) {
      data.role = 'ADMIN_GLOBAL';
    }
    if (!data.password) {
      delete data.password;
    }
    if (!isEditing && !data.status) {
      data.status = 'ACTIVE';
    }
    onSubmit(data);
  };

  const title = isEditing 
    ? `Editar Usuario${tenantName ? ` de ${tenantName}` : ''}`
    : `Nuevo Usuario${tenantName ? ` para ${tenantName}` : ''}`;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email es requerido' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {isEditing ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
              </label>
              <input
                type="password"
                {...register('password', isEditing ? {} : { required: 'Contraseña requerida', minLength: 6 })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              />
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            {!isGlobalAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <select
                  {...register('role', { required: 'Rol es requerido' })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                >
                  {!isEditing && <option value="">Seleccionar...</option>}
                  <option value="ADMIN_TENANT">Admin Tenant</option>
                  <option value="USER">Usuario</option>
                </select>
                {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
              </div>
            )}

            {isEditing && (
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
            )}

            {isError && (
              <div className="bg-red-50 text-red-600 p-3 rounded">
                Error al {isEditing ? 'actualizar' : 'crear'} usuario
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isPending 
                  ? (isEditing ? 'Guardando...' : 'Creando...') 
                  : (isEditing ? 'Guardar Cambios' : 'Crear Usuario')
                }
              </button>
              <button
                type="button"
                onClick={onCancel}
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
