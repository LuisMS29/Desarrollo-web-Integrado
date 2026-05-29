package com.colegio.intranet.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AsistenciaDTO {
    private Integer idAsistencia;
    private String estudiante;
    private String curso;
    private LocalDate fecha;
    private String estado;
}