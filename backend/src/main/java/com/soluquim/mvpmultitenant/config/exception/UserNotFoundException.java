package com.soluquim.mvpmultitenant.config.exception;

import lombok.Getter;

@Getter
public class UserNotFoundException extends RuntimeException {

    private final String key;
    private final Object[] args;

    public UserNotFoundException(String key, Object... args) {
        this.key = key;
        this.args = args;
    }

}
