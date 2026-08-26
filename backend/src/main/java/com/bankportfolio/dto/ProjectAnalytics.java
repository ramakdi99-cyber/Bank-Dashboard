package com.bankportfolio.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectAnalytics {

    private long totalProjects;
    private long activeProjects;
    private long completedProjects;
    private long delayedProjects;
    private long onHoldProjects;
    private long plannedProjects;
    private long cancelledProjects;
    private Map<String, Long> statusDistribution;
    private Map<String, Long> healthDistribution;
    private Map<String, Long> priorityDistribution;
    private BigDecimal totalBudget;
    private BigDecimal totalActualCost;
    private BigDecimal averageCompletionPercentage;
    private long totalRisks;
    private long openRisks;
}
