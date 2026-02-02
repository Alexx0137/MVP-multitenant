'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { tenantService } from '@/api/tenants';
import api from '@/api/axios';
import { UserRequest } from '@/api/users';
import { User } from '@/types/auth';
import UserForm from '@/components/forms/UserForm';

export default function EditTenantUserPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const tenantId = Number(params.id);
  const userId = Number(params.userId);

  const { data: tenant } = useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: () => tenantService.getById(tenantId),
    enabled: !!tenantId,
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ['tenant-user', tenantId, userId],
    queryFn: async (): Promise<User> => {
      const response = await api.get<User>(`/users/${userId}`, {
        headers: { 'X-Tenant-ID': tenant?.schemaName }
      });
      return response.data;
    },
    enabled: !!tenantId && !!userId && !!tenant?.schemaName,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<UserRequest>) => {
      const response = await api.put<User>(`/users/${userId}`, data, {
        headers: { 'X-Tenant-ID': tenant?.schemaName }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-users', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['tenant-user', tenantId, userId] });
      router.push(`/dashboard/tenants/${tenantId}/users`);
    },
  });

  if (isLoading) return <div className="p-8">Cargando...</div>;

  return (
    <UserForm
      user={user}
      isGlobalAdmin={false}
      isEditing={true}
      tenantName={tenant?.name}
      isPending={updateMutation.isPending}
      isError={updateMutation.isError}
      onSubmit={(data) => updateMutation.mutate(data)}
      onCancel={() => router.back()}
    />
  );
}
