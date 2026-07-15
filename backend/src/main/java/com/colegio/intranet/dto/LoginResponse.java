package com.colegio.intranet.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private Long expiresIn;
    private String username;
    private String email;
    private String rol;
    private Boolean perfilCompleto;
    private Integer idPerfil;
    private Integer idUsuario;
    private String fotoUrl;
}