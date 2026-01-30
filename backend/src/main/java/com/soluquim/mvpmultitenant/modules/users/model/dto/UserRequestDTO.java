package com.soluquim.mvpmultitenant.modules.users.model.dto;

import com.soluquim.mvpmultitenant.modules.users.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRequestDTO {

    @NotBlank(message = "{user.name.empty}")
    private String name;

    @NotBlank(message= "{user.email.empty}")
    @Email(message = "{user.email.invalid}")
    private String email;

    @NotNull(message= "{user.role.empty}")
    private Role role;

    private String status;

    @NotBlank(message = "{user.password.empty}")
    private String password;





}

