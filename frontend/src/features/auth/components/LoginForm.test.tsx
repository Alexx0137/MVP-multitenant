import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockSetAuth = vi.fn();
vi.mock('@/stores/auth-store', () => ({
  useAuthStore: () => ({
    setAuth: mockSetAuth,
  }),
}));

vi.mock('@/api/auth', () => ({
  authService: {
    login: vi.fn(),
  },
}));

import { authService } from '@/api/auth';
import { LoginForm } from './LoginForm';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('LoginForm - Test de Componente', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería renderizar el formulario de login', () => {
    render(<LoginForm />, { wrapper: createWrapper() });
    
    expect(screen.getByPlaceholderText(/correo@ejemplo.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('debería mostrar error si campos están vacíos', async () => {
    render(<LoginForm />, { wrapper: createWrapper() });
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email.*requerido/i)).toBeInTheDocument();
    });
  });

  it('debería llamar al servicio de login con los datos correctos', async () => {
    const mockLogin = vi.mocked(authService.login);
    mockLogin.mockResolvedValue({
      token: 'eyJhbGciOiJIUzI1NiJ9.eyJ0ZW5hbnRJZCI6InB1YmxpYyJ9.test',
      user: { id: 1, name: 'Test', email: 'test@mail.com', role: 'ADMIN_GLOBAL', status: 'ACTIVE', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      tenantName: 'Global',
    });

    render(<LoginForm />, { wrapper: createWrapper() });
    
    fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), {
      target: { value: 'test@mail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@mail.com',
        password: 'password123',
      });
    });
  });
});
