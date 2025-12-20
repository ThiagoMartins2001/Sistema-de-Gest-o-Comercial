package CodingTechnology.SistemaDeGestao.dashboard.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDTO {
    private long totalProducts;
    private double totalStockValue;
    private long totalRecipes;
    private long totalProductions;
    private long totalUsers;
}
