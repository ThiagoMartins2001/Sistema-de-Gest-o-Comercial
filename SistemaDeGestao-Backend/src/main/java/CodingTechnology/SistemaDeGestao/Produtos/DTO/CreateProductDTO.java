package CodingTechnology.SistemaDeGestao.Produtos.DTO;

import lombok.Data;

@Data
public class CreateProductDTO {
    private String nome;
    private String tipoControle;
    private String unidadeMedida;
    private Double quantidadeInicial;
    private Double quantidadeAtual;
    private Double precoCompra;
    private Double precoVenda;
}
