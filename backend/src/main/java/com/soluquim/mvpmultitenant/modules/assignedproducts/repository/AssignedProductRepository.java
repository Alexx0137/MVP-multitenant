package com.soluquim.mvpmultitenant.modules.assignedproducts.repository;

import com.soluquim.mvpmultitenant.modules.assignedproducts.model.AssignedProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignedProductRepository extends JpaRepository<AssignedProduct, Long> {
    boolean existsByProductId(Long productId);
    Optional<AssignedProduct> findByProductId(Long productId);
    List<AssignedProduct> findAllByOrderByCreatedAtDesc();
}
