package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Comunicado;
import com.colegio.intranet.entity.ComunicadoLeido;
import com.colegio.intranet.entity.Curso;
import com.colegio.intranet.entity.Usuario;
import com.colegio.intranet.repository.ComunicadoLeidoRepository;
import com.colegio.intranet.repository.ComunicadoRepository;
import com.colegio.intranet.repository.CursoRepository;
import com.colegio.intranet.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ComunicadoController {

    private final ComunicadoRepository comunicadoRepository;
    private final ComunicadoLeidoRepository comunicadoLeidoRepository;
    private final CursoRepository cursoRepository;
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
    public ResponseEntity<Comunicado> crear(@RequestBody Map<String, Object> body) {
        Usuario autor = currentUser();

        Comunicado comunicado = new Comunicado();
        comunicado.setTitulo((String) body.get("titulo"));
        comunicado.setContenido((String) body.get("contenido"));
        comunicado.setUsuarioAutor(autor);

        String dirigidoAStr = (String) body.getOrDefault("dirigidoA", "TODOS");
        comunicado.setDirigidoA(Comunicado.DirigidoA.valueOf(dirigidoAStr));

        if (body.containsKey("fechaExpiracion") && body.get("fechaExpiracion") instanceof String s && !s.isBlank()) {
            comunicado.setFechaExpiracion(java.time.LocalDate.parse(s));
        }

        // Si es CURSO, asignar el curso
        if (comunicado.getDirigidoA() == Comunicado.DirigidoA.CURSO) {
            Object cursoIdObj = body.get("cursoId");
            if (cursoIdObj == null) {
                throw new RuntimeException("cursoId es requerido cuando dirigidoA es CURSO");
            }
            Integer cursoId = Integer.valueOf(cursoIdObj.toString());
            Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado: " + cursoId));
            comunicado.setCurso(curso);
        }

        Comunicado saved = comunicadoRepository.save(comunicado);

        // Notificar según dirigidoA
        String targetRole = saved.getDirigidoA().name();
        if ("TODOS".equals(targetRole)) {
            notificacionService.notificarATodos(autor, "Nuevo comunicado",
                "Se publicó: " + saved.getTitulo(), "INFO", "comunicado");
        } else if ("CURSO".equals(targetRole) && saved.getCurso() != null) {
            notificacionService.notificarARol(autor, Usuario.Rol.ESTUDIANTE, "Nuevo comunicado para tu curso",
                saved.getTitulo(), "INFO", "comunicado");
        } else {
            try {
                Usuario.Rol rol = Usuario.Rol.valueOf(targetRole);
                notificacionService.notificarARol(autor, rol, "Nuevo comunicado",
                    "Nuevo comunicado para " + targetRole + ": " + saved.getTitulo(), "INFO", "comunicado");
            } catch (IllegalArgumentException e) {
                // rol no válido, omitir
            }
        }

        return ResponseEntity.ok(saved);
    }

    @PutMapping({"/director/comunicados/{id}", "/docente/comunicados/{id}"})
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<Comunicado> actualizar(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        Comunicado existing = comunicadoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comunicado no encontrado: " + id));

        if (body.containsKey("titulo")) {
            existing.setTitulo((String) body.get("titulo"));
        }
        if (body.containsKey("contenido")) {
            existing.setContenido((String) body.get("contenido"));
        }
        if (body.containsKey("dirigidoA")) {
            existing.setDirigidoA(Comunicado.DirigidoA.valueOf((String) body.get("dirigidoA")));
        }
        if (body.containsKey("fechaExpiracion") && body.get("fechaExpiracion") instanceof String s) {
            if (!s.isBlank()) {
                existing.setFechaExpiracion(java.time.LocalDate.parse(s));
            } else {
                existing.setFechaExpiracion(null);
            }
        }

        // Si cambia a CURSO, actualizar el curso
        if (existing.getDirigidoA() == Comunicado.DirigidoA.CURSO) {
            Object cursoIdObj = body.get("cursoId");
            if (cursoIdObj != null) {
                Integer cursoId = Integer.valueOf(cursoIdObj.toString());
                Curso curso = cursoRepository.findById(cursoId)
                    .orElseThrow(() -> new RuntimeException("Curso no encontrado: " + cursoId));
                existing.setCurso(curso);
            }
        } else {
            existing.setCurso(null);
        }

        Comunicado saved = comunicadoRepository.save(existing);

        // Notificar según dirigidoA
        Usuario autor = currentUser();
        String targetRole = saved.getDirigidoA().name();
        if ("TODOS".equals(targetRole)) {
            notificacionService.notificarATodos(autor, "Comunicado actualizado",
                "Se actualizó: " + saved.getTitulo(), "INFO", "comunicado");
        } else if ("CURSO".equals(targetRole) && saved.getCurso() != null) {
            notificacionService.notificarARol(autor, Usuario.Rol.ESTUDIANTE, "Comunicado actualizado para tu curso",
                saved.getTitulo(), "INFO", "comunicado");
        } else {
            try {
                Usuario.Rol rol = Usuario.Rol.valueOf(targetRole);
                notificacionService.notificarARol(autor, rol, "Comunicado actualizado",
                    "Comunicado actualizado para " + targetRole + ": " + saved.getTitulo(), "INFO", "comunicado");
            } catch (IllegalArgumentException e) {
                // rol no válido, omitir
            }
        }

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/admin/comunicados/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        comunicadoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/director/comunicados/{id}")
    @PreAuthorize("hasRole('DIRECTOR')")
    public ResponseEntity<Void> eliminarDirector(@PathVariable Integer id) {
        comunicadoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/docente/comunicados/{id}")
    @PreAuthorize("hasRole('DOCENTE')")
    public ResponseEntity<Void> eliminarDocente(@PathVariable Integer id) {
        Comunicado comunicado = comunicadoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comunicado no encontrado: " + id));
        // Validar que el docente sea el autor
        if (!comunicado.getUsuarioAutor().getIdUsuario().equals(currentUser().getIdUsuario())) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
        }
        comunicadoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/docente/comunicados/mios")
    @PreAuthorize("hasRole('DOCENTE')")
    public ResponseEntity<List<Comunicado>> listarMisComunicados() {
        Usuario user = currentUser();
        return ResponseEntity.ok(
            comunicadoRepository.findByUsuarioAutorIdUsuarioOrderByFechaPublicacionDesc(user.getIdUsuario())
        );
    }

    @PostMapping("/comunicados/{id}/leer")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<?> marcarLeido(@PathVariable Integer id) {
        Usuario user = currentUser();
        if (!comunicadoLeidoRepository.existsByComunicadoIdAndUsuarioId(id, user.getIdUsuario())) {
            ComunicadoLeido cl = new ComunicadoLeido();
            cl.setComunicadoId(id);
            cl.setUsuarioId(user.getIdUsuario());
            comunicadoLeidoRepository.save(cl);
        }
        return ResponseEntity.ok(Map.of("leido", true));
    }

    @GetMapping("/comunicados/leidos")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<Integer>> listarLeidos() {
        Usuario user = currentUser();
        List<ComunicadoLeido> leidos = comunicadoLeidoRepository.findByUsuarioId(user.getIdUsuario());
        return ResponseEntity.ok(
            leidos.stream().map(ComunicadoLeido::getComunicadoId).collect(Collectors.toList())
        );
    }
}