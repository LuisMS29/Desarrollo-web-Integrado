package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Curso;
import com.colegio.intranet.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CursoController {

    private final CursoRepository cursoRepository;

    @GetMapping("/curso/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<Curso>> listar() {
        return ResponseEntity.ok(cursoRepository.findAll());
    }

    @GetMapping("/curso/activos")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<Curso>> listarActivos() {
        return ResponseEntity.ok(cursoRepository.findByPeriodoAcademicoActivoTrue());
    }

    @GetMapping("/curso/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<Curso> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(cursoRepository.findById(id).orElseThrow());
    }

    @GetMapping("/docente/{docenteId}/cursos")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<List<Curso>> listarPorDocente(@PathVariable Integer docenteId) {
        return ResponseEntity.ok(cursoRepository.findByDocenteIdDocente(docenteId));
    }

    @PostMapping("/director/cursos")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<Curso> crear(@RequestBody Curso curso) {
        return ResponseEntity.ok(cursoRepository.save(curso));
    }

    @PutMapping("/director/cursos/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<Curso> actualizar(@PathVariable Integer id, @RequestBody Curso curso) {
        curso.setIdCurso(id);
        return ResponseEntity.ok(cursoRepository.save(curso));
    }

    @DeleteMapping("/admin/cursos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        cursoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}