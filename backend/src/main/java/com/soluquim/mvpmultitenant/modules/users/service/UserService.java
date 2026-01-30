package com.soluquim.mvpmultitenant.modules.users.service;

import com.soluquim.mvpmultitenant.modules.users.model.User;
import com.soluquim.mvpmultitenant.modules.users.model.dto.UserRequestDTO;
import com.soluquim.mvpmultitenant.modules.users.model.dto.UserResponseDTO;

import java.util.List;

public interface UserService {
    List<UserResponseDTO> findAll();

    UserResponseDTO findById(Long id);

    UserResponseDTO save(UserRequestDTO userRequestDTO);

    UserResponseDTO update(Long id, UserRequestDTO userRequestDTO);

    UserResponseDTO partialUpdate(Long id, UserRequestDTO userRequestDTO);

    void delete(Long id);

    UserResponseDTO findByEmail(String email);

    User createUserEntity(UserRequestDTO dto);

    User findUserEntityByEmail(String email);
}
