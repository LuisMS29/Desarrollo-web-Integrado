package com.colegio.intranet.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class EstudianteDTO {
    private Integer idEstudiante;
    private String codigoEstudiante;
    private String nombres;
    private String apellidos;
    private String dni;
    private LocalDate fechaNacimiento;
    private String direccion;
    private String telefono;
    private String username;
}