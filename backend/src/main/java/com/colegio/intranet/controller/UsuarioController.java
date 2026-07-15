package com.colegio.intranet.controller;

import com.colegio.intranet.dto.MessageResponse;
import com.colegio.intranet.entity.Usuario;
import com.colegio.intranet.repository.UsuarioRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/usuarios")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    @Value("${app.upload.dir:uploads/fotos}")
    private String uploadDir;

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(usuarioRepository.findById(id).orElseThrow());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Integer id, @RequestBody Usuario datos) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow();
        usuario.setUsername(datos.getUsername());
        usuario.setEmail(datos.getEmail());
        usuario.setRol(datos.getRol());
        return ResponseEntity.ok(usuarioRepository.save(usuario));
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

    @PostMapping("/{id}/foto")
    public ResponseEntity<?> subirFoto(@PathVariable Integer id, @RequestParam("file") MultipartFile file, HttpServletRequest request) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow();

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("El archivo está vacío"));
        }

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Eliminar foto anterior si existe
            String oldFotoUrl = usuario.getFotoUrl();
            if (oldFotoUrl != null && !oldFotoUrl.isBlank()) {
                String oldFileName = oldFotoUrl.substring(oldFotoUrl.lastIndexOf("/") + 1);
                Path oldFilePath = uploadPath.resolve(oldFileName);
                Files.deleteIfExists(oldFilePath);
            }

            // Generar nombre único
            String extension = "";
            String originalName = file.getOriginalFilename();
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }
            String fileName = "foto_" + id + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;

            // Guardar archivo
            Path targetPath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // Construir URL completa
            String baseUrl = String.format("%s://%s:%d", request.getScheme(), request.getServerName(), request.getServerPort());
            String fotoUrl = baseUrl + "/api/uploads/fotos/" + fileName;
            usuario.setFotoUrl(fotoUrl);
            usuarioRepository.save(usuario);

            return ResponseEntity.ok(Map.of("fotoUrl", fotoUrl));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Error al subir la foto: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/foto")
    public ResponseEntity<?> eliminarFoto(@PathVariable Integer id) {
        Usuario usuario = usuarioRepository.findById(id).orElseThrow();

        String fotoUrl = usuario.getFotoUrl();
        if (fotoUrl == null || fotoUrl.isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("El usuario no tiene una foto de perfil"));
        }

        try {
            String fileName = fotoUrl.substring(fotoUrl.lastIndexOf("/") + 1);
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path filePath = uploadPath.resolve(fileName);
            Files.deleteIfExists(filePath);

            usuario.setFotoUrl(null);
            usuarioRepository.save(usuario);

            return ResponseEntity.ok(new MessageResponse("Foto de perfil eliminada exitosamente"));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Error al eliminar la foto: " + e.getMessage()));
        }
    }
}