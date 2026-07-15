package com.colegio.intranet.repository;

import com.colegio.intranet.entity.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Integer> {
    Optional<Estudiante> findByCodigoEstudiante(String codigoEstudiante);
    Optional<Estudiante> findByUsuarioIdUsuario(Integer usuarioId);
    List<Estudiante> findByActivoTrue();

    @Query("SELECT MAX(e.codigoEstudiante) FROM Estudiante e WHERE e.codigoEstudiante LIKE 'EST%'")
    Optional<String> findMaxCodigoEstudiante();
}
