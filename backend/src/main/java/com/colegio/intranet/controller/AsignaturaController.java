package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Asignatura;
import com.colegio.intranet.repository.AsignaturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AsignaturaController {

    private final AsignaturaRepository asignaturaRepository;

    @GetMapping("/asignatura/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<Asignatura>> listar() {
        return ResponseEntity.ok(asignaturaRepository.findAll());
    }

    @GetMapping("/asignatura/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<Asignatura> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(asignaturaRepository.findById(id).orElseThrow());
    }

    @PostMapping("/director/asignaturas")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<Asignatura> crear(@RequestBody Asignatura asignatura) {
        return ResponseEntity.ok(asignaturaRepository.save(asignatura));
    }

    @PutMapping("/director/asignaturas/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<Asignatura> actualizar(@PathVariable Integer id, @RequestBody Asignatura asignatura) {
        asignatura.setIdAsignatura(id);
        return ResponseEntity.ok(asignaturaRepository.save(asignatura));
    }

    @DeleteMapping("/admin/asignaturas/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        asignaturaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}