--liquibase formatted sql
--changeset nelson-garcia:tenant-3
CREATE TABLE IF NOT EXISTS assigned_products (
     id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
     product_id BIGINT NOT NULL,
     created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );