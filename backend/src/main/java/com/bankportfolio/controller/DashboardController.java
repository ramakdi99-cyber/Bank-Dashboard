package com.bankportfolio.controller;

import com.bankportfolio.dto.DashboardAnalytics;
import com.bankportfolio.dto.DashboardSummary;
import com.bankportfolio.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummary> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/analytics")
    public ResponseEntity<DashboardAnalytics> getAnalytics() {
        return ResponseEntity.ok(dashboardService.getAnalytics());
    }
}
