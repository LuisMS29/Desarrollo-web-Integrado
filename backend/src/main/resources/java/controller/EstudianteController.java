package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Estudiante;
import com.colegio.intranet.repository.EstudianteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EstudianteController {

    private final EstudianteRepository estudianteRepository;

    @GetMapping("/estudiante/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<List<Estudiante>> listar() {
        return ResponseEntity.ok(estudianteRepository.findAll());
    }

    @GetMapping("/estudiante/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<Estudiante> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(estudianteRepository.findById(id).orElseThrow());
    }

    @PostMapping("/docente/estudiantes")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<Estudiante> crear(@RequestBody Estudiante estudiante) {
        return ResponseEntity.ok(estudianteRepository.save(estudiante));
    }

    @PutMapping("/docente/estudiantes/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<Estudiante> actualizar(@PathVariable Integer id, @RequestBody Estudiante estudiante) {
        estudiante.setIdEstudiante(id);
        return ResponseEntity.ok(estudianteRepository.save(estudiante));
    }

    @DeleteMapping("/admin/estudiantes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        estudianteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}