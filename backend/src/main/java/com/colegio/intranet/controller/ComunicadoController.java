package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Comunicado;
import com.colegio.intranet.entity.Usuario;
import com.colegio.intranet.repository.ComunicadoRepository;
import com.colegio.intranet.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ComunicadoController {

    private final ComunicadoRepository comunicadoRepository;
    private final NotificacionService notificacionService;

    private Usuario currentUser() {
        return (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping("/comunicado/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<Comunicado>> listar() {
        return ResponseEntity.ok(comunicadoRepository.findAll());
    }

    @GetMapping("/comunicado/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<Comunicado> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(comunicadoRepository.findById(id).orElseThrow());
    }

    @GetMapping("/comunicado/publicos")
    public ResponseEntity<List<Comunicado>> listarPublicos() {
        return ResponseEntity.ok(comunicadoRepository.findByDirigidoAOrDirigidoAOrderByFechaPublicacionDesc(
            Comunicado.DirigidoA.TODOS, Comunicado.DirigidoA.TODOS));
    }

    @PostMapping({"/director/comunicados", "/docente/comunicados"})
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<Comunicado> crear(@RequestBody Comunicado comunicado) {
        Usuario autor = currentUser();
        comunicado.setUsuarioAutor(autor);
        Comunicado saved = comunicadoRepository.save(comunicado);

        // Notificar según dirigidoA
        String targetRole = comunicado.getDirigidoA().name();
        if ("TODOS".equals(targetRole)) {
            notificacionService.notificarATodos(autor, "Nuevo comunicado",
                "Se publicó: " + comunicado.getTitulo(), "INFO", "comunicado");
        } else {
            try {
                Usuario.Rol rol = Usuario.Rol.valueOf(targetRole);
                notificacionService.notificarARol(autor, rol, "Nuevo comunicado",
                    "Nuevo comunicado para " + targetRole + ": " + comunicado.getTitulo(), "INFO", "comunicado");
            } catch (IllegalArgumentException e) {
                // rol no válido, omitir
            }
        }

        return ResponseEntity.ok(saved);
    }

    @PutMapping({"/director/comunicados/{id}", "/docente/comunicados/{id}"})
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<Comunicado> actualizar(@PathVariable Integer id, @RequestBody Comunicado comunicado) {
        comunicado.setIdComunicado(id);
        comunicado.setUsuarioAutor(currentUser());
        return ResponseEntity.ok(comunicadoRepository.save(comunicado));
    }

    @DeleteMapping("/admin/comunicados/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        comunicadoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}