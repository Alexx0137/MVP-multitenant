package com.soluquim.mvpmultitenant.config.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class ErrorDTO {

    private String errorCode;
    private String errorMessage;
    private List<String> details;
    private LocalDateTime timestamp;
}
