package CodingTechnology.SistemaDeGestao.producao.service;

import CodingTechnology.SistemaDeGestao.receita.model.entities.IngredienteDaReceita;
import CodingTechnology.SistemaDeGestao.receita.model.entities.Receita;
import CodingTechnology.SistemaDeGestao.receita.repository.ReceitaRepository;
import CodingTechnology.SistemaDeGestao.Produtos.service.ProductService;
import CodingTechnology.SistemaDeGestao.producao.model.entities.Producao;
import CodingTechnology.SistemaDeGestao.producao.repository.ProducaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProducaoService {

    private final ProducaoRepository producaoRepository;
    private final ReceitaRepository receitaRepository;
    private final ProductService productService;

    // Registra uma nova produção e desconta automaticamente o estoque
    @Transactional
    public Producao registrarProducao(Producao producao) {
        validarProducao(producao);

        Receita receita = receitaRepository.findByIdComIngredientes(producao.getReceita().getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Receita não encontrada com ID: " + producao.getReceita().getId()));

        producao.setReceita(receita);
        calcularEDescontarEstoque(receita, producao.getQuantidadeProduzida());
        producao.setEstoqueDescontado(true);

        return producaoRepository.save(producao);
    }

    // Calcula as quantidades necessárias e desconta do estoque
    private void calcularEDescontarEstoque(Receita receita, Integer quantidadeProduzida) {
        if (receita.getQuantidadePadraoProduzida() == null || receita.getQuantidadePadraoProduzida() <= 0) {
            throw new IllegalArgumentException(
                    "A receita precisa ter uma quantidade padrão produzida para calcular o desconto de estoque.");
        }

        if (quantidadeProduzida == null || quantidadeProduzida <= 0) {
            throw new IllegalArgumentException("A quantidade produzida deve ser maior que zero.");
        }

        if (receita.getIngredientes() == null || receita.getIngredientes().isEmpty()) {
            throw new IllegalArgumentException("A receita não possui ingredientes cadastrados.");
        }

        double fatorProporcao = (double) quantidadeProduzida / receita.getQuantidadePadraoProduzida();
        Map<Long, Double> quantidadesNecessarias = new HashMap<>();

        for (IngredienteDaReceita ingrediente : receita.getIngredientes()) {
            double quantidadeNecessaria = ingrediente.getQuantidadeNecessaria() * fatorProporcao;
            quantidadesNecessarias.put(ingrediente.getProduto().getId(), quantidadeNecessaria);

            var produto = productService.getProductById(ingrediente.getProduto().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Produto não encontrado: " + ingrediente.getProduto().getNome()));

            if (produto.getQuantidadeAtual() == null || produto.getQuantidadeAtual() < quantidadeNecessaria) {
                throw new IllegalArgumentException(
                        String.format("Estoque insuficiente de %s. Disponível: %.2f %s, Necessário: %.2f %s",
                                produto.getNome(),
                                produto.getQuantidadeAtual() != null ? produto.getQuantidadeAtual() : 0.0,
                                produto.getUnidadeMedida(),
                                quantidadeNecessaria,
                                produto.getUnidadeMedida()));
            }
        }

        for (Map.Entry<Long, Double> entry : quantidadesNecessarias.entrySet()) {
            productService.descontarEstoque(entry.getKey(), entry.getValue());
        }
    }

    // Lista todas as produções ordenadas por data (mais recentes primeiro)
    public List<Producao> listarTodasProducoes() {
        return producaoRepository.findTodasOrdenadasPorData();
    }

    // Busca uma produção por ID
    public Optional<Producao> buscarProducaoPorId(Long id) {
        return producaoRepository.findById(id);
    }

    // Busca todas as produções de uma receita específica
    public List<Producao> buscarProducoesPorReceita(Long receitaId) {
        return producaoRepository.findByReceitaId(receitaId);
    }

    // Valida os dados de uma produção
    private void validarProducao(Producao producao) {
        if (producao.getReceita() == null || producao.getReceita().getId() == null) {
            throw new IllegalArgumentException("A receita é obrigatória.");
        }
        if (producao.getQuantidadeProduzida() == null || producao.getQuantidadeProduzida() <= 0) {
            throw new IllegalArgumentException("A quantidade produzida deve ser maior que zero.");
        }
    }
}