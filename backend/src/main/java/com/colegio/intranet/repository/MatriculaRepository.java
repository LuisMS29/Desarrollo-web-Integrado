package com.colegio.intranet.repository;

import com.colegio.intranet.entity.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatriculaRepository extends JpaRepository<Matricula, Integer> {
    List<Matricula> findByEstudianteIdEstudiante(Integer estudianteId);
    List<Matricula> findByCursoIdCurso(Integer cursoId);
    long countByCursoIdCurso(Integer cursoId);
}
