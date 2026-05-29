package com.colegio.intranet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "evaluacion_periodo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvaluacionPeriodo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evaluacion")
    private Integer idEvaluacion;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(nullable = false)
    private Integer orden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "periodo_academico_id", nullable = false)
    private PeriodoAcademico periodoAcademico;
}