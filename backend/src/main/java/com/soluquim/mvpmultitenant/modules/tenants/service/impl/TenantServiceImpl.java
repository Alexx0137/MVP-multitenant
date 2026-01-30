package com.soluquim.mvpmultitenant.modules.tenants.service.impl;

import com.soluquim.mvpmultitenant.modules.tenants.mapper.TenantMapper;
import com.soluquim.mvpmultitenant.modules.tenants.model.Tenant;
import com.soluquim.mvpmultitenant.modules.tenants.model.dto.TenantRequestDTO;
import com.soluquim.mvpmultitenant.modules.tenants.model.dto.TenantResponseDTO;
import com.soluquim.mvpmultitenant.modules.tenants.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import com.soluquim.mvpmultitenant.config.multitenancy.TenantSchemaService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.soluquim.mvpmultitenant.modules.tenants.service.TenantService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TenantServiceImpl implements TenantService {

    private final TenantRepository tenantRepository;
    private final JdbcTemplate jdbcTemplate;
    private final TenantSchemaService liquibaseService;
    private final TenantMapper tenantMapper;

    @Override
    @Transactional(readOnly = true)
    public List<TenantResponseDTO> findAll() {
        return tenantRepository.findAll().stream()
                .map(tenantMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TenantResponseDTO save(TenantRequestDTO dto) {
        Tenant tenant = tenantMapper.dtoToEntity(dto);
        String schemaName = "tenant_" + tenant.getNit();
        tenant.setSchemaName(schemaName);

        Tenant savedTenant = tenantRepository.save(tenant);

        jdbcTemplate.execute("CREATE SCHEMA IF NOT EXISTS " + schemaName);

        liquibaseService.runUpdateOnSchema(schemaName);

        return tenantMapper.toDTO(savedTenant);
    }
}