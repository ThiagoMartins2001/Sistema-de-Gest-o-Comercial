package CodingTechnology.SistemaDeGestao.Produtos.model.entities;

import jakarta.persistence.*;
import lombok.*;
import CodingTechnology.SistemaDeGestao.Produtos.model.enums.UnidadeMedida;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Enumerated(EnumType.STRING)
    private UnidadeMedida unidadeMedida;
    private Double quantidadeInicial;
    private Double quantidadeAtual;
    private Double precoCompra;
    private Double precoVenda;

    @Column(name = "peso_por_unidade")
    private Double pesoPorUnidade; // Peso ou volume de cada unidade/embalagem (ex: 1.0 para 1kg)
}