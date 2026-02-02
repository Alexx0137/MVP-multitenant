package com.soluquim.mvpmultitenant.modules.products.service;

import com.soluquim.mvpmultitenant.modules.products.model.dto.ProductRequestDTO;
import com.soluquim.mvpmultitenant.modules.products.model.dto.ProductResponseDTO;

import java.util.List;

public interface ProductService {
    List<ProductResponseDTO> findAll();
    ProductResponseDTO findById(Long id);
    ProductResponseDTO save(ProductRequestDTO dto);
    ProductResponseDTO update(Long id, ProductRequestDTO dto);
    void delete(Long id);
}
