package com.soluquim.mvpmultitenant.modules.locations.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LocationRequestDTO {

    @NotBlank(message = "{location.name.empty}")
    private String name;

    @NotBlank(message = "{location.address.empty}")
    private String address;

    private Boolean isActive;
    private Long parentLocationId;
}
