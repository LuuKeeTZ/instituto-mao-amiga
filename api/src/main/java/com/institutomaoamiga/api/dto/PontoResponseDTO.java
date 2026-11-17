package com.institutomaoamiga.api.dto;

import com.institutomaoamiga.api.entity.Ponto;
import java.util.UUID;

/** O que a API devolve sobre um ponto. A entidade nunca sai do service. */
public record PontoResponseDTO(
        UUID id,
        String nome,
        String endereco,
        String bairro,
        String horario,
        String tipo) {

    public static PontoResponseDTO de(Ponto ponto) {
        return new PontoResponseDTO(
                ponto.getId(),
                ponto.getNome(),
                ponto.getEndereco(),
                ponto.getBairro(),
                ponto.getHorario(),
                ponto.getTipo());
    }
}
