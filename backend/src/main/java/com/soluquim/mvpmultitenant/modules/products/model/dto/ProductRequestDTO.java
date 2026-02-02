package com.soluquim.mvpmultitenant.modules.products.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequestDTO {
    
    @NotBlank(message = "El nombre del producto es requerido")
    private String name;
}
