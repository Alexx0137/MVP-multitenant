'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Building2, UserPlus, Mail, Shield, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated) return <div className="p-8">Cargando...</div>;
  if (!user) return null;

  return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Bienvenido, {user.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Email</p>
                <p className="font-medium text-blue-800">{user.email}</p>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg flex items-center gap-3">
              <Shield className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-purple-600">Rol</p>
                <p className="font-medium text-purple-800">{user.role}</p>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-green-600">Estado</p>
                <p className="font-medium text-green-800">{user.status || 'ACTIVE'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.role === 'ADMIN_GLOBAL' && (
              <Link
                href="/dashboard/tenants/new"
                className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Building2 className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-purple-800">Nueva Empresa</p>
                  <p className="text-sm text-purple-600">Crear un nuevo tenant</p>
                </div>
              </Link>
            )}
            {(user.role === 'ADMIN_GLOBAL' || user.role === 'ADMIN_TENANT') && (
              <Link
                href="/dashboard/users/new"
                className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <UserPlus className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-blue-800">Nuevo Usuario</p>
                  <p className="text-sm text-blue-600">Agregar un usuario</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
  );
}