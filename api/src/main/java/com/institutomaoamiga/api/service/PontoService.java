package com.institutomaoamiga.api.service;

import com.institutomaoamiga.api.dto.PontoRequestDTO;
import com.institutomaoamiga.api.dto.PontoResponseDTO;
import com.institutomaoamiga.api.entity.Ponto;
import com.institutomaoamiga.api.repository.PontoRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PontoService {

    private final PontoRepository repository;

    @Transactional(readOnly = true)
    public List<PontoResponseDTO> listar() {
        return repository.findAll(Sort.by("nome")).stream().map(PontoResponseDTO::de).toList();
    }

    /** Sem filtro devolve todos os pontos, paginados; com filtro procura no nome ou no bairro. */
    @Transactional(readOnly = true)
    public Page<PontoResponseDTO> buscarPagina(String filtro, Pageable pageable) {
        Page<Ponto> pagina = (filtro == null || filtro.isBlank())
                ? repository.findAll(pageable)
                : repository.buscarPorNomeOuBairro(filtro.trim(), pageable);
        return pagina.map(PontoResponseDTO::de);
    }

    @Transactional(readOnly = true)
    public PontoResponseDTO buscarPorId(UUID id) {
        return PontoResponseDTO.de(encontrar(id));
    }

    @Transactional
    public PontoResponseDTO cadastrar(PontoRequestDTO dados) {
        Ponto ponto = new Ponto();
        copiar(dados, ponto);
        return PontoResponseDTO.de(repository.save(ponto));
    }

    @Transactional
    public PontoResponseDTO atualizar(UUID id, PontoRequestDTO dados) {
        Ponto ponto = encontrar(id);
        copiar(dados, ponto);
        return PontoResponseDTO.de(repository.save(ponto));
    }

    @Transactional
    public void excluir(UUID id) {
        repository.delete(encontrar(id));
    }

    private Ponto encontrar(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Ponto " + id + " não encontrado."));
    }

    private static void copiar(PontoRequestDTO dados, Ponto ponto) {
        ponto.setNome(dados.nome().trim());
        ponto.setEndereco(dados.endereco().trim());
        ponto.setBairro(dados.bairro().trim());
        ponto.setHorario(dados.horario().trim());
        ponto.setTipo(dados.tipo());
    }
}
