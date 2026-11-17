package com.institutomaoamiga.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Ponto de coleta (recebe doações) ou de distribuição (entrega doações). */
@Entity
@Table(name = "pontos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ponto {

    public static final String TIPO_COLETA = "coleta";
    public static final String TIPO_DISTRIBUICAO = "distribuição";

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(nullable = false, length = 200)
    private String endereco;

    @Column(nullable = false, length = 80)
    private String bairro;

    /** Texto livre, por exemplo "Seg a Sex, 8h às 17h". */
    @Column(nullable = false, length = 120)
    private String horario;

    /** "coleta" ou "distribuição". */
    @Column(nullable = false, length = 20)
    private String tipo;
}
