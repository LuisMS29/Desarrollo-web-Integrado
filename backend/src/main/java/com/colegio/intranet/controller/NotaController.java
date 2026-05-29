package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Nota;
import com.colegio.intranet.repository.NotaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class NotaController {

    private final NotaRepository notaRepository;

    @GetMapping("/nota/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<List<Nota>> listar() {
        return ResponseEntity.ok(notaRepository.findAll());
    }

    @GetMapping("/nota/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<Nota> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(notaRepository.findById(id).orElseThrow());
    }

    @GetMapping("/estudiante/{matriculaId}/notas")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<Nota>> listarPorMatricula(@PathVariable Integer matriculaId) {
        return ResponseEntity.ok(notaRepository.findByMatriculaIdMatricula(matriculaId));
    }

    @PostMapping("/docente/notas")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<Nota> crear(@RequestBody Nota nota) {
        return ResponseEntity.ok(notaRepository.save(nota));
    }

    @PutMapping("/docente/notas/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<Nota> actualizar(@PathVariable Integer id, @RequestBody Nota nota) {
        nota.setIdNota(id);
        return ResponseEntity.ok(notaRepository.save(nota));
    }

    @DeleteMapping("/admin/notas/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        notaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}