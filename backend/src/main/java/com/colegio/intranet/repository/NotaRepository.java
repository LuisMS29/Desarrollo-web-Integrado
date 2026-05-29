package com.colegio.intranet.repository;

import com.colegio.intranet.entity.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Integer> {
    List<Nota> findByMatriculaIdMatricula(Integer matriculaId);
    Optional<Nota> findByMatriculaIdMatriculaAndEvaluacionPeriodoIdEvaluacion(Integer matriculaId, Integer evaluacionId);
}
