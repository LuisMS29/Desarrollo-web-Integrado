package com.colegio.intranet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "grado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Grado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_grado")
    private Integer idGrado;

    @Column(nullable = false, unique = true, length = 10)
    private String nombre;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Nivel nivel = Nivel.PRIMARIA;

    @Column(nullable = false, unique = true)
    private Integer orden;

    public enum Nivel {
        PRIMARIA
    }
}