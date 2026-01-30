package com.soluquim.mvpmultitenant.modules.auth.controller;

import com.soluquim.mvpmultitenant.modules.auth.dto.AuthenticationRequestDTO;
import com.soluquim.mvpmultitenant.modules.auth.dto.AuthenticationResponseDTO;
import com.soluquim.mvpmultitenant.modules.auth.dto.LoginRequestDTO;
import com.soluquim.mvpmultitenant.modules.auth.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponseDTO> register(@Valid @RequestBody AuthenticationRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authenticationService.register(requestDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginDTO) {
        return ResponseEntity.ok(authenticationService.login(loginDTO));
    }
}
