package CodingTechnology.SistemaDeGestao.receita.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "receitas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Receita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "quantidade_padrao_produzida")
    private Integer quantidadePadraoProduzida;

    @Column(name = "preco_venda_sugerido")
    private Double precoVenda;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @OneToMany(mappedBy = "receita", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<IngredienteDaReceita> ingredientes = new ArrayList<>();

    // Adiciona um ingrediente à receita
    public void adicionarIngrediente(IngredienteDaReceita ingrediente) {
        ingredientes.add(ingrediente);
        ingrediente.setReceita(this);
    }

    // Remove um ingrediente da receita
    public void removerIngrediente(IngredienteDaReceita ingrediente) {
        ingredientes.remove(ingrediente);
        ingrediente.setReceita(null);
    }

    // Define data de criação antes de salvar
    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
    }

    // Atualiza data de atualização antes de modificar
    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }
}