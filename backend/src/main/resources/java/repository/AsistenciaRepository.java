package com.colegio.intranet.repository;

import com.colegio.intranet.entity.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Integer> {
    List<Asistencia> findByMatriculaIdMatricula(Integer matriculaId);
    Optional<Asistencia> findByMatriculaIdMatriculaAndFecha(Integer matriculaId, LocalDate fecha);
}
