package com.soluquim.mvpmultitenant.modules.tenants.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TenantRequestDTO {

    @NotBlank(message = "{tenant.name.empty}")
    private String name;

    @NotBlank(message = "{tenant.nit.empty}")
    private String nit;

    @NotBlank(message = "{tenant.status.empty}")
    private String status;
}
