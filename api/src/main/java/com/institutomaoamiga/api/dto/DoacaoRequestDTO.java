package com.institutomaoamiga.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/** Dados que o app envia. Não tem id nem criadoEm: quem define é a API. */
public record DoacaoRequestDTO(
        @Schema(example = "Roupa")
        @NotBlank(message = "O tipo de item é obrigatório.")
        @Size(max = 80, message = "O tipo de item pode ter no máximo 80 caracteres.")
        String tipoItem,

        @Schema(example = "12")
        @NotNull(message = "A quantidade é obrigatória.")
        @Positive(message = "A quantidade precisa ser maior que zero.")
        Integer quantidade,

        @Schema(example = "Casa Solidária Vila Nova")
        @NotBlank(message = "O ponto de destino é obrigatório.")
        @Size(max = 120, message = "O ponto de destino pode ter no máximo 120 caracteres.")
        String pontoDestino) {
}
