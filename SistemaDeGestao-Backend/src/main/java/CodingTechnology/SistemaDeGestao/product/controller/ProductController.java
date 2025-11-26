package CodingTechnology.SistemaDeGestao.product.controller;

import CodingTechnology.SistemaDeGestao.product.model.entities.Product;
import CodingTechnology.SistemaDeGestao.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    // Injeta o serviço de produto
    private final ProductService productService;

    /**
     * Endpoint para cadastrar um novo produto
     */
    @PostMapping("/create")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product savedProduct = productService.saveProduct(product);
        return ResponseEntity.ok(savedProduct);
    }

    /**
     * Endpoint para listar todos os produtos
     */
    @GetMapping("/list")
    public ResponseEntity<List<Product>> listProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProductById(id);
        return ResponseEntity.noContent().build();
    }

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