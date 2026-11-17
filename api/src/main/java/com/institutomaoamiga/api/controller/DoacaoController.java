package com.institutomaoamiga.api.controller;

import com.institutomaoamiga.api.dto.DoacaoRequestDTO;
import com.institutomaoamiga.api.dto.DoacaoResponseDTO;
import com.institutomaoamiga.api.service.DoacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/doacoes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "Doações", description = "Histórico de doações registradas")
public class DoacaoController {

    private final DoacaoService service;

    @GetMapping("/filtro")
    @Operation(operationId = "buscarPaginaDoacoes", summary = "Busca paginada pelo tipo de item, da mais nova para a mais antiga")
    public Page<DoacaoResponseDTO> buscarPagina(
            @RequestParam(required = false) String filtro,
            @ParameterObject @PageableDefault(sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable) {
        return service.buscarPagina(filtro, pageable);
    }

    @GetMapping("/{id}")
    @Operation(operationId = "buscarDoacaoPorId", summary = "Busca uma doação pelo id (404 se não existir)")
    public DoacaoResponseDTO buscarPorId(@PathVariable UUID id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @Operation(operationId = "cadastrarDoacao", summary = "Registra uma doação; a data de registro é definida pela API (400 se inválida)")
    public ResponseEntity<DoacaoResponseDTO> cadastrar(@RequestBody @Valid DoacaoRequestDTO dados) {
        DoacaoResponseDTO criada = service.cadastrar(dados);
        return ResponseEntity.created(URI.create("/api/v1/doacoes/" + criada.id())).body(criada);
    }

    @PutMapping("/{id}")
    @Operation(operationId = "atualizarDoacao", summary = "Edita uma doação mantendo id e data de registro (400 se inválida, 404 se não existir)")
    public DoacaoResponseDTO atualizar(@PathVariable UUID id, @RequestBody @Valid DoacaoRequestDTO dados) {
        return service.atualizar(id, dados);
    }

    @DeleteMapping("/{id}")
    @Operation(operationId = "excluirDoacao", summary = "Exclui uma doação (404 se não existir)")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
