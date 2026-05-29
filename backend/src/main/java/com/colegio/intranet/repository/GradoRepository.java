package com.colegio.intranet.repository;

import com.colegio.intranet.entity.Grado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GradoRepository extends JpaRepository<Grado, Integer> {
}