package CodingTechnology.SistemaDeGestao.product.service;

import CodingTechnology.SistemaDeGestao.product.model.entities.Product;
import CodingTechnology.SistemaDeGestao.product.repository.ProductRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    // Injeta o repositório para acessar o banco de dados
    private final ProductRepository productRepository;

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Salva um novo produto no banco de dados
     */
    public Product saveProduct(Product product) {
        if (product.getNome() == null || product.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome do produto é obrigatório.");
        }
        if (product.getTipoControle() == null || product.getTipoControle().isBlank()) {
            throw new IllegalArgumentException("O tipo de controle é obrigatório.");
        }
        if (product.getUnidadeMedida() == null || product.getUnidadeMedida().isBlank()) {
            throw new IllegalArgumentException("A unidade de medida é obrigatória.");
        }

        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public void deleteProductById(Long id) {
        productRepository.deleteById(id);
    }

    public void deleteAllProductsAndResetId() {
        productRepository.deleteAll();
        entityManager.createNativeQuery("ALTER TABLE products AUTO_INCREMENT = 1").executeUpdate();
    }
}