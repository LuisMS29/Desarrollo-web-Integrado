package com.colegio.intranet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "comunicado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comunicado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comunicado")
    private Integer idComunicado;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_autor_id", nullable = false)
    private Usuario usuarioAutor;

    @CreationTimestamp
    @Column(name = "fecha_publicacion")
    private LocalDateTime fechaPublicacion;

    @Column(name = "fecha_expiracion")
    private LocalDate fechaExpiracion;

    @Column(name = "dirigido_a", nullable = false)
    @Enumerated(EnumType.STRING)
    private DirigidoA dirigidoA = DirigidoA.TODOS;

    public enum DirigidoA {
        TODOS, DOCENTE, ESTUDIANTE, DIRECTOR, ADMIN
    }
}