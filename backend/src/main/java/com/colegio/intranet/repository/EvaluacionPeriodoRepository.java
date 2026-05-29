package com.colegio.intranet.repository;

import com.colegio.intranet.entity.EvaluacionPeriodo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluacionPeriodoRepository extends JpaRepository<EvaluacionPeriodo, Integer> {
    List<EvaluacionPeriodo> findByPeriodoAcademicoIdPeriodo(Integer periodoId);
}
