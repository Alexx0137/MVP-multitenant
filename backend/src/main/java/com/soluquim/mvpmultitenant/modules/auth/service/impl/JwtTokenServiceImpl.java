package com.soluquim.mvpmultitenant.modules.auth.service.impl;

import com.soluquim.mvpmultitenant.modules.auth.service.JwtTokenService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.List;


@Slf4j
@Service
public class JwtTokenServiceImpl implements JwtTokenService {

    private final long jwtExpiration;
    private final SecretKey secretKey;


    public JwtTokenServiceImpl(@Value("${jwt.expiration}") Long jwtExpiration, @Value("${jwt.secret}") String secret) {
        this.jwtExpiration = jwtExpiration;
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));    }


    @Override
    public String generateToken(UserDetails userDetails, String tenantId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities());
        claims.put("tenantId", tenantId);
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(secretKey)
                .compact();
    }

    @Override
    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUserName(token);
        boolean isTokenExpired = isTokenExpired(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired);
    }

    @Override
    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }


    public String extractTenantId(String token) {
        return extractClaim(token, claims -> claims.get("tenantId", String.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claimsResolver.apply(claims);

        } catch (Exception e) {
            log.error("Error parsing JWT {}", e.getMessage());
            throw e;
        }
    }

    public List<SimpleGrantedAuthority> extractAuthorities(String token) {
        return extractClaim(token, claims -> {
            List<Map<String, String>> roles = claims.get("roles", List.class);
            
            if (roles == null) {
                return new ArrayList<>();
            }
            
            return roles.stream()
                    .map(role -> new SimpleGrantedAuthority(role.get("authority")))
                    .collect(Collectors.toList());
        });
    }

}
