package CodingTechnology.SistemaDeGestao.receita.controller;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import CodingTechnology.SistemaDeGestao.receita.model.entities.Receita;
import CodingTechnology.SistemaDeGestao.receita.service.ReceitaService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/receitas")
@RequiredArgsConstructor
public class ReceitaController {

    private static final Logger log = LoggerFactory.getLogger(ReceitaController.class);
    private final ReceitaService receitaService;

    // Cria uma nova receita
    @PostMapping("/criar")
    public ResponseEntity<?> criarReceita(@RequestBody Receita receita) {
        log.debug("Recebendo requisição para criar receita: {}", receita.getNome());
        try {
            Receita receitaSalva = receitaService.salvarReceita(receita);
            log.debug("Receita criada com sucesso: {}", receitaSalva.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(receitaSalva);
        } catch (IllegalArgumentException e) {
            log.warn("Erro ao criar receita: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("timestamp", java.time.LocalDateTime.now());
            error.put("status", HttpStatus.BAD_REQUEST.value());
            error.put("error", "Bad Request");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            log.error("Erro inesperado ao criar receita", e);
            Map<String, Object> error = new HashMap<>();
            error.put("timestamp", java.time.LocalDateTime.now());
            error.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
            error.put("error", "Internal Server Error");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Lista todas as receitas cadastradas
    @GetMapping("/listar")
    public ResponseEntity<List<Receita>> listarReceitas() {
        List<Receita> receitas = receitaService.listarTodasReceitas();
        return ResponseEntity.ok(receitas);
    }

    // Busca uma receita por ID
    @GetMapping("/buscar/{id}")
    public ResponseEntity<Receita> buscarReceitaPorId(@PathVariable Long id) {
        return receitaService.buscarReceitaPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Busca receitas por nome (busca parcial)
    @GetMapping("/buscar")
    public ResponseEntity<List<Receita>> buscarReceitasPorNome(@RequestParam String nome) {
        List<Receita> receitas = receitaService.buscarReceitasPorNome(nome);
        return ResponseEntity.ok(receitas);
    }

    // Atualiza uma receita existente
    @PutMapping("/atualizar/{id}")
    public ResponseEntity<?> atualizarReceita(@PathVariable Long id, @RequestBody Receita receita) {
        try {
            Receita receitaAtualizada = receitaService.atualizarReceita(id, receita);
            return ResponseEntity.ok(receitaAtualizada);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Exclui uma receita por ID
    @DeleteMapping("/excluir/{id}")
    public ResponseEntity<?> excluirReceita(@PathVariable Long id) {
        try {
            receitaService.excluirReceita(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}