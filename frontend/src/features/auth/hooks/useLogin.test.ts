import { describe, it, expect } from 'vitest';

/**
 * Función para decodificar JWT y extraer el payload
 */
function parseJwt(token: string): { tenantId?: string; roles?: string[] } | null {
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

describe('parseJwt - Test Unitario', () => {
  it('debería extraer tenantId de un JWT válido', () => {
    const mockJwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QG1haWwuY29tIiwidGVuYW50SWQiOiJ0ZW5hbnRfYWNtZSJ9.signature';
    
    const result = parseJwt(mockJwt);
    
    expect(result).not.toBeNull();
    expect(result?.tenantId).toBe('tenant_acme');
  });

  it('debería retornar null para un JWT inválido', () => {
    const invalidJwt = 'invalid-token';
    
    const result = parseJwt(invalidJwt);
    
    expect(result).toBeNull();
  });

  it('debería manejar JWT sin tenantId', () => {
    const jwtWithoutTenant = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QG1haWwuY29tIn0.signature';
    
    const result = parseJwt(jwtWithoutTenant);
    
    expect(result).not.toBeNull();
    expect(result?.tenantId).toBeUndefined();
  });
});
