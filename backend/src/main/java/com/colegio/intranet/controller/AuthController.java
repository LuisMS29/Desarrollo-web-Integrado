package com.colegio.intranet.controller;

import com.colegio.intranet.dto.LoginRequest;
import com.colegio.intranet.dto.LoginResponse;
import com.colegio.intranet.dto.RegisterRequest;
import com.colegio.intranet.dto.MessageResponse;
import com.colegio.intranet.entity.Usuario;
import com.colegio.intranet.repository.UsuarioRepository;
import com.colegio.intranet.service.AuthenticationService;
import com.colegio.intranet.service.JwtService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@SuppressWarnings("unused")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @Value("${app.upload.dir:uploads/fotos}")
    private String uploadDir;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = authenticationService.authenticate(request);
        String jwtToken = jwtService.generateToken(usuario);

        Boolean perfilCompleto = authenticationService.obtenerPerfilCompleto(usuario);
        Integer idPerfil = authenticationService.obtenerIdPerfil(usuario);

        return ResponseEntity.ok(LoginResponse.builder()
                .token(jwtToken)
                .type("Bearer")
                .expiresIn(jwtService.getExpirationTime())
                .username(usuario.getUsername())
                .email(usuario.getEmail())
                .rol(usuario.getRol().name())
                .perfilCompleto(perfilCompleto)
                .idPerfil(idPerfil)
                .idUsuario(usuario.getIdUsuario())
                .fotoUrl(usuario.getFotoUrl())
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        authenticationService.register(request);
        return ResponseEntity.ok(new MessageResponse("Usuario registrado exitosamente"));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario) authentication.getPrincipal();
        Boolean perfilCompleto = authenticationService.obtenerPerfilCompleto(usuario);
        Integer idPerfil = authenticationService.obtenerIdPerfil(usuario);
        return ResponseEntity.ok(LoginResponse.builder()
                .username(usuario.getUsername())
                .email(usuario.getEmail())
                .rol(usuario.getRol().name())
                .perfilCompleto(perfilCompleto)
                .idPerfil(idPerfil)
                .idUsuario(usuario.getIdUsuario())
                .fotoUrl(usuario.getFotoUrl())
                .build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> actualizarPerfil(@RequestBody Map<String, String> body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario) authentication.getPrincipal();

        if (body.containsKey("email")) {
            usuario.setEmail(body.get("email"));
        }

        usuarioRepository.save(usuario);
        return ResponseEntity.ok(new MessageResponse("Perfil actualizado exitosamente"));
    }

    @PostMapping("/foto")
    public ResponseEntity<?> subirFoto(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario) authentication.getPrincipal();

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("El archivo está vacío"));
        }

        try {
            // Crear directorio si no existe
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Si el usuario ya tenía foto, eliminar el archivo anterior
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
            String fileName = "foto_" + usuario.getIdUsuario() + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;

            // Guardar archivo
            Path targetPath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // Construir URL completa con el host del backend
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

    @DeleteMapping("/foto")
    public ResponseEntity<?> eliminarFoto() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario) authentication.getPrincipal();

        String fotoUrl = usuario.getFotoUrl();
        if (fotoUrl == null || fotoUrl.isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("No tienes una foto de perfil"));
        }

        try {
            // Extraer nombre del archivo de la URL
            String fileName = fotoUrl.substring(fotoUrl.lastIndexOf("/") + 1);
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path filePath = uploadPath.resolve(fileName);

            // Eliminar archivo físico si existe
            Files.deleteIfExists(filePath);

            // Limpiar la URL en la base de datos
            usuario.setFotoUrl(null);
            usuarioRepository.save(usuario);

            return ResponseEntity.ok(new MessageResponse("Foto de perfil eliminada exitosamente"));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(new MessageResponse("Error al eliminar la foto: " + e.getMessage()));
        }
    }

    @PutMapping("/password")
    public ResponseEntity<?> cambiarPassword(@RequestBody Map<String, String> body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario) authentication.getPrincipal();

        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (currentPassword == null || currentPassword.isBlank()) {
            return ResponseEntity.badRequest().body(new MessageResponse("La contraseña actual es obligatoria"));
        }
        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(new MessageResponse("La nueva contraseña debe tener al menos 6 caracteres"));
        }

        try {
            authenticationService.cambiarPassword(usuario, currentPassword, newPassword);
            return ResponseEntity.ok(new MessageResponse("Contraseña actualizada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<MessageResponse> test() {
        return ResponseEntity.ok(new MessageResponse("API funcionando correctamente"));
    }
}