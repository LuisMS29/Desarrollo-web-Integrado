package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Notificacion;
import com.colegio.intranet.repository.NotificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NotificacionController {

    private final NotificacionRepository notificacionRepository;

    @GetMapping("/notificacion/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<Notificacion>> listar() {
        return ResponseEntity.ok(notificacionRepository.findAll());
    }

    @GetMapping("/notificacion/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<Notificacion> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(notificacionRepository.findById(id).orElseThrow());
    }

    @GetMapping("/usuario/{usuarioId}/notificaciones")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<Notificacion>> listarPorReceptor(@PathVariable Integer usuarioId) {
        return ResponseEntity.ok(notificacionRepository.findByReceptorIdUsuarioOrderByFechaEnvioDesc(usuarioId));
    }

    @GetMapping("/usuario/{usuarioId}/notificaciones/no-leidas")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<Notificacion>> listarNoLeidas(@PathVariable Integer usuarioId) {
        return ResponseEntity.ok(notificacionRepository.findByReceptorIdUsuarioAndLeidoFalse(usuarioId));
    }

    @PostMapping("/notificaciones")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<Notificacion> crear(@RequestBody Notificacion notificacion) {
        return ResponseEntity.ok(notificacionRepository.save(notificacion));
    }

    @PutMapping("/notificaciones/{id}/leer")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<Notificacion> marcarLeida(@PathVariable Integer id) {
        Notificacion notificacion = notificacionRepository.findById(id).orElseThrow();
        notificacion.setLeido(true);
        return ResponseEntity.ok(notificacionRepository.save(notificacion));
    }

    @DeleteMapping("/notificaciones/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        notificacionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}