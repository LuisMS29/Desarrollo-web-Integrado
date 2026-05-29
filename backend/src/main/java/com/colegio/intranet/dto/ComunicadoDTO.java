package com.colegio.intranet.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ComunicadoDTO {
    private Integer idComunicado;
    private String titulo;
    private String contenido;
    private String autor;
    private LocalDateTime fechaPublicacion;
    private LocalDate fechaExpiracion;
    private String dirigidoA;
}