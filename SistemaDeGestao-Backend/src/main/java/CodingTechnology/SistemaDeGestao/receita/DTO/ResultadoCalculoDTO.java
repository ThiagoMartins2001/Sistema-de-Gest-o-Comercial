package CodingTechnology.SistemaDeGestao.receita.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResultadoCalculoDTO {
    private Double custoTotal;
    private Double precoSugerido;
}
