package com.colegio.intranet.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class NotaDTO {
    private Integer idNota;
    private String estudiante;
    private String curso;
    private String evaluacion;
    private BigDecimal valor;
    private String observacion;
}