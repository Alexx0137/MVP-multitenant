package com.soluquim.mvpmultitenant.modules.auth.service.impl;

import com.soluquim.mvpmultitenant.config.exception.ResourceNotFoundException;
import com.soluquim.mvpmultitenant.config.multitenancy.TenantContext;
import com.soluquim.mvpmultitenant.config.multitenancy.TenantDiscoveryService;
import com.soluquim.mvpmultitenant.modules.auth.dto.AuthenticationRequestDTO;
import com.soluquim.mvpmultitenant.modules.auth.dto.AuthenticationResponseDTO;
import com.soluquim.mvpmultitenant.modules.auth.dto.LoginRequestDTO;
import com.soluquim.mvpmultitenant.modules.auth.service.JwtTokenService;
import com.soluquim.mvpmultitenant.modules.auth.service.AuthenticationService;
import com.soluquim.mvpmultitenant.modules.tenants.repository.TenantRepository;
import com.soluquim.mvpmultitenant.modules.users.mapper.UserMapper;
import com.soluquim.mvpmultitenant.modules.users.model.User;
import com.soluquim.mvpmultitenant.modules.users.model.dto.UserRequestDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import com.soluquim.mvpmultitenant.modules.users.service.UserService;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImplement implements AuthenticationService {

    private final TenantRepository tenantRepository;
    private final JwtTokenService authService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final UserService userService;
    private final TenantDiscoveryService tenantDiscovery;

    @Override
    public AuthenticationResponseDTO register(AuthenticationRequestDTO requestDTO) {

        if (requestDTO.getTenantId() == null || requestDTO.getTenantId().isEmpty()) {
            throw new IllegalArgumentException("El Tenant ID es obligatorio para registrarse");
        }

        if (!"public".equals(requestDTO.getTenantId())) {
            boolean tenantExists = tenantRepository.existsBySchemaName(requestDTO.getTenantId());

            if (!tenantExists) {
                throw new ResourceNotFoundException("tenant.not.found");
            }
        }

        TenantContext.setCurrentTenant(requestDTO.getTenantId());

        try {
            UserRequestDTO userRequest = UserRequestDTO.builder()
                    .name(requestDTO.getName())
                    .email(requestDTO.getEmail())
                    .password(requestDTO.getPassword())
                    .role(requestDTO.getRole())
                    .status(requestDTO.getStatus())
                    .build();
            User savedUser = userService.createUserEntity(userRequest);

            String jwt = authService.generateToken(savedUser, requestDTO.getTenantId());

            return AuthenticationResponseDTO.builder()
                    .token(jwt)
                    .user(userMapper.toDTO(savedUser))
                    .build();

        } finally {
            TenantContext.clear();
        }
    }

    @Override
    public AuthenticationResponseDTO login(LoginRequestDTO loginDTO) {
        String tenantId = loginDTO.getTenantId();

        if (tenantId == null || tenantId.isEmpty()) {
            tenantId = tenantDiscovery.findTenantByEmail(loginDTO.getEmail());

            if (tenantId == null) {
                throw new ResourceNotFoundException("user.not.found");
            }
        }

        String tenantName = tenantId.equals("public") 
        ? "Global" 
        : tenantRepository.findBySchemaName(tenantId)
            .map(tenant -> tenant.getName())
            .orElse(tenantId);

        TenantContext.setCurrentTenant(tenantId);
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDTO.getEmail(),
                            loginDTO.getPassword()
                    )
            );
            User user = userService.findUserEntityByEmail(loginDTO.getEmail());
            String jwt = authService.generateToken(user, tenantId);
            return AuthenticationResponseDTO.builder()
                    .token(jwt)
                    .user(userMapper.toDTO(user))
                    .tenantName(tenantName)
                    .build();
        } finally {
            TenantContext.clear();
        }
    }
}
