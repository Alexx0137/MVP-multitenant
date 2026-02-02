package com.soluquim.mvpmultitenant.config.multitenancy;

import com.soluquim.mvpmultitenant.modules.tenants.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TenantDiscoveryService {

    private final TenantRepository tenantRepository;
    private final JdbcTemplate jdbcTemplate;

    /**
     * Busca en qué tenant(s) existe un email
     */
    public String findTenantByEmail(String email) {
        if (existsInSchema("public", email)) {
            return "public";
        }

        List<String> schemas = tenantRepository.findAll()
                .stream()
                .map(t -> t.getSchemaName())
                .toList();

        for (String schema : schemas) {
            if (existsInSchema(schema, email)) {
                return schema;
            }
        }

        return null;
    }

    private boolean existsInSchema(String schema, String email) {
        try {
            String sql = "SELECT COUNT(*) FROM " + schema + ".users WHERE email = ?";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }
}