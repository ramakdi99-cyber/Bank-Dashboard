package com.bankportfolio.service;

import com.bankportfolio.dto.DashboardAnalytics;
import com.bankportfolio.dto.DashboardSummary;
import com.bankportfolio.entity.enums.*;
import com.bankportfolio.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final PortfolioRepository portfolioRepository;
    private final ProjectRepository projectRepository;
    private final ProjectRiskRepository projectRiskRepository;
    private final ProjectUpdateRepository projectUpdateRepository;

    public DashboardService(PortfolioRepository portfolioRepository,
                            ProjectRepository projectRepository,
                            ProjectRiskRepository projectRiskRepository,
                            ProjectUpdateRepository projectUpdateRepository) {
        this.portfolioRepository = portfolioRepository;
        this.projectRepository = projectRepository;
        this.projectRiskRepository = projectRiskRepository;
        this.projectUpdateRepository = projectUpdateRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummary getSummary() {
        long totalPortfolios = portfolioRepository.count();
        long totalProjects = projectRepository.count();
        long activeProjects = projectRepository.countByStatus(ProjectStatus.ACTIVE);
        long completedProjects = projectRepository.countByStatus(ProjectStatus.COMPLETED);
        long delayedProjects = projectRepository.countByStatus(ProjectStatus.DELAYED);
        long atRiskProjects = projectRepository.countByHealth(ProjectHealth.RED);
        BigDecimal totalBudget = projectRepository.sumAllBudgets();
        BigDecimal totalActualCost = projectRepository.sumAllActualCosts();
        long totalRisks = projectRiskRepository.count();
        long openRisks = projectRiskRepository.countByStatus(RiskStatus.OPEN);

        Map<String, Long> statusDistribution = new LinkedHashMap<>();
        statusDistribution.put("PLANNED", projectRepository.countByStatus(ProjectStatus.PLANNED));
        statusDistribution.put("ACTIVE", activeProjects);
        statusDistribution.put("ON_HOLD", projectRepository.countByStatus(ProjectStatus.ON_HOLD));
        statusDistribution.put("COMPLETED", completedProjects);
        statusDistribution.put("DELAYED", delayedProjects);
        statusDistribution.put("CANCELLED", projectRepository.countByStatus(ProjectStatus.CANCELLED));

        Map<String, Long> healthDistribution = new LinkedHashMap<>();
        healthDistribution.put("GREEN", projectRepository.countByHealth(ProjectHealth.GREEN));
        healthDistribution.put("AMBER", projectRepository.countByHealth(ProjectHealth.AMBER));
        healthDistribution.put("RED", projectRepository.countByHealth(ProjectHealth.RED));

        List<DashboardAnalytics.ProjectUpdateDTO> recentUpdates = projectUpdateRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(update -> DashboardAnalytics.ProjectUpdateDTO.builder()
                        .id(update.getId())
                        .title(update.getTitle())
                        .content(update.getContent())
                        .author(update.getAuthor())
                        .projectName(update.getProject().getName())
                        .createdAt(update.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return DashboardSummary.builder()
                .totalPortfolios(totalPortfolios)
                .totalProjects(totalProjects)
                .activeProjects(activeProjects)
                .completedProjects(completedProjects)
                .delayedProjects(delayedProjects)
                .atRiskProjects(atRiskProjects)
                .totalBudget(totalBudget != null ? totalBudget : BigDecimal.ZERO)
                .totalActualCost(totalActualCost != null ? totalActualCost : BigDecimal.ZERO)
                .totalRisks(totalRisks)
                .openRisks(openRisks)
                .projectStatusDistribution(statusDistribution)
                .projectHealthDistribution(healthDistribution)
                .recentUpdates(recentUpdates)
                .build();
    }

    @Transactional(readOnly = true)
    public DashboardAnalytics getAnalytics() {
        Map<String, Long> statusDistribution = new LinkedHashMap<>();
        statusDistribution.put("PLANNED", projectRepository.countByStatus(ProjectStatus.PLANNED));
        statusDistribution.put("ACTIVE", projectRepository.countByStatus(ProjectStatus.ACTIVE));
        statusDistribution.put("ON_HOLD", projectRepository.countByStatus(ProjectStatus.ON_HOLD));
        statusDistribution.put("COMPLETED", projectRepository.countByStatus(ProjectStatus.COMPLETED));
        statusDistribution.put("DELAYED", projectRepository.countByStatus(ProjectStatus.DELAYED));
        statusDistribution.put("CANCELLED", projectRepository.countByStatus(ProjectStatus.CANCELLED));

        Map<String, Long> healthDistribution = new LinkedHashMap<>();
        healthDistribution.put("GREEN", projectRepository.countByHealth(ProjectHealth.GREEN));
        healthDistribution.put("AMBER", projectRepository.countByHealth(ProjectHealth.AMBER));
        healthDistribution.put("RED", projectRepository.countByHealth(ProjectHealth.RED));

        Map<String, Long> priorityDistribution = new LinkedHashMap<>();
        priorityDistribution.put("LOW", projectRepository.countByPriority(ProjectPriority.LOW));
        priorityDistribution.put("MEDIUM", projectRepository.countByPriority(ProjectPriority.MEDIUM));
        priorityDistribution.put("HIGH", projectRepository.countByPriority(ProjectPriority.HIGH));
        priorityDistribution.put("CRITICAL", projectRepository.countByPriority(ProjectPriority.CRITICAL));

        List<DashboardAnalytics.BudgetVsActual> budgetVsActual = portfolioRepository.findAll().stream()
                .map(portfolio -> {
                    BigDecimal portfolioBudget = projectRepository.sumBudgetsByPortfolioId(portfolio.getId());
                    BigDecimal portfolioActual = projectRepository.sumActualCostsByPortfolioId(portfolio.getId());
                    return DashboardAnalytics.BudgetVsActual.builder()
                            .name(portfolio.getName())
                            .budget(portfolioBudget != null ? portfolioBudget : BigDecimal.ZERO)
                            .actualCost(portfolioActual != null ? portfolioActual : BigDecimal.ZERO)
                            .build();
                })
                .collect(Collectors.toList());

        List<DashboardAnalytics.PortfolioPerformance> portfolioPerformance = portfolioRepository.findAll().stream()
                .map(portfolio -> {
                    long projectCount = projectRepository.countByPortfolioIdAndStatus(portfolio.getId(), ProjectStatus.ACTIVE)
                            + projectRepository.countByPortfolioIdAndStatus(portfolio.getId(), ProjectStatus.COMPLETED);
                    return DashboardAnalytics.PortfolioPerformance.builder()
                            .id(portfolio.getId())
                            .name(portfolio.getName())
                            .completionPercentage(portfolio.getCompletionPercentage())
                            .health(portfolio.getHealth().name())
                            .projectCount(projectCount)
                            .build();
                })
                .collect(Collectors.toList());

        List<DashboardAnalytics.ProjectUpdateDTO> recentUpdates = projectUpdateRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(update -> DashboardAnalytics.ProjectUpdateDTO.builder()
                        .id(update.getId())
                        .title(update.getTitle())
                        .content(update.getContent())
                        .author(update.getAuthor())
                        .projectName(update.getProject().getName())
                        .createdAt(update.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return DashboardAnalytics.builder()
                .statusDistribution(statusDistribution)
                .healthDistribution(healthDistribution)
                .priorityDistribution(priorityDistribution)
                .budgetVsActual(budgetVsActual)
                .portfolioPerformance(portfolioPerformance)
                .recentUpdates(recentUpdates)
                .build();
    }
}
