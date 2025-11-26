package CodingTechnology.SistemaDeGestao.receita.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import CodingTechnology.SistemaDeGestao.receita.model.entities.IngredienteDaReceita;

import java.util.List;

@Repository
public interface IngredienteDaReceitaRepository extends JpaRepository<IngredienteDaReceita, Long> {

    List<IngredienteDaReceita> findByReceitaId(Long receitaId);

    void deleteByReceitaId(Long receitaId);
}
