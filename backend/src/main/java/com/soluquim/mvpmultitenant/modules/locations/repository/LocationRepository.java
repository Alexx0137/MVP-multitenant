package com.soluquim.mvpmultitenant.modules.locations.repository;

import com.soluquim.mvpmultitenant.modules.locations.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {

    List<Location> findByParentLocationIsNull();

    List<Location> findByParentLocationId(Long parentId);
}
