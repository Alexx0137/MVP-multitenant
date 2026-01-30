package com.soluquim.mvpmultitenant.modules.users.mapper;


import com.soluquim.mvpmultitenant.modules.users.model.User;
import com.soluquim.mvpmultitenant.modules.users.model.dto.UserRequestDTO;
import com.soluquim.mvpmultitenant.modules.users.model.dto.UserResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User dtoToEntity(UserRequestDTO dto);

    UserResponseDTO toDTO(User user);

}
