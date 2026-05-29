package com.colegio.intranet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "periodo_academico")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeriodoAcademico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_periodo")
    private Integer idPeriodo;

    @Column(nullable = false)
    private Integer anio;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(nullable = false)
    private Boolean activo = false;
}
