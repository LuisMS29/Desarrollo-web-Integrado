package com.colegio.intranet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notificacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notificacion")
    private Integer idNotificacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_emisor_id", nullable = false)
    private Usuario emisor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_receptor_id", nullable = false)
    private Usuario receptor;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensaje;

    @CreationTimestamp
    @Column(name = "fecha_envio")
    private LocalDateTime fechaEnvio;

    @Column(nullable = false)
    private Boolean leido = false;
}