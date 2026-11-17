package com.institutomaoamiga.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.Map;

/** Corpo padrão das respostas de erro (400, 404). */
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ErroRespostaDTO(
        int status,
        String erro,
        String mensagem,
        Map<String, String> campos,
        LocalDateTime momento) {

    public static ErroRespostaDTO de(int status, String erro, String mensagem) {
        return new ErroRespostaDTO(status, erro, mensagem, Map.of(), LocalDateTime.now());
    }

    public static ErroRespostaDTO deValidacao(Map<String, String> campos) {
        return new ErroRespostaDTO(400, "Dados inválidos",
                "Corrija os campos indicados e envie de novo.", campos, LocalDateTime.now());
    }
}
