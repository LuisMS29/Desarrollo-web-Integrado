package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Nota;
import com.colegio.intranet.entity.Usuario;
import com.colegio.intranet.repository.MatriculaRepository;
import com.colegio.intranet.repository.NotaRepository;
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
public class NotaController {

    private final NotaRepository notaRepository;
    private final MatriculaRepository matriculaRepository;
    private final NotificacionService notificacionService;

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
    @Transactional
    public ResponseEntity<Nota> crear(@RequestBody Nota nota) {
        Nota saved = notaRepository.save(nota);
        notificarEstudiante(saved, "Nueva calificación registrada");
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/docente/notas/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    @Transactional
    public ResponseEntity<Nota> actualizar(@PathVariable Integer id, @RequestBody Nota nota) {
        nota.setIdNota(id);
        Nota saved = notaRepository.save(nota);
        notificarEstudiante(saved, "Calificación actualizada");
        return ResponseEntity.ok(saved);
    }

    private void notificarEstudiante(Nota nota, String accion) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario emisor = (Usuario) auth.getPrincipal();
        matriculaRepository.findById(nota.getMatricula().getIdMatricula()).ifPresent(mat -> {
            if (mat.getEstudiante() != null && mat.getEstudiante().getUsuario() != null) {
                notificacionService.notificar(
                    emisor,
                    mat.getEstudiante().getUsuario().getIdUsuario(),
                    accion,
                    "Tu calificación ha sido " + (accion.contains("Nueva") ? "registrada" : "actualizada") + ".",
                    "INFO",
                    "nota"
                );
            }
        });
    }

    @DeleteMapping("/admin/notas/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        notaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}