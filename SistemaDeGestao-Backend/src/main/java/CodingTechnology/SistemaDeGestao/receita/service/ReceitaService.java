package CodingTechnology.SistemaDeGestao.receita.service;

import CodingTechnology.SistemaDeGestao.Produtos.model.entities.Product;
import CodingTechnology.SistemaDeGestao.Produtos.repository.ProductRepository;
import CodingTechnology.SistemaDeGestao.receita.model.entities.IngredienteDaReceita;
import CodingTechnology.SistemaDeGestao.receita.model.entities.Receita;
import CodingTechnology.SistemaDeGestao.receita.repository.IngredienteDaReceitaRepository;
import CodingTechnology.SistemaDeGestao.receita.repository.ReceitaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReceitaService {

    private final ReceitaRepository receitaRepository;
    private final IngredienteDaReceitaRepository ingredienteDaReceitaRepository;
    private final ProductRepository productRepository;

    // Salva uma nova receita no banco de dados
    @Transactional
    public Receita salvarReceita(Receita receita) {
        validarReceita(receita);

        if (receita.getId() == null && receitaRepository.existsByNomeIgnoreCase(receita.getNome())) {
            throw new IllegalArgumentException("Já existe uma receita com o nome: " + receita.getNome());
        }

        if (receita.getIngredientes() != null && !receita.getIngredientes().isEmpty()) {
            for (IngredienteDaReceita ingrediente : receita.getIngredientes()) {
                validarIngrediente(ingrediente);
                ingrediente.setReceita(receita);
            }
        }

        return receitaRepository.save(receita);
    }

    // Lista todas as receitas cadastradas
    public List<Receita> listarTodasReceitas() {
        return receitaRepository.findAllComIngredientes();
    }

    // Busca uma receita por ID com seus ingredientes
    public Optional<Receita> buscarReceitaPorId(Long id) {
        return receitaRepository.findByIdComIngredientes(id);
    }

    // Busca receitas por nome (busca parcial)
    public List<Receita> buscarReceitasPorNome(String nome) {
        return receitaRepository.findByNomeContainingIgnoreCase(nome);
    }

    // Atualiza uma receita existente
    @Transactional
    public Receita atualizarReceita(Long id, Receita receitaAtualizada) {
        Receita receitaExistente = receitaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Receita não encontrada com ID: " + id));

        validarReceita(receitaAtualizada);

        receitaExistente.setNome(receitaAtualizada.getNome());
        receitaExistente.setDescricao(receitaAtualizada.getDescricao());
        receitaExistente.setQuantidadePadraoProduzida(receitaAtualizada.getQuantidadePadraoProduzida());

        ingredienteDaReceitaRepository.deleteByReceitaId(id);
        receitaExistente.getIngredientes().clear();

        if (receitaAtualizada.getIngredientes() != null) {
            for (IngredienteDaReceita ingrediente : receitaAtualizada.getIngredientes()) {
                validarIngrediente(ingrediente);
                receitaExistente.adicionarIngrediente(ingrediente);
            }
        }

        return receitaRepository.save(receitaExistente);
    }

    // Exclui uma receita por ID
    @Transactional
    public void excluirReceita(Long id) {
        if (!receitaRepository.existsById(id)) {
            throw new IllegalArgumentException("Receita não encontrada com ID: " + id);
        }
        receitaRepository.deleteById(id);
    }

    // Valida os dados básicos de uma receita
    private void validarReceita(Receita receita) {
        if (receita.getNome() == null || receita.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome da receita é obrigatório.");
        }
        if (receita.getQuantidadePadraoProduzida() != null && receita.getQuantidadePadraoProduzida() <= 0) {
            throw new IllegalArgumentException("A quantidade padrão produzida deve ser maior que zero.");
        }
    }

    // Valida um ingrediente da receita - aceita ID ou nome do produto
    private void validarIngrediente(IngredienteDaReceita ingrediente) {
        Product produto = null;

        if (ingrediente.getProduto() == null) {
            throw new IllegalArgumentException("O produto do ingrediente é obrigatório. Informe o ID ou o nome do produto.");
        }

        // Tenta buscar por ID primeiro (se fornecido)
        if (ingrediente.getProduto().getId() != null) {
            produto = productRepository.findById(ingrediente.getProduto().getId())
                    .orElse(null);
        }

        // Se não encontrou por ID, tenta buscar por nome (se fornecido)
        if (produto == null && ingrediente.getProduto().getNome() != null && !ingrediente.getProduto().getNome().isBlank()) {
            produto = productRepository.findByNomeIgnoreCase(ingrediente.getProduto().getNome())
                    .orElse(null);
        }

        // Se ainda não encontrou, lança erro informativo
        if (produto == null) {
            String identificador = ingrediente.getProduto().getId() != null
                    ? "ID: " + ingrediente.getProduto().getId()
                    : "nome: " + ingrediente.getProduto().getNome();
            throw new IllegalArgumentException(
                    "Produto não encontrado com " + identificador + ". Verifique se o produto existe na lista de produtos cadastrados.");
        }

        // Atribui o produto encontrado ao ingrediente
        ingrediente.setProduto(produto);

        // Valida quantidade
        if (ingrediente.getQuantidadeNecessaria() == null || ingrediente.getQuantidadeNecessaria() <= 0) {
            throw new IllegalArgumentException("A quantidade necessária do ingrediente deve ser maior que zero.");
        }
    }
}
