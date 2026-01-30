package com.soluquim.mvpmultitenant.modules.auth.service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface JwtTokenService {

    String generateToken(UserDetails userDetails, String tenantId);

    boolean isTokenValid(String token, UserDetails userDetails);

    String extractUserName(String token);

    String extractTenantId(String token);

    List<SimpleGrantedAuthority> extractAuthorities(String token);

}
