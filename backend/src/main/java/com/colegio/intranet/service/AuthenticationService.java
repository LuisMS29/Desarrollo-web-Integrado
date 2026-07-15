package com.colegio.intranet.service;

import com.colegio.intranet.dto.LoginRequest;
import com.colegio.intranet.dto.RegisterRequest;
import com.colegio.intranet.entity.Docente;
import com.colegio.intranet.entity.Estudiante;
import com.colegio.intranet.entity.Usuario;
import com.colegio.intranet.repository.DocenteRepository;
import com.colegio.intranet.repository.EstudianteRepository;
import com.colegio.intranet.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final EstudianteRepository estudianteRepository;
    private final DocenteRepository docenteRepository;
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

    public Boolean obtenerPerfilCompleto(Usuario usuario) {
        if (usuario.getRol() == Usuario.Rol.ESTUDIANTE) {
            return estudianteRepository.findByUsuarioIdUsuario(usuario.getIdUsuario())
                    .map(Estudiante::getPerfilCompleto)
                    .orElse(false);
        }
        if (usuario.getRol() == Usuario.Rol.DOCENTE) {
            return docenteRepository.findByUsuarioIdUsuario(usuario.getIdUsuario())
                    .map(Docente::getPerfilCompleto)
                    .orElse(false);
        }
        return true;
    }

    public Integer obtenerIdPerfil(Usuario usuario) {
        if (usuario.getRol() == Usuario.Rol.ESTUDIANTE) {
            return estudianteRepository.findByUsuarioIdUsuario(usuario.getIdUsuario())
                    .map(Estudiante::getIdEstudiante)
                    .orElse(null);
        }
        if (usuario.getRol() == Usuario.Rol.DOCENTE) {
            return docenteRepository.findByUsuarioIdUsuario(usuario.getIdUsuario())
                    .map(Docente::getIdDocente)
                    .orElse(null);
        }
        return null;
    }

    @Transactional
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
        
        usuario = usuarioRepository.save(usuario);

        try {
            if (request.getRol() == Usuario.Rol.ESTUDIANTE) {
                Estudiante estudiante = new Estudiante();
                estudiante.setCodigoEstudiante(generarCodigoEstudiante());
                estudiante.setUsuario(usuario);
                estudiante.setPerfilCompleto(false);
                estudianteRepository.save(estudiante);
            } else if (request.getRol() == Usuario.Rol.DOCENTE) {
                Docente docente = new Docente();
                docente.setCodigoDocente(generarCodigoDocente());
                docente.setUsuario(usuario);
                docente.setPerfilCompleto(false);
                docenteRepository.save(docente);
            }
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("No se pudo crear el perfil de " + request.getRol().name().toLowerCase() + ". Verifica que el código o DNI no estén duplicados.");
        }
        
        return usuario;
    }

    public void cambiarPassword(Usuario usuario, String currentPassword, String newPassword) {
        if (!passwordEncoder.matches(currentPassword, usuario.getPassword())) {
            throw new BadCredentialsException("La contraseña actual no es correcta");
        }
        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);
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

    private String generarCodigoDocente() {
        Optional<String> maxCodigo = docenteRepository.findMaxCodigoDocente();
        int next = 1;
        if (maxCodigo.isPresent() && maxCodigo.get() != null) {
            String numPart = maxCodigo.get().substring(3);
            next = Integer.parseInt(numPart) + 1;
        }
        String codigo = "DOC" + String.format("%04d", next);
        while (docenteRepository.findByCodigoDocente(codigo).isPresent()) {
            next++;
            codigo = "DOC" + String.format("%04d", next);
        }
        return codigo;
    }
}