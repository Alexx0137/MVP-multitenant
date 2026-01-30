--liquibase formatted sql
--changeset nelson-garcia:tenant-1
CREATE TABLE IF NOT EXISTS locations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    parent_location_id BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_location_parent FOREIGN KEY (parent_location_id) REFERENCES locations(id)
    );