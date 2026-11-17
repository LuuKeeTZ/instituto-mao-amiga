package com.institutomaoamiga.api.repository;

import com.institutomaoamiga.api.entity.Ponto;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PontoRepository extends JpaRepository<Ponto, UUID> {
}
