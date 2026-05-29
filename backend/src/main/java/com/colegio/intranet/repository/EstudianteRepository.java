package com.colegio.intranet.repository;

import com.colegio.intranet.entity.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Integer> {
    Optional<Estudiante> findByCodigoEstudiante(String codigoEstudiante);
    Optional<Estudiante> findByUsuarioIdUsuario(Integer usuarioId);
}
