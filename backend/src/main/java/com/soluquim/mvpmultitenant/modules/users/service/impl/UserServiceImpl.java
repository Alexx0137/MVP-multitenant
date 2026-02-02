package com.soluquim.mvpmultitenant.modules.users.service.impl;

import com.soluquim.mvpmultitenant.config.exception.ResourceNotFoundException;
import com.soluquim.mvpmultitenant.config.exception.UserNotFoundException;
import com.soluquim.mvpmultitenant.config.multitenancy.TenantContext;
import com.soluquim.mvpmultitenant.modules.users.mapper.UserMapper;
import com.soluquim.mvpmultitenant.modules.users.model.Role;
import com.soluquim.mvpmultitenant.modules.users.model.User;
import com.soluquim.mvpmultitenant.modules.users.model.dto.UserRequestDTO;
import com.soluquim.mvpmultitenant.modules.users.model.dto.UserResponseDTO;
import com.soluquim.mvpmultitenant.modules.users.repository.UserRepository;
import com.soluquim.mvpmultitenant.modules.users.service.UserService;
import org.springframework.data.domain.Sort;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDTO> findAll() {
        return userRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDTO findById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDTO)
                .orElseThrow(() -> new UserNotFoundException("user.not.found"));
    }

    @Override
    @Transactional
    public UserResponseDTO save(UserRequestDTO userRequestDTO) {
        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new ResourceNotFoundException("user.email.already.exists");
        }
        
        if (userRequestDTO.getPassword() == null || userRequestDTO.getPassword().isBlank()) {
            throw new IllegalArgumentException("La contraseña es requerida para crear un usuario");
        }
        
        validateAndAdjustRole(userRequestDTO);
        
        User user = userMapper.dtoToEntity(userRequestDTO);
        user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        User savedUser = userRepository.save(user);

        return userMapper.toDTO(savedUser);
    }
    
    private void validateAndAdjustRole(UserRequestDTO request) {
        String currentTenant = TenantContext.getCurrentTenant();
        boolean isPublicSchema = currentTenant == null || "public".equals(currentTenant);
        
        if (isPublicSchema) {
            request.setRole(Role.ADMIN_GLOBAL);
        } else {
            if (request.getRole() == Role.ADMIN_GLOBAL) {
                throw new IllegalArgumentException("No se puede crear un ADMIN_GLOBAL en un tenant");
            }
        }
    }

    @Override
    @Transactional
    public UserResponseDTO update(Long id, UserRequestDTO userRequestDTO) {
        User existsUser = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("user.not.found"));
        
        validateAndAdjustRole(userRequestDTO);

        existsUser.setName(userRequestDTO.getName());
        existsUser.setEmail(userRequestDTO.getEmail());
        existsUser.setRole(userRequestDTO.getRole());
        existsUser.setStatus(userRequestDTO.getStatus());
        
        if (userRequestDTO.getPassword() != null && !userRequestDTO.getPassword().isBlank()) {
            existsUser.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        }

        return userMapper.toDTO(userRepository.save(existsUser));
    }

    @Override
    @Transactional
    public UserResponseDTO partialUpdate(Long id, UserRequestDTO userRequestDTO) {
        User existsUser = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("user.not.found"));
        
        if (userRequestDTO.getRole() != null) {
            validateAndAdjustRole(userRequestDTO);
        }

        if (userRequestDTO.getName() != null) {
            existsUser.setName(userRequestDTO.getName());
        }
        if (userRequestDTO.getEmail() != null) {
            existsUser.setEmail(userRequestDTO.getEmail());
        }
        if (userRequestDTO.getRole() != null) {
            existsUser.setRole(userRequestDTO.getRole());
        }
        if (userRequestDTO.getStatus() != null) {
            existsUser.setStatus(userRequestDTO.getStatus());
        }
        if (userRequestDTO.getPassword() != null && !userRequestDTO.getPassword().isBlank()) {
            existsUser.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        }

        return userMapper.toDTO(userRepository.save(existsUser));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        User existsUser = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("user.not.found"));
        userRepository.deleteById(existsUser.getId());
    }

    @Override
    public UserResponseDTO findByEmail(String email) {
        return userRepository.findByEmail(email).map(userMapper::toDTO).orElseThrow(() -> new UserNotFoundException("user.not.found"));
    }

    @Override
    @Transactional
    public User createUserEntity(UserRequestDTO userRequestDTO) {
        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new ResourceNotFoundException("user.email.already.exists");
        }
        
        if (userRequestDTO.getPassword() == null || userRequestDTO.getPassword().isBlank()) {
            throw new IllegalArgumentException("La contraseña es requerida para crear un usuario");
        }
        
        validateAndAdjustRole(userRequestDTO);
        
        User user = userMapper.dtoToEntity(userRequestDTO);
        user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));
        
        return userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public User findUserEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("user.not.found"));
    }
}
