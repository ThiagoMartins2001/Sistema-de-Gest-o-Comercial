package CodingTechnology.SistemaDeGestao.producao.controller;

import CodingTechnology.SistemaDeGestao.producao.model.entities.Producao;
import CodingTechnology.SistemaDeGestao.producao.service.ProducaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/producoes")
@RequiredArgsConstructor
public class ProducaoController {

    private final ProducaoService producaoService;

    // Registra uma nova produção e desconta automaticamente o estoque
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarProducao(@RequestBody Producao producao) {
        try {
            Producao producaoRegistrada = producaoService.registrarProducao(producao);
            return ResponseEntity.status(HttpStatus.CREATED).body(producaoRegistrada);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Lista todas as produções ordenadas por data (mais recentes primeiro)
    @GetMapping("/listar")
    public ResponseEntity<List<Producao>> listarProducoes() {
        List<Producao> producoes = producaoService.listarTodasProducoes();
        return ResponseEntity.ok(producoes);
    }

    // Busca uma produção por ID
    @GetMapping("/buscar/{id}")
    public ResponseEntity<Producao> buscarProducaoPorId(@PathVariable Long id) {
        return producaoService.buscarProducaoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Busca todas as produções de uma receita específica
    @GetMapping("/buscar-por-receita/{receitaId}")
    public ResponseEntity<List<Producao>> buscarProducoesPorReceita(@PathVariable Long receitaId) {
        List<Producao> producoes = producaoService.buscarProducoesPorReceita(receitaId);
        return ResponseEntity.ok(producoes);
    }
}