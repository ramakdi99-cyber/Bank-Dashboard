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
public class DashboardAnalytics {

    private Map<String, Long> statusDistribution;
    private Map<String, Long> healthDistribution;
    private Map<String, Long> priorityDistribution;
    private List<BudgetVsActual> budgetVsActual;
    private List<PortfolioPerformance> portfolioPerformance;
    private List<ProjectUpdateDTO> recentUpdates;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BudgetVsActual {
        private String name;
        private BigDecimal budget;
        private BigDecimal actualCost;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PortfolioPerformance {
        private Long id;
        private String name;
        private BigDecimal completionPercentage;
        private String health;
        private long projectCount;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProjectUpdateDTO {
        private Long id;
        private String title;
        private String content;
        private String author;
        private String projectName;
        private java.time.LocalDateTime createdAt;
    }
}
