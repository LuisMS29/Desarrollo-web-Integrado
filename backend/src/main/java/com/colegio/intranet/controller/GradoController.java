package com.colegio.intranet.controller;

import com.colegio.intranet.entity.Grado;
import com.colegio.intranet.repository.GradoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GradoController {

    private final GradoRepository gradoRepository;

    @GetMapping("/grado/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<List<Grado>> listar() {
        return ResponseEntity.ok(gradoRepository.findAll());
    }

    @GetMapping("/grado/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<Grado> obtener(@PathVariable Integer id) {
        return ResponseEntity.ok(gradoRepository.findById(id).orElseThrow());
    }

    @PostMapping("/director/grados")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<?> crear(@RequestBody Grado grado) {
        if (gradoRepository.existsByNombre(grado.getNombre())) {
            return ResponseEntity.badRequest()
                    .body(new com.colegio.intranet.dto.MessageResponse("Ya existe un grado con el nombre \"" + grado.getNombre() + "\""));
        }
        if (grado.getOrden() == null) {
            int maxOrden = gradoRepository.findMaxOrden();
            grado.setOrden(maxOrden + 1);
        }
        return ResponseEntity.ok(gradoRepository.save(grado));
    }

    @PutMapping("/director/grados/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Grado grado) {
        grado.setIdGrado(id);
        Grado existente = gradoRepository.findById(id).orElse(null);
        if (existente != null && !existente.getNombre().equals(grado.getNombre())
                && gradoRepository.existsByNombre(grado.getNombre())) {
            return ResponseEntity.badRequest()
                    .body(new com.colegio.intranet.dto.MessageResponse("Ya existe otro grado con el nombre \"" + grado.getNombre() + "\""));
        }
        if (grado.getOrden() == null) {
            int maxOrden = gradoRepository.findMaxOrden();
            grado.setOrden(maxOrden + 1);
        }
        return ResponseEntity.ok(gradoRepository.save(grado));
    }

    @DeleteMapping("/admin/grados/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        gradoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}