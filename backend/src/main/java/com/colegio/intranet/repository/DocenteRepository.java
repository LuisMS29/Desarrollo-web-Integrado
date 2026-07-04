package com.colegio.intranet.repository;

import com.colegio.intranet.entity.Docente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Integer> {
    Optional<Docente> findByCodigoDocente(String codigoDocente);
    Optional<Docente> findByUsuarioIdUsuario(Integer usuarioId);

    @Query("SELECT MAX(d.codigoDocente) FROM Docente d WHERE d.codigoDocente LIKE 'DOC%'")
    Optional<String> findMaxCodigoDocente();
}
