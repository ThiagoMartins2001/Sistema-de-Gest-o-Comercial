package CodingTechnology.SistemaDeGestao.product.model.entities;

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

    // Tipo de controle: QUANTIDADE, PESO, VOLUME
    private String tipoControle;

    // Unidade de medida: unidade, grama, litro, etc.
    private String unidadeMedida;

    // Quantidade inicial comprada
    private Double quantidadeInicial;

    // Quantidade atual no estoque
    private Double quantidadeAtual;

    // Preço de compra (opcional)
    private Double precoCompra;

    // Preço de venda (opcional)
    private Double precoVenda;
}