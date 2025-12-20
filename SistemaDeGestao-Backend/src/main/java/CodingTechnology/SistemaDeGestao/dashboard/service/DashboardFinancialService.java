package CodingTechnology.SistemaDeGestao.dashboard.service;

import CodingTechnology.SistemaDeGestao.producao.repository.ProducaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardFinancialService {

    private final ProducaoRepository producaoRepository;

    public Map<String, Object> getFinancialSummary() {
        Map<String, Object> summary = new HashMap<>();

        Double totalProfit = producaoRepository.findAll().stream()
                .filter(p -> p.getLucroEstimado() != null)
                .mapToDouble(p -> p.getLucroEstimado())
                .sum();

        Double totalCost = producaoRepository.findAll().stream()
                .filter(p -> p.getCustoTotal() != null)
                .mapToDouble(p -> p.getCustoTotal())
                .sum();

        long productionCount = producaoRepository.count();

        summary.put("totalProfit", totalProfit);
        summary.put("totalCost", totalCost);
        summary.put("productionCount", productionCount);
        summary.put("avgProfitPerProduction", productionCount > 0 ? totalProfit / productionCount : 0.0);

        return summary;
    }
}
