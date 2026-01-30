package com.soluquim.mvpmultitenant.modules.tenants.model.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@JsonPropertyOrder({"id", "name", "nit", "schemaName", "status", "createdAt", "updatedAt"})
public class TenantResponseDTO {

    private Long id;
    private String name;
    private String nit;
    private String schemaName;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
