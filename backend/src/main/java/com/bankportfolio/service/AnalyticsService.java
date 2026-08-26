package com.bankportfolio.service;

import com.bankportfolio.dto.*;
import com.bankportfolio.entity.Portfolio;
import com.bankportfolio.entity.enums.*;
import com.bankportfolio.repository.*;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final ProjectRepository projectRepository;
    private final PortfolioRepository portfolioRepository;
    private final ProjectRiskRepository projectRiskRepository;

    public AnalyticsService(ProjectRepository projectRepository,
                            PortfolioRepository portfolioRepository,
                            ProjectRiskRepository projectRiskRepository) {
        this.projectRepository = projectRepository;
        this.portfolioRepository = portfolioRepository;
        this.projectRiskRepository = projectRiskRepository;
    }

    @Transactional(readOnly = true)
    public ProjectAnalytics getProjectAnalytics() {
        long totalProjects = projectRepository.count();

        Map<String, Long> statusDistribution = new LinkedHashMap<>();
        long planned = projectRepository.countByStatus(ProjectStatus.PLANNED);
        long active = projectRepository.countByStatus(ProjectStatus.ACTIVE);
        long onHold = projectRepository.countByStatus(ProjectStatus.ON_HOLD);
        long completed = projectRepository.countByStatus(ProjectStatus.COMPLETED);
        long delayed = projectRepository.countByStatus(ProjectStatus.DELAYED);
        long cancelled = projectRepository.countByStatus(ProjectStatus.CANCELLED);
        statusDistribution.put("PLANNED", planned);
        statusDistribution.put("ACTIVE", active);
        statusDistribution.put("ON_HOLD", onHold);
        statusDistribution.put("COMPLETED", completed);
        statusDistribution.put("DELAYED", delayed);
        statusDistribution.put("CANCELLED", cancelled);

        Map<String, Long> healthDistribution = new LinkedHashMap<>();
        healthDistribution.put("GREEN", projectRepository.countByHealth(ProjectHealth.GREEN));
        healthDistribution.put("AMBER", projectRepository.countByHealth(ProjectHealth.AMBER));
        healthDistribution.put("RED", projectRepository.countByHealth(ProjectHealth.RED));

        Map<String, Long> priorityDistribution = new LinkedHashMap<>();
        priorityDistribution.put("LOW", projectRepository.countByPriority(ProjectPriority.LOW));
        priorityDistribution.put("MEDIUM", projectRepository.countByPriority(ProjectPriority.MEDIUM));
        priorityDistribution.put("HIGH", projectRepository.countByPriority(ProjectPriority.HIGH));
        priorityDistribution.put("CRITICAL", projectRepository.countByPriority(ProjectPriority.CRITICAL));

        BigDecimal totalBudget = projectRepository.sumAllBudgets();
        BigDecimal totalActualCost = projectRepository.sumAllActualCosts();

        List<com.bankportfolio.entity.Project> allProjects = projectRepository.findAll();
        BigDecimal avgCompletion = allProjects.stream()
                .map(com.bankportfolio.entity.Project::getCompletionPercentage)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        if (!allProjects.isEmpty()) {
            avgCompletion = avgCompletion.divide(BigDecimal.valueOf(allProjects.size()), 2, RoundingMode.HALF_UP);
        }

        long totalRisks = projectRiskRepository.count();
        long openRisks = projectRiskRepository.countByStatus(RiskStatus.OPEN);

        return ProjectAnalytics.builder()
                .totalProjects(totalProjects)
                .activeProjects(active)
                .completedProjects(completed)
                .delayedProjects(delayed)
                .onHoldProjects(onHold)
                .plannedProjects(planned)
                .cancelledProjects(cancelled)
                .statusDistribution(statusDistribution)
                .healthDistribution(healthDistribution)
                .priorityDistribution(priorityDistribution)
                .totalBudget(totalBudget != null ? totalBudget : BigDecimal.ZERO)
                .totalActualCost(totalActualCost != null ? totalActualCost : BigDecimal.ZERO)
                .averageCompletionPercentage(avgCompletion)
                .totalRisks(totalRisks)
                .openRisks(openRisks)
                .build();
    }

    @Transactional(readOnly = true)
    public PortfolioAnalytics getPortfolioAnalytics() {
        long totalPortfolios = portfolioRepository.count();
        long active = portfolioRepository.countByStatus(PortfolioStatus.ACTIVE);
        long completed = portfolioRepository.countByStatus(PortfolioStatus.COMPLETED);
        long onHold = portfolioRepository.countByStatus(PortfolioStatus.ON_HOLD);
        long inactive = portfolioRepository.countByStatus(PortfolioStatus.INACTIVE);

        Map<String, Long> statusDistribution = new LinkedHashMap<>();
        statusDistribution.put("ACTIVE", active);
        statusDistribution.put("INACTIVE", inactive);
        statusDistribution.put("COMPLETED", completed);
        statusDistribution.put("ON_HOLD", onHold);

        Map<String, Long> healthDistribution = new LinkedHashMap<>();
        healthDistribution.put("GREEN", portfolioRepository.countByHealth(PortfolioHealth.GREEN));
        healthDistribution.put("AMBER", portfolioRepository.countByHealth(PortfolioHealth.AMBER));
        healthDistribution.put("RED", portfolioRepository.countByHealth(PortfolioHealth.RED));

        BigDecimal totalBudget = portfolioRepository.sumAllBudgets();
        BigDecimal totalActualCost = portfolioRepository.sumAllActualCosts();

        BigDecimal budgetUtilization = BigDecimal.ZERO;
        if (totalBudget != null && totalBudget.compareTo(BigDecimal.ZERO) > 0 && totalActualCost != null) {
            budgetUtilization = totalActualCost.multiply(BigDecimal.valueOf(100))
                    .divide(totalBudget, 2, RoundingMode.HALF_UP);
        }

        List<PortfolioSummary> summaries = portfolioRepository.findAll().stream()
                .map(p -> {
                    long projectCount = projectRepository.countByPortfolioIdAndStatus(p.getId(), ProjectStatus.ACTIVE)
                            + projectRepository.countByPortfolioIdAndStatus(p.getId(), ProjectStatus.COMPLETED);
                    return PortfolioSummary.builder()
                            .id(p.getId())
                            .name(p.getName())
                            .status(p.getStatus())
                            .health(p.getHealth())
                            .budget(p.getBudget())
                            .completionPercentage(p.getCompletionPercentage())
                            .projectCount((int) projectCount)
                            .build();
                })
                .collect(Collectors.toList());

        return PortfolioAnalytics.builder()
                .totalPortfolios(totalPortfolios)
                .activePortfolios(active)
                .completedPortfolios(completed)
                .onHoldPortfolios(onHold)
                .inactivePortfolios(inactive)
                .statusDistribution(statusDistribution)
                .healthDistribution(healthDistribution)
                .totalBudget(totalBudget != null ? totalBudget : BigDecimal.ZERO)
                .totalActualCost(totalActualCost != null ? totalActualCost : BigDecimal.ZERO)
                .budgetUtilization(budgetUtilization)
                .portfolios(summaries)
                .build();
    }

    @Transactional(readOnly = true)
    public FinancialAnalytics getFinancialAnalytics() {
        BigDecimal totalBudget = projectRepository.sumAllBudgets();
        BigDecimal totalActualCost = projectRepository.sumAllActualCosts();
        if (totalBudget == null) totalBudget = BigDecimal.ZERO;
        if (totalActualCost == null) totalActualCost = BigDecimal.ZERO;

        BigDecimal totalVariance = totalBudget.subtract(totalActualCost);
        BigDecimal variancePercentage = BigDecimal.ZERO;
        if (totalBudget.compareTo(BigDecimal.ZERO) > 0) {
            variancePercentage = totalVariance.multiply(BigDecimal.valueOf(100))
                    .divide(totalBudget, 2, RoundingMode.HALF_UP);
        }

        Map<String, BigDecimal> budgetByStatus = new LinkedHashMap<>();
        Map<String, BigDecimal> actualCostByStatus = new LinkedHashMap<>();
        for (ProjectStatus status : ProjectStatus.values()) {
            List<com.bankportfolio.entity.Project> projects = projectRepository.findByStatus(status, Pageable.unpaged()).getContent();
            BigDecimal statusBudget = projects.stream()
                    .map(com.bankportfolio.entity.Project::getBudget)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal statusCost = projects.stream()
                    .map(com.bankportfolio.entity.Project::getActualCost)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            budgetByStatus.put(status.name(), statusBudget);
            actualCostByStatus.put(status.name(), statusCost);
        }

        long totalProjects = projectRepository.count();
        BigDecimal averageProjectBudget = BigDecimal.ZERO;
        BigDecimal averageProjectCost = BigDecimal.ZERO;
        if (totalProjects > 0) {
            averageProjectBudget = totalBudget.divide(BigDecimal.valueOf(totalProjects), 2, RoundingMode.HALF_UP);
            averageProjectCost = totalActualCost.divide(BigDecimal.valueOf(totalProjects), 2, RoundingMode.HALF_UP);
        }

        List<com.bankportfolio.entity.Project> allProjects = projectRepository.findAll();
        long overBudget = allProjects.stream()
                .filter(p -> p.getActualCost().compareTo(p.getBudget()) > 0)
                .count();
        long underBudget = allProjects.stream()
                .filter(p -> p.getActualCost().compareTo(p.getBudget()) < 0)
                .count();
        long onBudget = allProjects.stream()
                .filter(p -> p.getActualCost().compareTo(p.getBudget()) == 0)
                .count();

        return FinancialAnalytics.builder()
                .totalBudget(totalBudget)
                .totalActualCost(totalActualCost)
                .totalVariance(totalVariance)
                .variancePercentage(variancePercentage)
                .budgetByStatus(budgetByStatus)
                .actualCostByStatus(actualCostByStatus)
                .averageProjectBudget(averageProjectBudget)
                .averageProjectCost(averageProjectCost)
                .totalProjects(totalProjects)
                .overBudgetProjects(overBudget)
                .underBudgetProjects(underBudget)
                .onBudgetProjects(onBudget)
                .build();
    }
}
