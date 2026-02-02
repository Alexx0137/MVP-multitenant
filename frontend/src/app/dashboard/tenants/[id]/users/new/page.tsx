'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { tenantService } from '@/api/tenants';
import api from '@/api/axios';
import { UserRequest } from '@/api/users';
import { User } from '@/types/auth';
import UserForm from '@/components/forms/UserForm';

export default function NewTenantUserPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const tenantId = Number(params.id);

  const { data: tenant } = useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: () => tenantService.getById(tenantId),
    enabled: !!tenantId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: UserRequest): Promise<User> => {
      const response = await api.post<User>('/users', data, {
        headers: { 'X-Tenant-ID': tenant?.schemaName }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-users', tenantId] });
      router.push(`/dashboard/tenants/${tenantId}/users`);
    },
  });

  return (
    <UserForm
      isGlobalAdmin={false}
      isEditing={false}
      tenantName={tenant?.name}
      isPending={createMutation.isPending}
      isError={createMutation.isError}
      onSubmit={(data) => createMutation.mutate(data as UserRequest)}
      onCancel={() => router.back()}
    />
  );
}