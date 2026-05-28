package com.colegio.intranet.repository;

import com.colegio.intranet.entity.HorarioCurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HorarioCursoRepository extends JpaRepository<HorarioCurso, Integer> {
    List<HorarioCurso> findByCursoIdCurso(Integer cursoId);
}