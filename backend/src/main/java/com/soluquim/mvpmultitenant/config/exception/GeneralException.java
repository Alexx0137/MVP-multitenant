package com.soluquim.mvpmultitenant.config.exception;

import lombok.Getter;

@Getter
public abstract class GeneralException extends RuntimeException {
    private final String key;
    private final Object[] args;

    public GeneralException(String key, Object... args) {
        super(key);
        this.key = key;
        this.args = args;
    }
}