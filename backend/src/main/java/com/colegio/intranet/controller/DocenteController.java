package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Docente;
import com.colegio.intranet.repository.DocenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DocenteController {

    private final DocenteRepository docenteRepository;

    @GetMapping("/docente/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<List<Docente>> listar() {
        return ResponseEntity.ok(docenteRepository.findAll());
    }

    @GetMapping("/docente/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<Docente> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(docenteRepository.findById(id).orElseThrow());
    }

    @PostMapping("/director/docentes")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<Docente> crear(@RequestBody Docente docente) {
        return ResponseEntity.ok(docenteRepository.save(docente));
    }

    @PutMapping("/director/docentes/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<Docente> actualizar(@PathVariable Integer id, @RequestBody Docente docente) {
        docente.setIdDocente(id);
        return ResponseEntity.ok(docenteRepository.save(docente));
    }

    @DeleteMapping("/admin/docentes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        docenteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}