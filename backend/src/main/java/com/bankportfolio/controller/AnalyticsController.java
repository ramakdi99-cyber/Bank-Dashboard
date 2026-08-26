package com.bankportfolio.controller;

import com.bankportfolio.dto.FinancialAnalytics;
import com.bankportfolio.dto.PortfolioAnalytics;
import com.bankportfolio.dto.ProjectAnalytics;
import com.bankportfolio.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/projects")
    public ResponseEntity<ProjectAnalytics> getProjectAnalytics() {
        return ResponseEntity.ok(analyticsService.getProjectAnalytics());
    }

    @GetMapping("/portfolios")
    public ResponseEntity<PortfolioAnalytics> getPortfolioAnalytics() {
        return ResponseEntity.ok(analyticsService.getPortfolioAnalytics());
    }

    @GetMapping("/financial")
    public ResponseEntity<FinancialAnalytics> getFinancialAnalytics() {
        return ResponseEntity.ok(analyticsService.getFinancialAnalytics());
    }
}
