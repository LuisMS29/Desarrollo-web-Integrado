package com.colegio.intranet.repository;

import com.colegio.intranet.entity.Seccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeccionRepository extends JpaRepository<Seccion, Integer> {
}