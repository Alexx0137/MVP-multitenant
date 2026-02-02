package com.soluquim.mvpmultitenant.modules.auth.dto;

import com.soluquim.mvpmultitenant.modules.users.model.dto.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticationResponseDTO {

    private String token;
    private UserResponseDTO user;
    private String tenantName;
}