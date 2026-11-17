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
                        "Seg a Sex, 17h às 19h", TIPO_DISTRIBUICAO),
                ponto("Estação do Agasalho Setor Marista", "Rua 1.136, nº 77", "Setor Marista",
                        "Seg a Sex, 9h às 18h", TIPO_COLETA),
                ponto("Banco de Alimentos Setor Central", "Avenida Goiás, nº 1.010", "Setor Central",
                        "Seg a Sex, 8h às 16h", TIPO_DISTRIBUICAO),
                ponto("Ponto Amigo Jardim Goiás", "Rua 55, nº 230", "Jardim Goiás",
                        "Ter e Qui, 10h às 17h", TIPO_COLETA),
                ponto("Sopão Comunitário Setor Universitário", "Praça Universitária, nº 12", "Setor Universitário",
                        "Seg a Sex, 18h às 20h", TIPO_DISTRIBUICAO),
                ponto("Recolhe Livros Setor Oeste", "Rua 9, nº 680", "Setor Oeste",
                        "Seg a Sáb, 10h às 18h", TIPO_COLETA),
                ponto("Cesta Cheia Vila Mutirão", "Avenida Contorno, nº 1.900", "Vila Mutirão",
                        "Sábados, 7h às 11h", TIPO_DISTRIBUICAO),
                ponto("Ponto Fraterno Setor Faiçalville", "Avenida Rio Preto, nº 45", "Setor Faiçalville",
                        "Seg, Qua e Sex, 8h às 12h", TIPO_COLETA),
                ponto("Partilha do Pão Jardim Guanabara", "Rua JG-12, nº 300", "Jardim Guanabara",
                        "Ter a Sex, 7h às 9h", TIPO_DISTRIBUICAO),
                ponto("Coleta Solidária Nova Suíça", "Rua C-235, nº 160", "Nova Suíça",
                        "Seg a Sex, 13h às 19h", TIPO_COLETA),
                ponto("Armário Comunitário Setor Sul", "Rua 90, nº 520", "Setor Sul",
                        "Qua a Sáb, 9h às 15h", TIPO_DISTRIBUICAO),
                ponto("Doa Mais Setor Aeroporto", "Avenida República do Líbano, nº 880", "Setor Aeroporto",
                        "Seg a Sex, 8h às 18h", TIPO_COLETA),
                ponto("Feira do Bem Residencial Itaipu", "Avenida Itaipu, nº 33", "Residencial Itaipu",
                        "Domingos, 8h às 12h", TIPO_DISTRIBUICAO),
                ponto("Ponto Amigo Setor Criméia Leste", "Rua 24, nº 115", "Setor Criméia Leste",
                        "Ter a Sáb, 9h às 17h", TIPO_COLETA),
                ponto("Sacolão Solidário Jardim Curitiba", "Avenida Curitiba, nº 410", "Jardim Curitiba",
                        "Sex e Sáb, 8h às 14h", TIPO_DISTRIBUICAO),
                ponto("Casa Solidária Setor Negrão de Lima", "Rua Benjamin Constant, nº 270", "Setor Negrão de Lima",
                        "Seg a Sex, 9h às 17h", TIPO_COLETA),
                ponto("Refeitório Amigo Parque Atheneu", "Avenida Atlântica, nº 1.250", "Parque Atheneu",
                        "Seg a Sex, 11h às 13h", TIPO_DISTRIBUICAO));
    }
}
