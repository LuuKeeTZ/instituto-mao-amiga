package com.institutomaoamiga.api.service;

import com.institutomaoamiga.api.dto.DoacaoRequestDTO;
import com.institutomaoamiga.api.dto.DoacaoResponseDTO;
import com.institutomaoamiga.api.entity.Doacao;
import com.institutomaoamiga.api.repository.DoacaoRepository;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DoacaoService {

    private final DoacaoRepository repository;

    @Transactional(readOnly = true)
    public Page<DoacaoResponseDTO> buscarPagina(String filtro, Pageable pageable) {
        Page<Doacao> pagina = (filtro == null || filtro.isBlank())
                ? repository.findAll(pageable)
                : repository.buscarPorTipoItem(filtro.trim(), pageable);
        return pagina.map(DoacaoResponseDTO::de);
    }

    @Transactional(readOnly = true)
    public DoacaoResponseDTO buscarPorId(UUID id) {
        return DoacaoResponseDTO.de(encontrar(id));
    }

    @Transactional
    public DoacaoResponseDTO cadastrar(DoacaoRequestDTO dados) {
        Doacao doacao = new Doacao();
        copiar(dados, doacao);
        // A data de registro é sempre a do servidor, nunca a que viria do app.
        // Truncada em milissegundos para a resposta do POST bater com o que o banco guarda.
        doacao.setCriadoEm(LocalDateTime.now().truncatedTo(ChronoUnit.MILLIS));
        return DoacaoResponseDTO.de(repository.save(doacao));
    }

    @Transactional
    public DoacaoResponseDTO atualizar(UUID id, DoacaoRequestDTO dados) {
        Doacao doacao = encontrar(id);
        copiar(dados, doacao); // criadoEm não é tocado
        return DoacaoResponseDTO.de(repository.save(doacao));
    }

    @Transactional
    public void excluir(UUID id) {
        repository.delete(encontrar(id));
    }

    private Doacao encontrar(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Doação " + id + " não encontrada."));
    }

    private static void copiar(DoacaoRequestDTO dados, Doacao doacao) {
        doacao.setTipoItem(dados.tipoItem().trim());
        doacao.setQuantidade(dados.quantidade());
        doacao.setPontoDestino(dados.pontoDestino().trim());
    }
}
