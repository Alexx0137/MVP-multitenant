package com.soluquim.mvpmultitenant.modules.products.repository;

import com.soluquim.mvpmultitenant.modules.products.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByOrderByNameAsc();
    boolean existsByName(String name);
}
