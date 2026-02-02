export interface Tenant {
  id: number;
  name: string;
  nit: string;
  schemaName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantRequest {
  name: string;
  nit: string;
  status: string;
}