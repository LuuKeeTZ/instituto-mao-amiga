package com.institutomaoamiga.api.config;

import static com.institutomaoamiga.api.entity.Ponto.TIPO_COLETA;
import static com.institutomaoamiga.api.entity.Ponto.TIPO_DISTRIBUICAO;

import com.institutomaoamiga.api.entity.Ponto;
import com.institutomaoamiga.api.repository.PontoRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Cadastra os pontos de Goiânia na primeira vez que a API sobe.
 * Se a tabela já tiver qualquer ponto, não faz nada: assim reiniciar a API
 * não duplica os dados (o banco H2 fica gravado em arquivo).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PopularPontosIniciais implements CommandLineRunner {

    private final PontoRepository repository;

    @Override
    public void run(String... args) {
        long existentes = repository.count();
        if (existentes > 0) {
            log.info("Carga inicial ignorada: o banco já tem {} pontos.", existentes);
            return;
        }
        List<Ponto> pontos = pontosDeGoiania();
        repository.saveAll(pontos);
        log.info("Carga inicial: {} pontos cadastrados.", pontos.size());
    }

    private static Ponto ponto(String nome, String endereco, String bairro, String horario, String tipo) {
        return Ponto.builder().nome(nome).endereco(endereco).bairro(bairro).horario(horario).tipo(tipo).build();
    }

    static List<Ponto> pontosDeGoiania() {
        return List.of(
                ponto("Casa Solidária Vila Nova", "Rua 214, nº 120", "Vila Nova",
                        "Seg a Sex, 8h às 17h", TIPO_COLETA),
                ponto("Armazém do Bem Campinas", "Rua Senador Jaime, nº 455", "Campinas",
                        "Ter a Sáb, 9h às 16h", TIPO_DISTRIBUICAO),
                ponto("Ponto Amigo Jardim América", "Rua C-140, nº 300", "Jardim América",
                        "Seg, Qua e Sex, 13h às 18h", TIPO_COLETA),
                ponto("Sacolão Comunitário Novo Horizonte", "Avenida Pedro Paulo de Souza, nº 78", "Novo Horizonte",
                        "Sábados, 8h às 12h", TIPO_DISTRIBUICAO),
                ponto("Coleta Cidadã Setor Bueno", "Avenida T-7, nº 1.520", "Setor Bueno",
                        "Seg a Sáb, 9h às 19h", TIPO_COLETA),
                ponto("Cozinha Fraterna Setor Leste Universitário", "Rua 240, nº 85", "Setor Leste Universitário",
                        "Seg a Sex, 11h às 14h", TIPO_DISTRIBUICAO),
                ponto("Caixa de Doações Parque Amazônia", "Avenida Rio Verde, nº 2.300", "Parque Amazônia",
                        "Todos os dias, 10h às 20h", TIPO_COLETA),
                ponto("Rede Partilha Jardim Novo Mundo", "Avenida New York, nº 640", "Jardim Novo Mundo",
                        "Qua e Sáb, 8h às 13h", TIPO_DISTRIBUICAO),
                ponto("Guarda-Roupa Comunitário Setor Coimbra", "Rua 5-A, nº 410", "Setor Coimbra",
                        "Ter a Sex, 14h às 18h", TIPO_COLETA),
                ponto("Mesa Solidária Vila Redenção", "Rua 3, nº 95", "Vila Redenção",
                        "Seg a Sex, 17h às 19h", TIPO_DISTRIBUICAO));
    }
}
