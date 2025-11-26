package CodingTechnology.SistemaDeGestao.Produtos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import CodingTechnology.SistemaDeGestao.Produtos.model.entities.Product;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByNomeIgnoreCase(String nome);
}
