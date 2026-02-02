package com.soluquim.mvpmultitenant.modules.products.mapper;

import com.soluquim.mvpmultitenant.modules.products.model.Product;
import com.soluquim.mvpmultitenant.modules.products.model.dto.ProductRequestDTO;
import com.soluquim.mvpmultitenant.modules.products.model.dto.ProductResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    
    ProductResponseDTO toDTO(Product product);
    
    Product toEntity(ProductRequestDTO dto);
    
    void updateEntity(ProductRequestDTO dto, @MappingTarget Product product);
}
