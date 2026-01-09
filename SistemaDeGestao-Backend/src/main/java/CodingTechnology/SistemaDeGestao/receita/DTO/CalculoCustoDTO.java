package CodingTechnology.SistemaDeGestao.receita.DTO;

import lombok.Data;
import java.util.List;

@Data
public class CalculoCustoDTO {
    private List<ItemCalculoDTO> ingredientes;
    private Double margemLucro; // Porcentagem opcional para simulação
    private Integer quantidadePartes; // Opcional, para cálculo de porções
}
