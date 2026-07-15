package com.colegio.intranet.repository;

import com.colegio.intranet.entity.ComunicadoLeido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComunicadoLeidoRepository extends JpaRepository<ComunicadoLeido, Integer> {
    List<ComunicadoLeido> findByUsuarioId(Integer usuarioId);
    boolean existsByComunicadoIdAndUsuarioId(Integer comunicadoId, Integer usuarioId);
    Optional<ComunicadoLeido> findByComunicadoIdAndUsuarioId(Integer comunicadoId, Integer usuarioId);
    List<ComunicadoLeido> findByComunicadoIdIn(List<Integer> comunicadoIds);
}
