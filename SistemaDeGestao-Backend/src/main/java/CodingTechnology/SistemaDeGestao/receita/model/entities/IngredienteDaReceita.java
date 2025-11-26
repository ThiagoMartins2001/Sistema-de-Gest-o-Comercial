package CodingTechnology.SistemaDeGestao.receita.model.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import CodingTechnology.SistemaDeGestao.Produtos.model.entities.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ingredientes_da_receita")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredienteDaReceita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receita_id", nullable = false)
    @JsonIgnore
    private Receita receita;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "produto_id", nullable = false)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Product produto;

    @Column(name = "quantidade_necessaria", nullable = false)
    private Double quantidadeNecessaria;

    @Column(columnDefinition = "TEXT")
    private String observacoes;
}
