package com.colegio.intranet.repository;

import com.colegio.intranet.entity.Comunicado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComunicadoRepository extends JpaRepository<Comunicado, Integer> {
    List<Comunicado> findByDirigidoAOrDirigidoAOrderByFechaPublicacionDesc(
        Comunicado.DirigidoA dirigidoA1, Comunicado.DirigidoA dirigidoA2);

    List<Comunicado> findByUsuarioAutorIdUsuarioOrderByFechaPublicacionDesc(Integer usuarioId);
}
