package com.colegio.intranet.dto;

import lombok.Data;

@Data
public class CursoDTO {
    private Integer idCurso;
    private String asignatura;
    private String grado;
    private String seccion;
    private String periodo;
    private String docente;
}