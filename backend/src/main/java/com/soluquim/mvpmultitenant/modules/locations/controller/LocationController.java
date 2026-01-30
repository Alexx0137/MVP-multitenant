package com.soluquim.mvpmultitenant.modules.locations.controller;

import com.soluquim.mvpmultitenant.modules.locations.model.dto.LocationRequestDTO;
import com.soluquim.mvpmultitenant.modules.locations.model.dto.LocationResponseDTO;
import com.soluquim.mvpmultitenant.modules.locations.service.impl.LocationServiceImpl;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationServiceImpl locationService;

    @PostMapping
    public ResponseEntity<LocationResponseDTO> create(@Valid @RequestBody LocationRequestDTO dto) {
        return ResponseEntity.ok(locationService.save(dto));
    }

    @GetMapping
    public ResponseEntity<List<LocationResponseDTO>> getAll() {
        return ResponseEntity.ok(locationService.findAll());
    }
}