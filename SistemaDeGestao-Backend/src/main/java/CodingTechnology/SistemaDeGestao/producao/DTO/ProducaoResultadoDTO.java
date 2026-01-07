package CodingTechnology.SistemaDeGestao.producao.DTO;

import CodingTechnology.SistemaDeGestao.Produtos.model.enums.UnidadeMedida;
import lombok.Data;

@Data
public class ProducaoResultadoDTO {
    private Long produtoId;
    private Double quantidade;
    private UnidadeMedida unidadeMedida;
    private String observacoes;
}
