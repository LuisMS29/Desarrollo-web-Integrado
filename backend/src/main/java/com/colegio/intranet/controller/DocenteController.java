package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Docente;
import com.colegio.intranet.entity.Usuario;
import com.colegio.intranet.repository.DocenteRepository;
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
public class DocenteController {

    private final DocenteRepository docenteRepository;

    @GetMapping("/docente/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<List<Docente>> listar() {
        return ResponseEntity.ok(docenteRepository.findAll());
    }

    private String generarCodigoDocente() {
        Optional<String> maxCodigo = docenteRepository.findMaxCodigoDocente();
        int next = 1;
        if (maxCodigo.isPresent() && maxCodigo.get() != null) {
            String numPart = maxCodigo.get().substring(3);
            next = Integer.parseInt(numPart) + 1;
        }
        return "DOC" + String.format("%04d", next);
    }

    private Docente obtenerOCrear(Usuario usuario) {
        return docenteRepository.findByUsuarioIdUsuario(usuario.getIdUsuario())
                .orElseGet(() -> {
                    Docente nuevo = new Docente();
                    nuevo.setCodigoDocente(generarCodigoDocente());
                    nuevo.setUsuario(usuario);
                    nuevo.setPerfilCompleto(false);
                    return docenteRepository.save(nuevo);
                });
    }

    // Devuelve la ficha de docente asociada al usuario actualmente autenticado.
    // Es la forma en que el panel del Docente descubre su propio idDocente
    // sin exponer la lista completa de docentes a ese rol.
    @GetMapping("/docente/me")
    @PreAuthorize("hasRole('DOCENTE')")
    public ResponseEntity<Docente> obtenerActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return ResponseEntity.ok(obtenerOCrear(usuario));
    }

    // Permite que el docente complete su propio perfil (onboarding)
    @PutMapping("/docente/me")
    @PreAuthorize("hasRole('DOCENTE')")
    public ResponseEntity<Docente> actualizarPropio(@RequestBody Docente body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario) authentication.getPrincipal();
        Docente docente = obtenerOCrear(usuario);

        if (body.getNombres() != null) docente.setNombres(body.getNombres());
        if (body.getApellidos() != null) docente.setApellidos(body.getApellidos());
        if (body.getDni() != null) docente.setDni(body.getDni());
        if (body.getEspecialidad() != null) docente.setEspecialidad(body.getEspecialidad());
        if (body.getTelefono() != null) docente.setTelefono(body.getTelefono());
        if (body.getEmail() != null) docente.setEmail(body.getEmail());

        boolean completo = docente.getNombres() != null && !docente.getNombres().isBlank()
                && docente.getApellidos() != null && !docente.getApellidos().isBlank()
                && docente.getDni() != null && !docente.getDni().isBlank();
        docente.setPerfilCompleto(completo);

        return ResponseEntity.ok(docenteRepository.save(docente));
    }

    @GetMapping("/docente/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE')")
    public ResponseEntity<Docente> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(docenteRepository.findById(id).orElseThrow());
    }

    @PostMapping("/director/docentes")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<Docente> crear(@RequestBody Docente docente) {
        return ResponseEntity.ok(docenteRepository.save(docente));
    }

    @PutMapping("/director/docentes/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<Docente> actualizar(@PathVariable Integer id, @RequestBody Docente docente) {
        docente.setIdDocente(id);
        return ResponseEntity.ok(docenteRepository.save(docente));
    }

    @DeleteMapping("/admin/docentes/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        docenteRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}