'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { userService } from '@/api/users';
import { useAuthStore } from '@/stores/auth-store';
import { Users, Plus, Pencil, Trash2, Lock, AlertCircle } from 'lucide-react';

export default function UsersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { tenantId, isHydrated, user: currentUser } = useAuthStore();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users', tenantId],
    queryFn: userService.getAll,
    enabled: isHydrated,
  });

  const deleteMutation = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', tenantId] });
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
        <AlertCircle className="w-5 h-5" /> Error al cargar usuarios
      </div>
    );
  }

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'ADMIN_GLOBAL':
        return { label: 'Super Admin', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' };
      case 'ADMIN_TENANT':
        return { label: 'Admin', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' };
      default:
        return { label: 'Usuario', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' };
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="bg-slate-800 rounded-t-xl p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6" /> Usuarios
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              {users?.length || 0} usuarios registrados
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/users/new')}
            className="bg-white text-blue-600 px-5 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-lg overflow-hidden">
        {users?.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-500 text-lg">No hay usuarios registrados</p>
            <button
              onClick={() => router.push('/dashboard/users/new')}
              className="mt-4 text-blue-600 hover:underline"
            >
              Crear primer usuario →
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users?.map((user) => {
                const roleConfig = getRoleConfig(user.role);
                return (
                  <tr 
                    key={user.id} 
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">
                            {user.name}
                            {user.id === currentUser?.id && (
                              <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                Tú
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{user.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${roleConfig.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${roleConfig.dot}`}></span>
                        {roleConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                        user.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        {user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/users/${user.id}`)}
                          className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {user.id !== currentUser?.id ? (
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar a "${user.name}"?`)) {
                                deleteMutation.mutate(user.id);
                              }
                            }}
                            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 rounded-md transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 text-gray-300" title="No puedes eliminarte">
                            <Lock className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}