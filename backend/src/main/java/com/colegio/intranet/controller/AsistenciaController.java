package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Asistencia;
import com.colegio.intranet.repository.AsistenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AsistenciaController {

    private final AsistenciaRepository asistenciaRepository;

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
    public ResponseEntity<Asistencia> crear(@RequestBody Asistencia asistencia) {
        return ResponseEntity.ok(asistenciaRepository.save(asistencia));
    }

    @PutMapping("/docente/asistencias/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<Asistencia> actualizar(@PathVariable Integer id, @RequestBody Asistencia asistencia) {
        asistencia.setIdAsistencia(id);
        return ResponseEntity.ok(asistenciaRepository.save(asistencia));
    }

    @DeleteMapping("/admin/asistencias/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        asistenciaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}