package com.soluquim.mvpmultitenant.modules.locations.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "locations")
@Getter
@Setter
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    private Boolean isActive;

    @ManyToOne(fetch = FetchType.LAZY) // relación muchos a uno
    @JoinColumn(name = "parent_location_id")
    private Location parentLocation;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // @PrePersist y @PreUpdate son métodos que se ejecutan automáticamente antes de
    // insertar o actualizar un registro en la base de datos.
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
