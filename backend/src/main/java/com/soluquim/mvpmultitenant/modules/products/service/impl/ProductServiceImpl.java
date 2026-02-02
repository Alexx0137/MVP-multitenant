package com.soluquim.mvpmultitenant.modules.products.service.impl;

import com.soluquim.mvpmultitenant.config.exception.ResourceNotFoundException;
import com.soluquim.mvpmultitenant.modules.products.mapper.ProductMapper;
import com.soluquim.mvpmultitenant.modules.products.model.Product;
import com.soluquim.mvpmultitenant.modules.products.model.dto.ProductRequestDTO;
import com.soluquim.mvpmultitenant.modules.products.model.dto.ProductResponseDTO;
import com.soluquim.mvpmultitenant.modules.products.repository.ProductRepository;
import com.soluquim.mvpmultitenant.modules.products.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> findAll() {
        return productRepository.findAllByOrderByNameAsc()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDTO findById(Long id) {
        return productRepository.findById(id)
                .map(productMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("product.not.found"));
    }

    @Override
    @Transactional
    public ProductResponseDTO save(ProductRequestDTO dto) {
        if (productRepository.existsByName(dto.getName())) {
            throw new IllegalArgumentException("Ya existe un producto con ese nombre");
        }
        Product product = productMapper.toEntity(dto);
        return productMapper.toDTO(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductResponseDTO update(Long id, ProductRequestDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("product.not.found"));
        productMapper.updateEntity(dto, product);
        return productMapper.toDTO(productRepository.save(product));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("product.not.found");
        }
        productRepository.deleteById(id);
    }
}
