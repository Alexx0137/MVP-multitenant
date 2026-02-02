package com.soluquim.mvpmultitenant.modules.assignedproducts.controller;

import com.soluquim.mvpmultitenant.modules.assignedproducts.service.AssignedProductService;
import com.soluquim.mvpmultitenant.modules.products.model.dto.ProductResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assigned-products")
@RequiredArgsConstructor
public class AssignedProductController {

    private final AssignedProductService assignedProductService;

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> findAssigned() {
        return ResponseEntity.ok(assignedProductService.findAssignedProducts());
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Void> assign(@PathVariable Long productId) {
        assignedProductService.assignProduct(productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> unassign(@PathVariable Long productId) {
        assignedProductService.unassignProduct(productId);
        return ResponseEntity.noContent().build();
    }
}
