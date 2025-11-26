package CodingTechnology.SistemaDeGestao.Produtos.model.entities;

import jakarta.persistence.*;
import lombok.*;

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
    private String tipoControle;
    private String unidadeMedida;
    private Double quantidadeInicial;
    private Double quantidadeAtual;
    private Double precoCompra;
    private Double precoVenda;
}