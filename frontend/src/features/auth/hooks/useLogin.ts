import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import { LoginFormData } from '@/types/auth';

function parseJwt(token: string): { tenantId?: string } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (response) => {
      const payload = parseJwt(response.token);
      const tenantId = payload?.tenantId || 'public';
      
      setAuth(response.user, response.token, tenantId, response.tenantName || 'Global');
      router.push('/dashboard');
    },
  });
}