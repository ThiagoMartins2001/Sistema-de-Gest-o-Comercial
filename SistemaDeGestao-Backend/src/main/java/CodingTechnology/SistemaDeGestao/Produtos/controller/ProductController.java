package CodingTechnology.SistemaDeGestao.Produtos.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import CodingTechnology.SistemaDeGestao.Produtos.model.entities.Product;
import CodingTechnology.SistemaDeGestao.Produtos.service.ProductService;
import CodingTechnology.SistemaDeGestao.Produtos.DTO.CreateProductDTO;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // Cadastra um novo produto
    @PostMapping("/create")
    public ResponseEntity<Product> createProduct(@RequestBody CreateProductDTO data) {
        Product product = new Product();
        product.setNome(data.getNome());
        product.setTipoControle(data.getTipoControle());
        product.setUnidadeMedida(data.getUnidadeMedida());
        product.setQuantidadeInicial(data.getQuantidadeInicial());
        product.setQuantidadeAtual(data.getQuantidadeAtual());
        product.setPrecoCompra(data.getPrecoCompra());
        product.setPrecoVenda(data.getPrecoVenda());

        Product savedProduct = productService.saveProduct(product);
        return ResponseEntity.ok(savedProduct);
    }

    // Lista todos os produtos cadastrados
    @GetMapping("/list")
    public ResponseEntity<List<Product>> listProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // Exclui um produto por ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProductById(id);
        return ResponseEntity.noContent().build();
    }

    // Exclui todos os produtos (apenas ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/all-reset")
    public ResponseEntity<Void> deleteAllProductsAndResetId() {
        org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ProductController.class);
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        if (auth != null) {
            log.info("Delete all-reset called by user: {} with authorities: {}",
                    auth.getName(),
                    auth.getAuthorities().stream()
                            .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                            .collect(Collectors.toList()));
        } else {
            log.warn("Delete all-reset called but no authentication found!");
        }

        productService.deleteAllProductsAndResetId();
        return ResponseEntity.noContent().build();
    }
}
