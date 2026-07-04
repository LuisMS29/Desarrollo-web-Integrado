package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Estudiante;
import com.colegio.intranet.entity.Usuario;
import com.colegio.intranet.repository.EstudianteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EstudianteController {

    private final EstudianteRepository estudianteRepository;

    @GetMapping("/estudiante/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<List<Estudiante>> listar() {
        return ResponseEntity.ok(estudianteRepository.findAll());
    }

    private String generarCodigoEstudiante() {
        Optional<String> maxCodigo = estudianteRepository.findMaxCodigoEstudiante();
        int next = 1;
        if (maxCodigo.isPresent() && maxCodigo.get() != null) {
            String numPart = maxCodigo.get().substring(3);
            next = Integer.parseInt(numPart) + 1;
        }
        String codigo = "EST" + String.format("%04d", next);
        while (estudianteRepository.findByCodigoEstudiante(codigo).isPresent()) {
            next++;
            codigo = "EST" + String.format("%04d", next);
        }
        return codigo;
    }

    private Estudiante obtenerOCrear(Usuario usuario) {
        return estudianteRepository.findByUsuarioIdUsuario(usuario.getIdUsuario())
                .orElseGet(() -> {
                    Estudiante nuevo = new Estudiante();
                    nuevo.setCodigoEstudiante(generarCodigoEstudiante());
                    nuevo.setUsuario(usuario);
                    nuevo.setPerfilCompleto(false);
                    return estudianteRepository.save(nuevo);
                });
    }

    // Devuelve la ficha de estudiante asociada al usuario autenticado, para
    // que el panel del Estudiante pueda ubicar su propio idEstudiante.
    @GetMapping("/estudiante/me")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<Estudiante> obtenerActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return ResponseEntity.ok(obtenerOCrear(usuario));
    }

    // Permite que el estudiante complete su propio perfil (onboarding)
    @PutMapping("/estudiante/me")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<Estudiante> actualizarPropio(@RequestBody Estudiante body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario) authentication.getPrincipal();
        Estudiante estudiante = obtenerOCrear(usuario);

        if (body.getNombres() != null) estudiante.setNombres(body.getNombres());
        if (body.getApellidos() != null) estudiante.setApellidos(body.getApellidos());
        if (body.getDni() != null) estudiante.setDni(body.getDni());
        if (body.getFechaNacimiento() != null) estudiante.setFechaNacimiento(body.getFechaNacimiento());
        if (body.getDireccion() != null) estudiante.setDireccion(body.getDireccion());
        if (body.getTelefono() != null) estudiante.setTelefono(body.getTelefono());

        boolean completo = estudiante.getNombres() != null && !estudiante.getNombres().isBlank()
                && estudiante.getApellidos() != null && !estudiante.getApellidos().isBlank()
                && estudiante.getDni() != null && !estudiante.getDni().isBlank();
        estudiante.setPerfilCompleto(completo);

        return ResponseEntity.ok(estudianteRepository.save(estudiante));
    }

    @GetMapping("/estudiante/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<Estudiante> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(estudianteRepository.findById(id).orElseThrow());
    }

    @PostMapping("/docente/estudiantes")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<Estudiante> crear(@RequestBody Estudiante estudiante) {
        return ResponseEntity.ok(estudianteRepository.save(estudiante));
    }

    @PutMapping("/docente/estudiantes/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<Estudiante> actualizar(@PathVariable Integer id, @RequestBody Estudiante estudiante) {
        estudiante.setIdEstudiante(id);
        boolean completo = estudiante.getNombres() != null && !estudiante.getNombres().isBlank()
                && estudiante.getApellidos() != null && !estudiante.getApellidos().isBlank()
                && estudiante.getDni() != null && !estudiante.getDni().isBlank();
        estudiante.setPerfilCompleto(completo);
        return ResponseEntity.ok(estudianteRepository.save(estudiante));
    }

    @DeleteMapping("/admin/estudiantes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        estudianteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}