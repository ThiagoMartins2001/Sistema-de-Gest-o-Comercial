package CodingTechnology.SistemaDeGestao.product.repository;

import CodingTechnology.SistemaDeGestao.product.model.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Aqui você pode adicionar métodos personalizados depois, se precisar
}
