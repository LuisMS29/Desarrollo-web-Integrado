package com.colegio.intranet.service;

import com.colegio.intranet.entity.Notificacion;
import com.colegio.intranet.entity.Usuario;
import com.colegio.intranet.repository.NotificacionRepository;
import com.colegio.intranet.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public Notificacion crear(Usuario emisor, Usuario receptor, String titulo, String mensaje, String tipo, String referencia) {
        Notificacion n = Notificacion.builder()
                .emisor(emisor)
                .receptor(receptor)
                .titulo(titulo)
                .mensaje(mensaje)
                .tipo(tipo != null ? tipo : "INFO")
                .referencia(referencia)
                .leido(false)
                .build();
        return notificacionRepository.save(n);
    }

    @Transactional
    public Notificacion notificar(Usuario emisor, Integer receptorId, String titulo, String mensaje, String tipo, String referencia) {
        Usuario receptor = usuarioRepository.findById(receptorId)
                .orElseThrow(() -> new RuntimeException("Receptor no encontrado"));
        return crear(emisor, receptor, titulo, mensaje, tipo, referencia);
    }

    @Transactional
    public void notificarARol(Usuario emisor, Usuario.Rol rol, String titulo, String mensaje, String tipo, String referencia) {
        List<Usuario> receptores = usuarioRepository.findByRol(rol);
        for (Usuario r : receptores) {
            if (!r.getIdUsuario().equals(emisor.getIdUsuario())) {
                crear(emisor, r, titulo, mensaje, tipo, referencia);
            }
        }
    }

    @Transactional
    public void notificarATodos(Usuario emisor, String titulo, String mensaje, String tipo, String referencia) {
        List<Usuario> todos = usuarioRepository.findAll();
        for (Usuario r : todos) {
            if (!r.getIdUsuario().equals(emisor.getIdUsuario())) {
                crear(emisor, r, titulo, mensaje, tipo, referencia);
            }
        }
    }
}
