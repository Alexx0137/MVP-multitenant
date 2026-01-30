package com.soluquim.mvpmultitenant.modules.auth.dto;

import com.soluquim.mvpmultitenant.modules.users.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthenticationRequestDTO {

    @NotBlank(message = "{user.name.empty}")
    @Size(min = 3, max = 50, message = "{user.name.size}")
    private String name;

    @NotBlank(message= "{user.email.empty}")
    @Email(message = "{user.email.invalid}")
    private String email;

    @NotNull(message= "{user.role.empty}")
    private Role role;

    private String status;

    @NotBlank(message = "{user.password.empty}")
    private String password;

    private String tenantId;
}
