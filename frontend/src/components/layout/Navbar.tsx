'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { LayoutDashboard, Building2, Users, LogOut, Package } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isHydrated, tenantName } = useAuthStore();

  if (!isHydrated) {
    return (
      <nav className="bg-slate-800 text-white h-screen w-64 fixed left-0 top-0 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6" /> MultiTenant
          </h1>
        </div>
      </nav>
    );
  }
  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <nav className="bg-slate-800 text-white h-screen w-64 fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          {tenantName || 'Global'}
        </h1>
      </div>

      <div className="flex-1 py-4">
        <Link
          href="/dashboard"
          className={`flex items-center px-6 py-3 hover:bg-slate-700 transition-colors ${
            pathname === '/dashboard' ? 'bg-slate-700 border-l-4 border-blue-500' : ''
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </Link>

        {user.role === 'ADMIN_GLOBAL' && (
          <Link
            href="/dashboard/tenants"
            className={`flex items-center px-6 py-3 hover:bg-slate-700 transition-colors ${
              isActive('/dashboard/tenants') ? 'bg-slate-700 border-l-4 border-purple-500' : ''
            }`}
          >
            <Building2 className="w-5 h-5 mr-3" />
            Empresas
          </Link>
        )}

        {(user.role === 'ADMIN_GLOBAL' || user.role === 'ADMIN_TENANT') && (
          <Link
            href="/dashboard/users"
            className={`flex items-center px-6 py-3 hover:bg-slate-700 transition-colors ${
              isActive('/dashboard/users') ? 'bg-slate-700 border-l-4 border-blue-500' : ''
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Usuarios
          </Link>
        )}

        <Link
          href="/dashboard/products"
          className={`flex items-center px-6 py-3 hover:bg-slate-700 transition-colors ${
            isActive('/dashboard/products') ? 'bg-slate-700 border-l-4 border-indigo-500' : ''
          }`}
        >
          <Package className="w-5 h-5 mr-3" />
          Productos
        </Link>
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mr-3 text-white font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-slate-400">{user.role}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}
