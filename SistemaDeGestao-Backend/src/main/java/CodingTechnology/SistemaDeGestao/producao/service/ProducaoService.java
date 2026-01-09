package CodingTechnology.SistemaDeGestao.producao.service;

import CodingTechnology.SistemaDeGestao.receita.model.entities.IngredienteDaReceita;
import CodingTechnology.SistemaDeGestao.receita.model.entities.Receita;
import CodingTechnology.SistemaDeGestao.receita.repository.ReceitaRepository;
import CodingTechnology.SistemaDeGestao.Produtos.model.entities.Product;
import CodingTechnology.SistemaDeGestao.Produtos.service.ProductService;
import CodingTechnology.SistemaDeGestao.producao.model.entities.Producao;
import CodingTechnology.SistemaDeGestao.producao.model.entities.ProducaoResultado;
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
    private final CodingTechnology.SistemaDeGestao.Produtos.repository.ProductRepository productRepository;

    // Registra uma nova produção e desconta automaticamente o estoque
    @Transactional
    public Producao registrarProducao(Producao producao) {
        validarProducao(producao);

        Receita receita = receitaRepository.findByIdComIngredientes(producao.getReceita().getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Receita não encontrada com ID: " + producao.getReceita().getId()));

        producao.setReceita(receita);

        producao.setReceita(receita);

        calcularCustosELucro(producao, receita);

        descontarEstoquePorLotes(receita, producao.getQuantidadeLotes());

        if (producao.getResultados() != null) {
            for (ProducaoResultado resultado : producao.getResultados()) {
                resultado.setProducao(producao); // Vínculo bidirecional

                if (resultado.getProduto() != null && resultado.getProduto().getId() != null) {
                    productService.adicionarEstoque(resultado.getProduto().getId(), resultado.getQuantidade());

                    var prod = productService.getProductById(resultado.getProduto().getId()).orElse(null);
                    if (prod != null)
                        resultado.setProduto(prod);
                }
            }
        }

        producao.setEstoqueDescontado(true);

        return producaoRepository.save(producao);
    }

    private void calcularCustosELucro(Producao producao, Receita receita) {
        double custoPorLote = 0.0;

        for (IngredienteDaReceita ingrediente : receita.getIngredientes()) {
            var produto = productRepository.findById(ingrediente.getProduto().getId()).orElse(null);
            if (produto != null && produto.getPrecoCompra() != null) {
                double quantidadeConvertida = ingrediente.getUnidadeMedida()
                        .converterPara(produto.getUnidadeMedida(), ingrediente.getQuantidadeNecessaria());
                custoPorLote += quantidadeConvertida * produto.getPrecoCompra();
            }
        }

        double custoTotal = custoPorLote * producao.getQuantidadeLotes();
        producao.setCustoTotal(custoTotal);

        producao.setLucroEstimado(0.0);
    }

    // Calcula as quantidades necessárias e desconta do estoque
    private void descontarEstoquePorLotes(Receita receita, Integer quantidadeLotes) {
        if (quantidadeLotes == null || quantidadeLotes <= 0) {
            throw new IllegalArgumentException("A quantidade de lotes deve ser maior que zero.");
        }

        if (receita.getIngredientes() == null || receita.getIngredientes().isEmpty()) {
            throw new IllegalArgumentException("A receita não possui ingredientes cadastrados.");
        }

        Map<Long, Double> quantidadesNecessarias = new HashMap<>();

        for (IngredienteDaReceita ingrediente : receita.getIngredientes()) {
            var produto = productService.getProductById(ingrediente.getProduto().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Produto não encontrado: " + ingrediente.getProduto().getNome()));

            double quantidadeNecessariaReceita = ingrediente.getQuantidadeNecessaria() * quantidadeLotes;
            double quantidadeNecessariaEstoque;

            // Lógica de Conversão Avançada
            try {
                boolean conversionStandardPossible = true;

                if (ingrediente.getUnidadeMedida() != produto.getUnidadeMedida()) {
                    if (ingrediente
                            .getUnidadeMedida() == CodingTechnology.SistemaDeGestao.Produtos.model.enums.UnidadeMedida.UN
                            || produto
                                    .getUnidadeMedida() == CodingTechnology.SistemaDeGestao.Produtos.model.enums.UnidadeMedida.UN) {
                        conversionStandardPossible = false;
                    }
                }

                if (conversionStandardPossible) {
                    quantidadeNecessariaEstoque = ingrediente.getUnidadeMedida()
                            .converterPara(produto.getUnidadeMedida(), quantidadeNecessariaReceita);
                } else {
                    Double pesoUnitario = produto.getPesoPorUnidade();

                    if (pesoUnitario == null || pesoUnitario <= 0) {
                        quantidadeNecessariaEstoque = ingrediente.getUnidadeMedida()
                                .converterPara(produto.getUnidadeMedida(), quantidadeNecessariaReceita);
                    } else {
                        if (ingrediente
                                .getUnidadeMedida() == CodingTechnology.SistemaDeGestao.Produtos.model.enums.UnidadeMedida.UN) {
                            quantidadeNecessariaEstoque = quantidadeNecessariaReceita * pesoUnitario;
                        } else if (produto
                                .getUnidadeMedida() == CodingTechnology.SistemaDeGestao.Produtos.model.enums.UnidadeMedida.UN) {
                            double qtdEmKgOuL = converterParaBase(ingrediente.getUnidadeMedida(),
                                    quantidadeNecessariaReceita);
                            quantidadeNecessariaEstoque = qtdEmKgOuL / pesoUnitario;
                        } else {
                            quantidadeNecessariaEstoque = quantidadeNecessariaReceita;
                        }
                    }
                }

            } catch (Exception e) {
                // Em caso de erro na conversão manual, tenta a padrão
                quantidadeNecessariaEstoque = ingrediente.getUnidadeMedida()
                        .converterPara(produto.getUnidadeMedida(), quantidadeNecessariaReceita);
            }

            quantidadesNecessarias.put(ingrediente.getProduto().getId(), quantidadeNecessariaEstoque);

            if (produto.getQuantidadeAtual() == null || produto.getQuantidadeAtual() < quantidadeNecessariaEstoque) {
                throw new IllegalArgumentException(
                        String.format("Estoque insuficiente de %s. Disponível: %.2f %s, Necessário: %.2f %s",
                                produto.getNome(),
                                produto.getQuantidadeAtual() != null ? produto.getQuantidadeAtual() : 0.0,
                                produto.getUnidadeMedida(),
                                quantidadeNecessariaEstoque,
                                produto.getUnidadeMedida()));
            }
        }

        for (Map.Entry<Long, Double> entry : quantidadesNecessarias.entrySet()) {
            productService.descontarEstoque(entry.getKey(), entry.getValue());
        }
    }

    // Helper simples para normalizar para KG ou L
    private double converterParaBase(CodingTechnology.SistemaDeGestao.Produtos.model.enums.UnidadeMedida origem,
            double valor) {
        switch (origem) {
            case G:
                return valor / 1000;
            case MG:
                return valor / 1000000;
            case ML:
                return valor / 1000;
            default:
                return valor; // Assumindo KG, L ou UN
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
        if (producao.getResultados() == null || producao.getResultados().isEmpty()) {
            if (producao.getQuantidadeProduzida() == null || producao.getQuantidadeProduzida() <= 0) {
                // Se não tem resultados detalhados, exige a quantidade produzida simples
                throw new IllegalArgumentException(
                        "A quantidade produzida deve ser maior que zero ou informe resultados detalhados.");
            }
        } else {
            // Se tem resultados, valida cada um
            for (ProducaoResultado resultado : producao.getResultados()) {
                if (resultado.getQuantidade() == null || resultado.getQuantidade() < 0) {
                    throw new IllegalArgumentException("A quantidade de um resultado não pode ser negativa.");
                }
                if (resultado.getUnidadeMedida() == null) {
                    throw new IllegalArgumentException("A unidade de medida do resultado é obrigatória.");
                }
            }
        }
    }
}