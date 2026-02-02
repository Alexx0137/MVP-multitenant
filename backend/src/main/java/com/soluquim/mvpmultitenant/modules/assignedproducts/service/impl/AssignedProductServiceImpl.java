package com.soluquim.mvpmultitenant.modules.assignedproducts.service.impl;

import com.soluquim.mvpmultitenant.config.exception.ResourceNotFoundException;
import com.soluquim.mvpmultitenant.modules.assignedproducts.model.AssignedProduct;
import com.soluquim.mvpmultitenant.modules.assignedproducts.repository.AssignedProductRepository;
import com.soluquim.mvpmultitenant.modules.assignedproducts.service.AssignedProductService;
import com.soluquim.mvpmultitenant.modules.products.mapper.ProductMapper;
import com.soluquim.mvpmultitenant.modules.products.model.dto.ProductResponseDTO;
import com.soluquim.mvpmultitenant.modules.products.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignedProductServiceImpl implements AssignedProductService {

    private final AssignedProductRepository assignedProductRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> findAssignedProducts() {
        List<Long> assignedProductIds = assignedProductRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(AssignedProduct::getProductId)
                .collect(Collectors.toList());

        return productRepository.findAllById(assignedProductIds)
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void assignProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("product.not.found");
        }
        if (assignedProductRepository.existsByProductId(productId)) {
            throw new IllegalArgumentException("El producto ya está asignado");
        }
        AssignedProduct assigned = AssignedProduct.builder()
                .productId(productId)
                .build();
        assignedProductRepository.save(assigned);
    }

    @Override
    @Transactional
    public void unassignProduct(Long productId) {
        AssignedProduct assigned = assignedProductRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("assigned.product.not.found"));
        assignedProductRepository.delete(assigned);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isProductAssigned(Long productId) {
        return assignedProductRepository.existsByProductId(productId);
    }
}
