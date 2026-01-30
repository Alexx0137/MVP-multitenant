package com.soluquim.mvpmultitenant.modules.users.model.dto;

import com.soluquim.mvpmultitenant.modules.users.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
