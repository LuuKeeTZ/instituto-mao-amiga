package com.institutomaoamiga.api.controller;

import com.institutomaoamiga.api.dto.PontoRequestDTO;
import com.institutomaoamiga.api.dto.PontoResponseDTO;
import com.institutomaoamiga.api.service.PontoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
@RequestMapping("/api/v1/pontos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "Pontos", description = "Pontos de coleta e distribuição de doações")
public class PontoController {

    private final PontoService service;

    @GetMapping
    @Operation(summary = "Lista todos os pontos, em ordem alfabética")
    public List<PontoResponseDTO> listar() {
        return service.listar();
    }

    @GetMapping("/filtro")
    @Operation(summary = "Busca paginada por nome ou bairro (10 por página, em ordem de nome)")
    public Page<PontoResponseDTO> buscarPagina(
            @RequestParam(required = false) String filtro,
            @ParameterObject @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        return service.buscarPagina(filtro, pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um ponto pelo id (404 se não existir)")
    public PontoResponseDTO buscarPorId(@PathVariable UUID id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @Operation(summary = "Cadastra um ponto (400 se faltar algum campo)")
    public ResponseEntity<PontoResponseDTO> cadastrar(@RequestBody @Valid PontoRequestDTO dados) {
        PontoResponseDTO criado = service.cadastrar(dados);
        return ResponseEntity.created(URI.create("/api/v1/pontos/" + criado.id())).body(criado);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Edita um ponto (400 se faltar campo, 404 se o id não existir)")
    public PontoResponseDTO atualizar(@PathVariable UUID id, @RequestBody @Valid PontoRequestDTO dados) {
        return service.atualizar(id, dados);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Exclui um ponto (404 se o id não existir)")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
