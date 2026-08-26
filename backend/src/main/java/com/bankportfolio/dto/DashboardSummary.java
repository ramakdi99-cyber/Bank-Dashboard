package com.bankportfolio.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummary {

    private long totalPortfolios;
    private long totalProjects;
    private long activeProjects;
    private long completedProjects;
    private long delayedProjects;
    private long atRiskProjects;
    private BigDecimal totalBudget;
    private BigDecimal totalActualCost;
    private long totalRisks;
    private long openRisks;
    private Map<String, Long> projectStatusDistribution;
    private Map<String, Long> projectHealthDistribution;
    private List<DashboardAnalytics.ProjectUpdateDTO> recentUpdates;
}
