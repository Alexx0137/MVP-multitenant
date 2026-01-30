package com.soluquim.mvpmultitenant.modules.locations.model.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@JsonPropertyOrder({"id", "name", "address", "isActive", "parentLocationId", "createdAt", "updatedAt"})
public class LocationResponseDTO {

    private Long id;
    private String name;
    private String address;
    private Boolean isActive;
    private Long parentLocationId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

