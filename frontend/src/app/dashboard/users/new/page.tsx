'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { userService, UserRequest } from '@/api/users';
import { useAuthStore } from '@/stores/auth-store';
import UserForm from '@/components/forms/UserForm';

export default function NewUserPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { tenantId, user: currentUser } = useAuthStore();
  
  const isGlobalAdmin = currentUser?.role === 'ADMIN_GLOBAL';

  const createMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', tenantId] });
      router.push('/dashboard/users');
    },
  });

  return (
    <UserForm
      isGlobalAdmin={isGlobalAdmin}
      isEditing={false}
      isPending={createMutation.isPending}
      isError={createMutation.isError}
      onSubmit={(data) => createMutation.mutate(data as UserRequest)}
      onCancel={() => router.back()}
    />
  );
}