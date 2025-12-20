package CodingTechnology.SistemaDeGestao.dashboard.controller;

import CodingTechnology.SistemaDeGestao.dashboard.service.DashboardFinancialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardFinancialController {

    private final DashboardFinancialService dashboardFinancialService;

    @GetMapping("/financials")
    public ResponseEntity<Map<String, Object>> getFinancials() {
        return ResponseEntity.ok(dashboardFinancialService.getFinancialSummary());
    }
}
