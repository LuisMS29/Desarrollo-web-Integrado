package com.colegio.intranet.service;

import com.colegio.intranet.dto.LoginRequest;
import com.colegio.intranet.dto.RegisterRequest;
import com.colegio.intranet.entity.Usuario;
import com.colegio.intranet.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public Usuario authenticate(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
                )
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Usuario o contraseña incorrectos");
        }
        
        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        usuario.setUltimoAcceso(LocalDateTime.now());
        return usuarioRepository.save(usuario);
    }

    public Usuario register(RegisterRequest request) {
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya existe");
        }
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(request.getRol());
        usuario.setActivo(true);
        
        return usuarioRepository.save(usuario);
    }
}