package com.soluquim.mvpmultitenant.config.exception;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private final MessageSource messageSource;

    public GlobalExceptionHandler(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    private String getMessageSource(String key, Object[] args, Locale locale ) {

        return messageSource.getMessage(key, args, locale);
    }

    // Validación de argumentos
    @ExceptionHandler(value = {MethodArgumentNotValidException.class})
    public ResponseEntity<ErrorDTO> handleValidationErrors(MethodArgumentNotValidException ex) {
        Locale locale = LocaleContextHolder.getLocale();
        
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> {
                    String message = getMessageSource(error.getDefaultMessage(), null, locale);
                    return error.getField() + ": " + message;
                }).toList();
        return new ResponseEntity<>(ErrorDTO.builder()
                .errorCode("VALIDATION-400")
                .errorMessage("Validation failed")
                .details(details)
                .timestamp(LocalDateTime.now())
                .build()
                , HttpStatus.BAD_REQUEST);
    }

    // Excepción general
    @ExceptionHandler(value = {Exception.class})
    public ResponseEntity<ErrorDTO> handleExceptions(Exception exception) {

        return new ResponseEntity<>(ErrorDTO.builder()
                .errorCode("USER-500")
                .errorMessage("Internal Server Error")
                .details(List.of(exception.getMessage()))
                .timestamp( LocalDateTime.now())
                .build()
                , HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Usuario no encontrado
    @ExceptionHandler(value = {UserNotFoundException.class})
    public ResponseEntity<ErrorDTO> handleUserNotFound(UserNotFoundException exception) {

        return new ResponseEntity<>(ErrorDTO.builder()
                .errorCode("USER-404")
                .errorMessage("Not Found")
                .details(List.of(getMessageSource(exception.getKey(), exception.getArgs(), LocaleContextHolder.getLocale())))
                .timestamp( LocalDateTime.now())
                .build()
                , HttpStatus.NOT_FOUND);
    }

    // Recurso no encontrado (General)
    @ExceptionHandler(value = {ResourceNotFoundException.class})
    public ResponseEntity<ErrorDTO> handleResourceNotFound(ResourceNotFoundException exception) {
        return new ResponseEntity<>(ErrorDTO.builder()
                .errorCode("RESOURCE-404")
                .errorMessage("Not Found")
                .details(List.of(getMessageSource(exception.getKey(), exception.getArgs(), LocaleContextHolder.getLocale())))
                .timestamp(LocalDateTime.now())
                .build()
                , HttpStatus.NOT_FOUND);
    }

    // Credenciales Inválidas (Login)
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorDTO> handleBadCredentials(BadCredentialsException ex) {
        return new ResponseEntity<>(ErrorDTO.builder()
                .errorCode("AUTH-401")
                .errorMessage("No autorizado")
                .details(List.of("Correo o contraseña incorrectos"))
                .timestamp(LocalDateTime.now())
                .build(), HttpStatus.UNAUTHORIZED);
    }

    //  Datos Duplicados (Email ya existe)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorDTO> handleDatabaseViolation(DataIntegrityViolationException ex) {
        String detail = "Error de integridad de datos";
        if (ex.getMessage() != null && ex.getMessage().contains("duplicate key")) {
            detail = "El registro ya existe (Dato duplicado detectado)";
        }

        return new ResponseEntity<>(ErrorDTO.builder()
                .errorCode("DB-409")
                .errorMessage("Conflicto de datos")
                .details(List.of(detail))
                .timestamp(LocalDateTime.now())
                .build(), HttpStatus.CONFLICT);
    }
}
