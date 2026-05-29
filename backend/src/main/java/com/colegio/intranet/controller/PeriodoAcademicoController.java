package com.colegio.intranet.controller;

import com.colegio.intranet.entity.PeriodoAcademico;
import com.colegio.intranet.repository.PeriodoAcademicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PeriodoAcademicoController {

    private final PeriodoAcademicoRepository periodoAcademicoRepository;

    @GetMapping("/periodo/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<PeriodoAcademico>> listar() {
        return ResponseEntity.ok(periodoAcademicoRepository.findAll());
    }

    @GetMapping("/periodo/activo")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<PeriodoAcademico> obtenerActivo() {
        return ResponseEntity.ok(periodoAcademicoRepository.findByActivoTrue().orElseThrow());
    }

    @GetMapping("/periodo/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<PeriodoAcademico> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(periodoAcademicoRepository.findById(id).orElseThrow());
    }

    @PostMapping("/director/periodos")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<PeriodoAcademico> crear(@RequestBody PeriodoAcademico periodo) {
        return ResponseEntity.ok(periodoAcademicoRepository.save(periodo));
    }

    @PutMapping("/director/periodos/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<PeriodoAcademico> actualizar(@PathVariable Integer id, @RequestBody PeriodoAcademico periodo) {
        periodo.setIdPeriodo(id);
        return ResponseEntity.ok(periodoAcademicoRepository.save(periodo));
    }

    @DeleteMapping("/admin/periodos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        periodoAcademicoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}