package com.institutomaoamiga.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Dados que o app envia para cadastrar ou editar um ponto. */
public record PontoRequestDTO(
        @Schema(example = "Bazar Solidário Setor Pedro Ludovico")
        @NotBlank(message = "O nome é obrigatório.")
        @Size(max = 120, message = "O nome pode ter no máximo 120 caracteres.")
        String nome,

        @Schema(example = "Rua 1.003, nº 210")
        @NotBlank(message = "O endereço é obrigatório.")
        @Size(max = 200, message = "O endereço pode ter no máximo 200 caracteres.")
        String endereco,

        @Schema(example = "Setor Pedro Ludovico")
        @NotBlank(message = "O bairro é obrigatório.")
        @Size(max = 80, message = "O bairro pode ter no máximo 80 caracteres.")
        String bairro,

        @Schema(example = "Seg a Sex, 8h às 17h")
        @NotBlank(message = "O horário é obrigatório.")
        @Size(max = 120, message = "O horário pode ter no máximo 120 caracteres.")
        String horario,

        @Schema(example = "coleta", allowableValues = {"coleta", "distribuição"})
        @NotBlank(message = "O tipo é obrigatório.")
        @Pattern(regexp = "coleta|distribuição", message = "O tipo deve ser \"coleta\" ou \"distribuição\".")
        String tipo) {
}
