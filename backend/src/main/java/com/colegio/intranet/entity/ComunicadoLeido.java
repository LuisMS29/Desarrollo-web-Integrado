package com.colegio.intranet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "comunicado_leido",
    uniqueConstraints = @UniqueConstraint(columnNames = {"comunicado_id", "usuario_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComunicadoLeido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comunicado_leido")
    private Integer idComunicadoLeido;

    @Column(name = "comunicado_id", nullable = false)
    private Integer comunicadoId;

    @Column(name = "usuario_id", nullable = false)
    private Integer usuarioId;

    @CreationTimestamp
    @Column(name = "fecha_lectura")
    private LocalDateTime fechaLectura;
}
