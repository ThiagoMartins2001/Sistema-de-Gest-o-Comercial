package CodingTechnology.SistemaDeGestao.receita.DTO;

import CodingTechnology.SistemaDeGestao.Produtos.model.enums.UnidadeMedida;
import lombok.Data;

@Data
public class ItemCalculoDTO {
    private Long produtoId;
    private Double quantidade;
    private UnidadeMedida unidadeMedida;
}
