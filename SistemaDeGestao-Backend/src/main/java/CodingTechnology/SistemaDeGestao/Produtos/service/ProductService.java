package CodingTechnology.SistemaDeGestao.Produtos.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import CodingTechnology.SistemaDeGestao.Produtos.model.entities.Product;
import CodingTechnology.SistemaDeGestao.Produtos.repository.ProductRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // Salva um novo produto no banco de dados
    public Product saveProduct(Product product) {
        if (product.getNome() == null || product.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome do produto é obrigatório.");
        }
        if (product.getTipoControle() == null || product.getTipoControle().isBlank()) {
            throw new IllegalArgumentException("O tipo de controle é obrigatório.");
        }
        if (product.getUnidadeMedida() == null) {
            throw new IllegalArgumentException("A unidade de medida é obrigatória.");
        }

        return productRepository.save(product);
    }

    // Lista todos os produtos cadastrados
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Busca um produto por ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Exclui um produto por ID
    public void deleteProductById(Long id) {
        productRepository.deleteById(id);
    }

    // Exclui todos os produtos do banco de dados
    public void deleteAllProductsAndResetId() {
        productRepository.deleteAll();
    }

    // Desconta quantidade do estoque de um produto
    @Transactional
    public void descontarEstoque(Long produtoId, Double quantidadeDescontar) {
        Product produto = productRepository.findById(produtoId)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado com ID: " + produtoId));

        if (produto.getQuantidadeAtual() == null) {
            produto.setQuantidadeAtual(0.0);
        }

        if (quantidadeDescontar <= 0) {
            throw new IllegalArgumentException("A quantidade a descontar deve ser maior que zero.");
        }

        double novaQuantidade = produto.getQuantidadeAtual() - quantidadeDescontar;

        if (novaQuantidade < 0) {
            throw new IllegalArgumentException(
                    String.format("Estoque insuficiente. Disponível: %.2f %s, Necessário: %.2f %s",
                            produto.getQuantidadeAtual(),
                            produto.getUnidadeMedida(),
                            quantidadeDescontar,
                            produto.getUnidadeMedida()));
        }

        produto.setQuantidadeAtual(novaQuantidade);
        productRepository.save(produto);
    }

    // Adiciona quantidade ao estoque de um produto
    @Transactional
    public void adicionarEstoque(Long produtoId, Double quantidadeAdicionar) {
        Product produto = productRepository.findById(produtoId)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado com ID: " + produtoId));

        if (produto.getQuantidadeAtual() == null) {
            produto.setQuantidadeAtual(0.0);
        }

        if (quantidadeAdicionar <= 0) {
            throw new IllegalArgumentException("A quantidade a adicionar deve ser maior que zero.");
        }

        produto.setQuantidadeAtual(produto.getQuantidadeAtual() + quantidadeAdicionar);
        productRepository.save(produto);
    }
}
