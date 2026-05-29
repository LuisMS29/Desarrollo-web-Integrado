package com.colegio.intranet.dto;

import lombok.Data;

@Data
public class DocenteDTO {
    private Integer idDocente;
    private String codigoDocente;
    private String nombres;
    private String apellidos;
    private String dni;
    private String especialidad;
    private String telefono;
    private String email;
    private String username;
}