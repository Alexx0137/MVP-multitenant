package com.soluquim.mvpmultitenant.modules.assignedproducts.service;

import com.soluquim.mvpmultitenant.modules.products.model.dto.ProductResponseDTO;
import java.util.List;

public interface AssignedProductService {
    List<ProductResponseDTO> findAssignedProducts();
    void assignProduct(Long productId);
    void unassignProduct(Long productId);
    boolean isProductAssigned(Long productId);
}
