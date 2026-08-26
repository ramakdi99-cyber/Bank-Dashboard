package com.bankportfolio.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialAnalytics {

    private BigDecimal totalBudget;
    private BigDecimal totalActualCost;
    private BigDecimal totalVariance;
    private BigDecimal variancePercentage;
    private Map<String, BigDecimal> budgetByStatus;
    private Map<String, BigDecimal> actualCostByStatus;
    private BigDecimal averageProjectBudget;
    private BigDecimal averageProjectCost;
    private long totalProjects;
    private long overBudgetProjects;
    private long underBudgetProjects;
    private long onBudgetProjects;
}
