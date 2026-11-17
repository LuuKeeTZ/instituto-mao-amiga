package com.institutomaoamiga.api.repository;

import com.institutomaoamiga.api.entity.Ponto;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PontoRepository extends JpaRepository<Ponto, UUID> {

    /** Procura o texto no nome ou no bairro, sem diferenciar maiúsculas de minúsculas. */
    @Query("""
            select p from Ponto p
            where lower(p.nome) like lower(concat('%', :filtro, '%'))
               or lower(p.bairro) like lower(concat('%', :filtro, '%'))
            """)
    Page<Ponto> buscarPorNomeOuBairro(@Param("filtro") String filtro, Pageable pageable);
}
