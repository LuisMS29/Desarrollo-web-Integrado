package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Usuario;
import com.colegio.intranet.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/usuarios")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(usuarioRepository.findById(id).orElseThrow());
    }

    @PutMapping("/{id}/activar")
    public ResponseEntity<Usuario> activar(@PathVariable Integer id) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow();
        usuario.setActivo(true);
        return ResponseEntity.ok(usuarioRepository.save(usuario));
    }

    @PutMapping("/{id}/desactivar")
    public ResponseEntity<Usuario> desactivar(@PathVariable Integer id) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow();
        usuario.setActivo(false);
        return ResponseEntity.ok(usuarioRepository.save(usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}