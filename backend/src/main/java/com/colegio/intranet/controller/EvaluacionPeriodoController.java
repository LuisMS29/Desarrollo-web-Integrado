package com.colegio.intranet.controller;

import com.colegio.intranet.entity.EvaluacionPeriodo;
import com.colegio.intranet.repository.EvaluacionPeriodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EvaluacionPeriodoController {

    private final EvaluacionPeriodoRepository evaluacionPeriodoRepository;

    @GetMapping("/evaluacion/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<EvaluacionPeriodo>> listar() {
        return ResponseEntity.ok(evaluacionPeriodoRepository.findAll());
    }

    @GetMapping("/evaluacion/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<EvaluacionPeriodo> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(evaluacionPeriodoRepository.findById(id).orElseThrow());
    }

    @GetMapping("/periodo/{periodoId}/evaluaciones")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<EvaluacionPeriodo>> listarPorPeriodo(@PathVariable Integer periodoId) {
        return ResponseEntity.ok(evaluacionPeriodoRepository.findByPeriodoAcademicoIdPeriodo(periodoId));
    }

    @PostMapping("/director/evaluaciones")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<EvaluacionPeriodo> crear(@RequestBody EvaluacionPeriodo evaluacion) {
        return ResponseEntity.ok(evaluacionPeriodoRepository.save(evaluacion));
    }

    @PutMapping("/director/evaluaciones/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<EvaluacionPeriodo> actualizar(@PathVariable Integer id, @RequestBody EvaluacionPeriodo evaluacion) {
        evaluacion.setIdEvaluacion(id);
        return ResponseEntity.ok(evaluacionPeriodoRepository.save(evaluacion));
    }

    @DeleteMapping("/admin/evaluaciones/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        evaluacionPeriodoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}