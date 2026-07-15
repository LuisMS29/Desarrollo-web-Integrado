package com.colegio.intranet.exception;

import com.colegio.intranet.dto.MessageResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.NoSuchElementException;

/**
 * Traduce las excepciones del backend a respuestas JSON consistentes
 * ({ "message": "..." }) en vez de dejar que Spring Security devuelva
 * un 403 vacío (Http403ForbiddenEntryPoint) o que Spring MVC devuelva
 * la página de error por defecto.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

        // Usuario/contraseña incorrectos, o cualquier fallo de autenticación
        @ExceptionHandler({ BadCredentialsException.class, AuthenticationException.class,
                        AuthenticationCredentialsNotFoundException.class })
        public ResponseEntity<MessageResponse> handleAuthException(Exception ex) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new MessageResponse(ex.getMessage() != null ? ex.getMessage()
                                                : "Usuario o contraseña incorrectos"));
        }

        // Rol sin permiso para el recurso solicitado
        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<MessageResponse> handleAccessDenied(AccessDeniedException ex) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(new MessageResponse("No tienes permisos para realizar esta acción"));
        }

        // findById(...).orElseThrow() sin mensaje, ids inexistentes, etc.
        @ExceptionHandler(NoSuchElementException.class)
        public ResponseEntity<MessageResponse> handleNotFound(NoSuchElementException ex) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(new MessageResponse("El recurso solicitado no existe"));
        }

        // Violaciones de restricciones únicas/FK al guardar
        @ExceptionHandler(DataIntegrityViolationException.class)
        public ResponseEntity<MessageResponse> handleDataIntegrity(DataIntegrityViolationException ex) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(new MessageResponse(
                                                "El registro no se pudo guardar por una restricción de datos (valor duplicado o referencia inválida)"));
        }

        // Errores de validación de @Valid en los DTO (LoginRequest, RegisterRequest,
        // etc.)
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<MessageResponse> handleValidation(MethodArgumentNotValidException ex) {
                String message = ex.getBindingResult().getFieldErrors().stream()
                                .findFirst()
                                .map(err -> err.getDefaultMessage())
                                .orElse("Datos inválidos");
                return ResponseEntity.badRequest().body(new MessageResponse(message));
        }

        // Errores de negocio lanzados manualmente (ej. "El nombre de usuario ya
        // existe")
        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<MessageResponse> handleRuntime(RuntimeException ex) {
                return ResponseEntity.badRequest()
                                .body(new MessageResponse(ex.getMessage() != null ? ex.getMessage()
                                                : "Ocurrió un error al procesar la solicitud"));
        }
}