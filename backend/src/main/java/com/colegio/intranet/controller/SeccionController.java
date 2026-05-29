package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Seccion;
import com.colegio.intranet.repository.SeccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SeccionController {

    private final SeccionRepository seccionRepository;

    @GetMapping("/seccion/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<Seccion>> listar() {
        return ResponseEntity.ok(seccionRepository.findAll());
    }

    @GetMapping("/seccion/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<Seccion> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(seccionRepository.findById(id).orElseThrow());
    }

    @PostMapping("/director/secciones")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<Seccion> crear(@RequestBody Seccion seccion) {
        return ResponseEntity.ok(seccionRepository.save(seccion));
    }

    @PutMapping("/director/secciones/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<Seccion> actualizar(@PathVariable Integer id, @RequestBody Seccion seccion) {
        seccion.setIdSeccion(id);
        return ResponseEntity.ok(seccionRepository.save(seccion));
    }

    @DeleteMapping("/admin/secciones/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        seccionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}