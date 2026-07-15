package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Matricula;
import com.colegio.intranet.entity.Usuario;
import com.colegio.intranet.repository.EstudianteRepository;
import com.colegio.intranet.repository.MatriculaRepository;
import com.colegio.intranet.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MatriculaController {

    private final MatriculaRepository matriculaRepository;
    private final EstudianteRepository estudianteRepository;
    private final NotificacionService notificacionService;

    private Usuario currentUser() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

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
        Matricula saved = matriculaRepository.save(matricula);
        estudianteRepository.findById(saved.getEstudiante().getIdEstudiante()).ifPresent(est -> {
            if (est.getUsuario() != null) {
                notificacionService.notificar(currentUser(), est.getUsuario().getIdUsuario(),
                    "Nueva matrícula",
                    "Has sido matriculado en un nuevo curso.",
                    "SUCCESS", "matricula");
            }
        });
        notificacionService.notificarARol(currentUser(), Usuario.Rol.DIRECTOR,
            "Nueva matrícula registrada",
            "Se registró una nueva matrícula.",
            "INFO", "matricula");
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/director/matriculas/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    @Transactional
    public ResponseEntity<Matricula> actualizar(@PathVariable Integer id, @RequestBody Matricula matricula) {
        matricula.setIdMatricula(id);
        Matricula saved = matriculaRepository.save(matricula);
        if (saved.getEstudiante() != null && saved.getEstudiante().getUsuario() != null) {
            notificacionService.notificar(currentUser(), saved.getEstudiante().getUsuario().getIdUsuario(),
                "Matrícula actualizada",
                "Tu matrícula ha sido actualizada.",
                "INFO", "matricula");
        }
        notificacionService.notificarARol(currentUser(), Usuario.Rol.DIRECTOR,
            "Matrícula actualizada",
            "Se actualizó una matrícula.",
            "INFO", "matricula");
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/admin/matriculas/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        matriculaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}