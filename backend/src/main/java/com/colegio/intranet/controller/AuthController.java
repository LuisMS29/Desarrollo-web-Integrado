package com.colegio.intranet.controller;

import com.colegio.intranet.dto.LoginRequest;
import com.colegio.intranet.dto.LoginResponse;
import com.colegio.intranet.dto.RegisterRequest;
import com.colegio.intranet.dto.MessageResponse;
import com.colegio.intranet.entity.Usuario;
import com.colegio.intranet.service.AuthenticationService;
import com.colegio.intranet.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

@PostMapping("/login")
public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {

    System.out.println("ENTRO AL LOGIN");
    System.out.println("USERNAME: " + request.getUsername());
    System.out.println("PASSWORD: " + request.getPassword());

    Usuario usuario = authenticationService.authenticate(request);
    String jwtToken = jwtService.generateToken(usuario);

    return ResponseEntity.ok(new LoginResponse(
        jwtToken,
        "Bearer",
        jwtService.getExpirationTime(),
        usuario.getUsername(),
        usuario.getRol().name()
    ));
}

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        authenticationService.register(request);
        return ResponseEntity.ok(new MessageResponse("Usuario registrado exitosamente"));
    }

    @GetMapping("/profile")
    public ResponseEntity<Usuario> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/test")
    public ResponseEntity<MessageResponse> test() {
        return ResponseEntity.ok(new MessageResponse("API funcionando correctamente"));
    }
}