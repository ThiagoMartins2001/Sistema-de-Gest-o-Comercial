package CodingTechnology.SistemaDeGestao.dashboard.controller;

import CodingTechnology.SistemaDeGestao.dashboard.service.DashboardService;
import CodingTechnology.SistemaDeGestao.dashboard.DTO.DashboardStatsDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public DashboardStatsDTO getStats() {
        return dashboardService.getStats();
    }
}
