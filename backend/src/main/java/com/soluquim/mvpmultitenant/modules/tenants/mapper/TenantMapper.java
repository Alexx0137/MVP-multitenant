package com.soluquim.mvpmultitenant.modules.tenants.mapper;

import com.soluquim.mvpmultitenant.modules.locations.model.Location;
import com.soluquim.mvpmultitenant.modules.locations.model.dto.LocationRequestDTO;
import com.soluquim.mvpmultitenant.modules.locations.model.dto.LocationResponseDTO;
import com.soluquim.mvpmultitenant.modules.tenants.model.Tenant;
import com.soluquim.mvpmultitenant.modules.tenants.model.dto.TenantRequestDTO;
import com.soluquim.mvpmultitenant.modules.tenants.model.dto.TenantResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TenantMapper {

    Tenant dtoToEntity(TenantRequestDTO dto);

    TenantResponseDTO toDTO(Tenant tenant);


}
