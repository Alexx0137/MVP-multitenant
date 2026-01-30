package com.soluquim.mvpmultitenant.modules.locations.service;

import com.soluquim.mvpmultitenant.modules.locations.model.dto.LocationRequestDTO;
import com.soluquim.mvpmultitenant.modules.locations.model.dto.LocationResponseDTO;

import java.util.List;

public interface LocationService {

    LocationResponseDTO save(LocationRequestDTO locationRequestDTO);

    List<LocationResponseDTO> findAll();

    List<LocationResponseDTO> findRoots();
}
