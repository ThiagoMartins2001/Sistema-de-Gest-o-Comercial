package CodingTechnology.SistemaDeGestao.producao.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import CodingTechnology.SistemaDeGestao.receita.model.entities.Receita;

@Entity
@Table(name = "producoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receita_id", nullable = false)
    private Receita receita;

    @Column(name = "quantidade_produzida", nullable = false)
    private Integer quantidadeProduzida;

    @Column(name = "data_producao", nullable = false)
    private LocalDateTime dataProducao;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "estoque_descontado", nullable = false)
    @Builder.Default
    private Boolean estoqueDescontado = false;

    // Define data de produção antes de salvar
    @PrePersist
    protected void onCreate() {
        if (dataProducao == null) {
            dataProducao = LocalDateTime.now();
        }
        if (estoqueDescontado == null) {
            estoqueDescontado = false;
        }
    }
}
