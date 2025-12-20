package CodingTechnology.SistemaDeGestao.dashboard.service;

import CodingTechnology.SistemaDeGestao.Produtos.model.entities.Product;
import CodingTechnology.SistemaDeGestao.Produtos.repository.ProductRepository;
import CodingTechnology.SistemaDeGestao.producao.repository.ProducaoRepository;
import CodingTechnology.SistemaDeGestao.receita.repository.ReceitaRepository;
import CodingTechnology.SistemaDeGestao.user.repository.UserRepository;
import CodingTechnology.SistemaDeGestao.dashboard.DTO.DashboardStatsDTO;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final ProductRepository productRepository;
    private final ReceitaRepository receitaRepository;
    private final ProducaoRepository producaoRepository;
    private final UserRepository userRepository;

    public DashboardStatsDTO getStats() {
        List<Product> products = productRepository.findAll();
        long totalProducts = products.size();
        double totalStockValue = products.stream()
                .mapToDouble(p -> (p.getQuantidadeAtual() != null ? p.getQuantidadeAtual() : 0) *
                        (p.getPrecoCompra() != null ? p.getPrecoCompra() : 0))
                .sum();

        long totalRecipes = receitaRepository.count();
        long totalProductions = producaoRepository.count();
        long totalUsers = userRepository.count();

        return DashboardStatsDTO.builder()
                .totalProducts(totalProducts)
                .totalStockValue(totalStockValue)
                .totalRecipes(totalRecipes)
                .totalProductions(totalProductions)
                .totalUsers(totalUsers)
                .build();
    }
}
