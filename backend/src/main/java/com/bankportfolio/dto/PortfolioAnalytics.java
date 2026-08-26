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
public class PortfolioAnalytics {

    private long totalPortfolios;
    private long activePortfolios;
    private long completedPortfolios;
    private long onHoldPortfolios;
    private long inactivePortfolios;
    private Map<String, Long> statusDistribution;
    private Map<String, Long> healthDistribution;
    private BigDecimal totalBudget;
    private BigDecimal totalActualCost;
    private BigDecimal budgetUtilization;
    private List<PortfolioSummary> portfolios;
}
