package com.colegio.intranet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seccion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_seccion")
    private Integer idSeccion;

    @Column(nullable = false, unique = true, length = 1)
    private String nombre;
}