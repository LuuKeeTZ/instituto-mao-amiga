package com.institutomaoamiga.api.repository;

import com.institutomaoamiga.api.entity.Doacao;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DoacaoRepository extends JpaRepository<Doacao, UUID> {

    /** Doações cujo tipo de item contém o texto, sem diferenciar maiúsculas. */
    @Query("""
            select d from Doacao d
            where lower(d.tipoItem) like lower(concat('%', :filtro, '%'))
            """)
    Page<Doacao> buscarPorTipoItem(@Param("filtro") String filtro, Pageable pageable);
}
