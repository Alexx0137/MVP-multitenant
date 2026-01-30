package com.soluquim.mvpmultitenant.modules.auth.service;

import com.soluquim.mvpmultitenant.modules.auth.dto.AuthenticationRequestDTO;
import com.soluquim.mvpmultitenant.modules.auth.dto.AuthenticationResponseDTO;
import com.soluquim.mvpmultitenant.modules.auth.dto.LoginRequestDTO;

public interface AuthenticationService {

    AuthenticationResponseDTO register(AuthenticationRequestDTO authenticationRequestDTO);

    AuthenticationResponseDTO login(LoginRequestDTO loginRequestDTO);
}
