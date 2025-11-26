package CodingTechnology.SistemaDeGestao.producao.repository;

import CodingTechnology.SistemaDeGestao.producao.model.entities.Producao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProducaoRepository extends JpaRepository<Producao, Long> {

    List<Producao> findByReceitaId(Long receitaId);

    @Query("SELECT p FROM Producao p WHERE p.dataProducao BETWEEN :dataInicio AND :dataFim ORDER BY p.dataProducao DESC")
    List<Producao> findByPeriodo(@Param("dataInicio") LocalDateTime dataInicio, @Param("dataFim") LocalDateTime dataFim);

    @Query("SELECT p FROM Producao p ORDER BY p.dataProducao DESC")
    List<Producao> findTodasOrdenadasPorData();
}
