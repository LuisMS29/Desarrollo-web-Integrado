package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Asistencia;
import com.colegio.intranet.entity.Usuario;
import com.colegio.intranet.repository.AsistenciaRepository;
import com.colegio.intranet.repository.MatriculaRepository;
import com.colegio.intranet.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AsistenciaController {

    private final AsistenciaRepository asistenciaRepository;
    private final MatriculaRepository matriculaRepository;
    private final NotificacionService notificacionService;

    private Usuario currentUser() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping("/asistencia/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<List<Asistencia>> listar() {
        return ResponseEntity.ok(asistenciaRepository.findAll());
    }

    @GetMapping("/asistencia/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<Asistencia> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(asistenciaRepository.findById(id).orElseThrow());
    }

    @GetMapping("/estudiante/{matriculaId}/asistencias")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<Asistencia>> listarPorMatricula(@PathVariable Integer matriculaId) {
        return ResponseEntity.ok(asistenciaRepository.findByMatriculaIdMatricula(matriculaId));
    }

    @PostMapping("/docente/asistencias")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    @Transactional
    public ResponseEntity<Asistencia> crear(@RequestBody Asistencia asistencia) {
        Asistencia saved = asistenciaRepository.save(asistencia);
        notificarEstudiante(saved, "Nuevo registro de asistencia");
        notificacionService.notificarARol(currentUser(), Usuario.Rol.DIRECTOR,
            "Asistencia registrada",
            "Se registró asistencia para un estudiante.",
            "INFO", "asistencia");
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/docente/asistencias/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    @Transactional
    public ResponseEntity<Asistencia> actualizar(@PathVariable Integer id, @RequestBody Asistencia asistencia) {
        asistencia.setIdAsistencia(id);
        Asistencia saved = asistenciaRepository.save(asistencia);
        notificarEstudiante(saved, "Asistencia actualizada");
        notificacionService.notificarARol(currentUser(), Usuario.Rol.DIRECTOR,
            "Asistencia actualizada",
            "Se actualizó el registro de asistencia de un estudiante.",
            "INFO", "asistencia");
        return ResponseEntity.ok(saved);
    }

    private void notificarEstudiante(Asistencia asistencia, String accion) {
        Usuario emisor = currentUser();
        matriculaRepository.findById(asistencia.getMatricula().getIdMatricula()).ifPresent(mat -> {
            if (mat.getEstudiante() != null && mat.getEstudiante().getUsuario() != null) {
                notificacionService.notificar(
                    emisor,
                    mat.getEstudiante().getUsuario().getIdUsuario(),
                    accion,
                    "Tu asistencia ha sido " + (accion.contains("Nuevo") ? "registrada" : "actualizada")
                    + ": " + asistencia.getEstado().name() + " el " + asistencia.getFecha() + ".",
                    "INFO",
                    "asistencia"
                );
            }
        });
    }

    @DeleteMapping("/admin/asistencias/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        asistenciaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}