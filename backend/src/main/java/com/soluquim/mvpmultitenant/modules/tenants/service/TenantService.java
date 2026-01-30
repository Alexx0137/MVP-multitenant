package com.soluquim.mvpmultitenant.modules.tenants.service;

import com.soluquim.mvpmultitenant.modules.tenants.model.dto.TenantRequestDTO;
import com.soluquim.mvpmultitenant.modules.tenants.model.dto.TenantResponseDTO;

import java.util.List;

public interface TenantService {

    List<TenantResponseDTO> findAll();

    TenantResponseDTO save(TenantRequestDTO tenantRequestDTO);


}
