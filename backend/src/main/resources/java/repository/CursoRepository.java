package com.colegio.intranet.repository;

import com.colegio.intranet.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Integer> {
    List<Curso> findByDocenteIdDocente(Integer docenteId);
    List<Curso> findByGradoIdGradoAndSeccionIdSeccion(Integer gradoId, Integer seccionId);
    List<Curso> findByPeriodoAcademicoActivoTrue();
}
