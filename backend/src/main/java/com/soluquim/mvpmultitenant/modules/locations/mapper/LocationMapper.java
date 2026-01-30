package com.soluquim.mvpmultitenant.modules.locations.mapper;

import com.soluquim.mvpmultitenant.modules.locations.model.Location;
import com.soluquim.mvpmultitenant.modules.locations.model.dto.LocationRequestDTO;
import com.soluquim.mvpmultitenant.modules.locations.model.dto.LocationResponseDTO;
import com.soluquim.mvpmultitenant.modules.users.model.User;
import com.soluquim.mvpmultitenant.modules.users.model.dto.UserRequestDTO;
import com.soluquim.mvpmultitenant.modules.users.model.dto.UserResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LocationMapper {

    Location dtoToEntity(LocationRequestDTO dto);

    LocationResponseDTO toDTO(Location location);



}
