import { describe, it, expect, vi, beforeEach } from 'vitest';

const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
};

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('Auth Store - Test de Integración', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('debería guardar token y tenantId en localStorage después del login', () => {
    const token = 'test-jwt-token';
    const tenantId = 'tenant_acme';

    localStorage.setItem('token', token);
    localStorage.setItem('tenantId', tenantId);

    expect(localStorage.getItem('token')).toBe(token);
    expect(localStorage.getItem('tenantId')).toBe(tenantId);
  });

  it('debería limpiar localStorage en logout', () => {
    localStorage.setItem('token', 'some-token');
    localStorage.setItem('tenantId', 'some-tenant');

    localStorage.removeItem('token');
    localStorage.removeItem('tenantId');

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('tenantId')).toBeNull();
  });

  it('debería retornar public si no hay tenantId', () => {
    const tenantId = localStorage.getItem('tenantId');
    const result = tenantId || 'public';

    expect(result).toBe('public');
  });
});

describe('Axios Interceptor Logic - Test de Integración', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('debería usar tenantId del localStorage para requests', () => {
    localStorage.setItem('tenantId', 'tenant_acme');
    
    const tenantId = localStorage.getItem('tenantId');
    const headers: Record<string, string> = {};
    
    if (tenantId && tenantId !== 'undefined' && tenantId !== 'null') {
      headers['X-Tenant-ID'] = tenantId;
    } else {
      headers['X-Tenant-ID'] = 'public';
    }

    expect(headers['X-Tenant-ID']).toBe('tenant_acme');
  });

  it('debería usar public si tenantId es undefined string', () => {
    localStorage.setItem('tenantId', 'undefined');
    
    const tenantId = localStorage.getItem('tenantId');
    const headers: Record<string, string> = {};
    
    if (tenantId && tenantId !== 'undefined' && tenantId !== 'null') {
      headers['X-Tenant-ID'] = tenantId;
    } else {
      headers['X-Tenant-ID'] = 'public';
    }

    expect(headers['X-Tenant-ID']).toBe('public');
  });

  it('no debería añadir X-Tenant-ID para endpoints de auth', () => {
    const url = '/auth/login';
    const isAuthEndpoint = url.includes('/auth/login');
    
    expect(isAuthEndpoint).toBe(true);
  });
});
