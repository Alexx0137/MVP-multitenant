'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { userService, UserRequest } from '@/api/users';
import { useAuthStore } from '@/stores/auth-store';
import UserForm from '@/components/forms/UserForm';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const userId = Number(params.id);
  const { user: currentUser, tenantId } = useAuthStore();
  
  const isGlobalAdmin = currentUser?.role === 'ADMIN_GLOBAL';

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getById(userId),
    enabled: !!userId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<UserRequest>) => userService.update(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', tenantId] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      router.push('/dashboard/users');
    },
  });

  if (isLoading) return <div className="p-8">Cargando...</div>;

  return (
    <UserForm
      user={user}
      isGlobalAdmin={isGlobalAdmin}
      isEditing={true}
      isPending={updateMutation.isPending}
      isError={updateMutation.isError}
      onSubmit={(data) => updateMutation.mutate(data)}
      onCancel={() => router.back()}
    />
  );
}