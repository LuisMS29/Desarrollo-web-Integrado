package com.colegio.intranet.repository;

import com.colegio.intranet.entity.PeriodoAcademico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PeriodoAcademicoRepository extends JpaRepository<PeriodoAcademico, Integer> {
    Optional<PeriodoAcademico> findByActivoTrue();
}
