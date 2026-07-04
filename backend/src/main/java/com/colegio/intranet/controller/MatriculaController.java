package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Matricula;
import com.colegio.intranet.repository.MatriculaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MatriculaController {

    private final MatriculaRepository matriculaRepository;

    @GetMapping("/matricula/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<List<Matricula>> listar() {
        return ResponseEntity.ok(matriculaRepository.findAll());
    }

    @GetMapping("/matricula/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<Matricula> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(matriculaRepository.findById(id).orElseThrow());
    }

    @GetMapping("/estudiante/{estudianteId}/matriculas")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<Matricula>> listarPorEstudiante(@PathVariable Integer estudianteId) {
        return ResponseEntity.ok(matriculaRepository.findByEstudianteIdEstudiante(estudianteId));
    }

    // Alumnos matriculados en un curso puntual: la usa el Docente para saber
    // a quién registrarle notas/asistencia en ese curso.
    @GetMapping("/curso/{cursoId}/matriculas")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<List<Matricula>> listarPorCurso(@PathVariable Integer cursoId) {
        return ResponseEntity.ok(matriculaRepository.findByCursoIdCurso(cursoId));
    }

    @PostMapping("/director/matriculas")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<Matricula> crear(@RequestBody Matricula matricula) {
        return ResponseEntity.ok(matriculaRepository.save(matricula));
    }

    @PutMapping("/director/matriculas/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<Matricula> actualizar(@PathVariable Integer id, @RequestBody Matricula matricula) {
        matricula.setIdMatricula(id);
        return ResponseEntity.ok(matriculaRepository.save(matricula));
    }

    @DeleteMapping("/admin/matriculas/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        matriculaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}