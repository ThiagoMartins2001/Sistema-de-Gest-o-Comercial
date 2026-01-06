package CodingTechnology.SistemaDeGestao.Produtos.DTO;

import lombok.Data;

import CodingTechnology.SistemaDeGestao.Produtos.model.enums.UnidadeMedida;

@Data
public class CreateProductDTO {
    private String nome;
    private String tipoControle;
    private UnidadeMedida unidadeMedida;
    private Double quantidadeInicial;
    private Double quantidadeAtual;
    private Double precoCompra;
    private Double precoVenda;
}
