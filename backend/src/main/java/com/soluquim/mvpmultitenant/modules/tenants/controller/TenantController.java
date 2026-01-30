package com.soluquim.mvpmultitenant.modules.tenants.controller;

import com.soluquim.mvpmultitenant.modules.tenants.model.dto.TenantRequestDTO;
import com.soluquim.mvpmultitenant.modules.tenants.model.dto.TenantResponseDTO;
import com.soluquim.mvpmultitenant.modules.tenants.service.TenantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tenants")
@RequiredArgsConstructor
public class TenantController {

    private  final TenantService tenantService;

    @PostMapping
    public ResponseEntity<TenantResponseDTO> create(@Valid @RequestBody TenantRequestDTO tenantRequestDTO) {
        TenantResponseDTO tenantResponseDTO = tenantService.save(tenantRequestDTO);
        return ResponseEntity.ok(tenantResponseDTO);
    }

    @GetMapping
    public ResponseEntity<List<TenantResponseDTO>> getAll() {

        return ResponseEntity.ok(tenantService.findAll());
    }
}
