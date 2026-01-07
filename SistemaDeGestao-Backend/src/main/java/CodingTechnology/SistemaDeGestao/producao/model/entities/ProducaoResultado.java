package CodingTechnology.SistemaDeGestao.producao.model.entities;

import jakarta.persistence.*;
import lombok.*;

import CodingTechnology.SistemaDeGestao.Produtos.model.entities.Product;
import CodingTechnology.SistemaDeGestao.Produtos.model.enums.UnidadeMedida;

@Entity
@Table(name = "producao_resultados")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProducaoResultado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producao_id", nullable = false)
    @ToString.Exclude
    private Producao producao;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "produto_id")
    private Product produto;

    @Column(nullable = false)
    private Double quantidade;

    @Enumerated(EnumType.STRING)
    @Column(name = "unidade_medida", nullable = false)
    private UnidadeMedida unidadeMedida;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    // Construtor auxiliar para facilitar criação
    public ProducaoResultado(Product produto, Double quantidade, UnidadeMedida unidadeMedida, String observacoes) {
        this.produto = produto;
        this.quantidade = quantidade;
        this.unidadeMedida = unidadeMedida;
        this.observacoes = observacoes;
    }
}
