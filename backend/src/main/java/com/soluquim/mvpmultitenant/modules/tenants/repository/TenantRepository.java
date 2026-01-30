package com.soluquim.mvpmultitenant.modules.tenants.repository;

import com.soluquim.mvpmultitenant.modules.tenants.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface TenantRepository extends JpaRepository<Tenant, Long> {

    Optional<Tenant> findByNit(String nit);

    Optional<Tenant> findBySchemaName(String schemaName);

    boolean existsBySchemaName(String schemaName);


}
