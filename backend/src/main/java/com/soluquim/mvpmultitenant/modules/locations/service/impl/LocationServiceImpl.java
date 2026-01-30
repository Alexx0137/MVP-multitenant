package com.soluquim.mvpmultitenant.modules.locations.service.impl;

import com.soluquim.mvpmultitenant.modules.locations.mapper.LocationMapper;
import com.soluquim.mvpmultitenant.modules.locations.model.Location;
import com.soluquim.mvpmultitenant.modules.locations.model.dto.LocationRequestDTO;
import com.soluquim.mvpmultitenant.modules.locations.model.dto.LocationResponseDTO;
import com.soluquim.mvpmultitenant.modules.locations.repository.LocationRepository;
import com.soluquim.mvpmultitenant.modules.locations.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    /**
     * Método para guardar una nueva ubicación.
     */
    @Override
    @Transactional
    public LocationResponseDTO save(LocationRequestDTO locationRequestDTO) {

        Location location = locationMapper.dtoToEntity(locationRequestDTO);

        if(locationRequestDTO.getParentLocationId() !=null) {
            Location parent = locationRepository.findById(locationRequestDTO.getParentLocationId())
                    .orElseThrow(() -> new RuntimeException("Error: La ubicación padre con ID " + locationRequestDTO.getParentLocationId() + " no existe."));
            location.setParentLocation(parent);
        }

        Location savedLocation = locationRepository.save(location);

        return locationMapper.toDTO(savedLocation);
    }

    /**
     * Método para encontrar todas las ubicaciones.
     */
    @Override
    @Transactional(readOnly = true)
    public List<LocationResponseDTO> findAll() {
        return locationRepository.findAll().stream()
                .map(locationMapper::toDTO)
                .collect(Collectors.toList());
    }



    /**
     * Método para encontrar las ubicaciones raíz (sedes principales) que no tienen una ubicación padre.
     */
    @Override
    @Transactional(readOnly = true)
    public List<LocationResponseDTO> findRoots() {
        return locationRepository.findByParentLocationIsNull().stream()
                .map(locationMapper::toDTO)
                .collect(Collectors.toList());
    }
}
