package com.colegio.intranet.controller;

import com.colegio.intranet.entity.HorarioCurso;
import com.colegio.intranet.repository.HorarioCursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HorarioCursoController {

    private final HorarioCursoRepository horarioCursoRepository;

    @GetMapping("/horario/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<HorarioCurso>> listar() {
        return ResponseEntity.ok(horarioCursoRepository.findAll());
    }

    @GetMapping("/horario/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<HorarioCurso> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(horarioCursoRepository.findById(id).orElseThrow());
    }

    @GetMapping("/curso/{cursoId}/horarios")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<HorarioCurso>> listarPorCurso(@PathVariable Integer cursoId) {
        return ResponseEntity.ok(horarioCursoRepository.findByCursoIdCurso(cursoId));
    }

    @PostMapping("/director/horarios")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<HorarioCurso> crear(@RequestBody HorarioCurso horario) {
        return ResponseEntity.ok(horarioCursoRepository.save(horario));
    }

    @PutMapping("/director/horarios/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<HorarioCurso> actualizar(@PathVariable Integer id, @RequestBody HorarioCurso horario) {
        horario.setIdHorario(id);
        return ResponseEntity.ok(horarioCursoRepository.save(horario));
    }

    @DeleteMapping("/admin/horarios/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        horarioCursoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}