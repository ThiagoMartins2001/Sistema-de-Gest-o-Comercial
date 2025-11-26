package CodingTechnology.SistemaDeGestao.receita.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import CodingTechnology.SistemaDeGestao.receita.model.entities.Receita;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReceitaRepository extends JpaRepository<Receita, Long> {

    Optional<Receita> findByNomeIgnoreCase(String nome);

    boolean existsByNomeIgnoreCase(String nome);

    List<Receita> findByNomeContainingIgnoreCase(String nome);

    @Query("SELECT DISTINCT r FROM Receita r LEFT JOIN FETCH r.ingredientes i LEFT JOIN FETCH i.produto WHERE r.id = :id")
    Optional<Receita> findByIdComIngredientes(@Param("id") Long id);

    @Query("SELECT DISTINCT r FROM Receita r LEFT JOIN FETCH r.ingredientes i LEFT JOIN FETCH i.produto")
    List<Receita> findAllComIngredientes();
}
