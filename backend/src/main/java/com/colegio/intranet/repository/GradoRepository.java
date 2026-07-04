package com.colegio.intranet.repository;

import com.colegio.intranet.entity.Grado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;

@Repository
public interface GradoRepository extends JpaRepository<Grado, Integer> {
    @Query("SELECT COALESCE(MAX(g.orden), 0) FROM Grado g")
    Integer findMaxOrden();
    boolean existsByNombre(String nombre);
}