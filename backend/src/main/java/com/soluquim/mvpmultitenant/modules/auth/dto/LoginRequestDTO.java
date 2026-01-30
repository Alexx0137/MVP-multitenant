package com.soluquim.mvpmultitenant.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDTO {

    @NotBlank(message = "{user.email.empty}")
    @Email(message = "{user.email.invalid}")
    private String email;

    @NotBlank(message = "{user.password.empty}")
    private String password;

    @NotBlank(message = "{tenant.id.empty}")
    private String tenantId;
}
