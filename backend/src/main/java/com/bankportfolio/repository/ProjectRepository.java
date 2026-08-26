package com.bankportfolio.repository;

import com.bankportfolio.entity.Project;
import com.bankportfolio.entity.enums.ProjectHealth;
import com.bankportfolio.entity.enums.ProjectPriority;
import com.bankportfolio.entity.enums.ProjectStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.projectManager) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Project> search(@Param("query") String query, Pageable pageable);

    Page<Project> findByPortfolioId(Long portfolioId, Pageable pageable);

    Page<Project> findByStatus(ProjectStatus status, Pageable pageable);

    Page<Project> findByHealth(ProjectHealth health, Pageable pageable);

    Page<Project> findByPriority(ProjectPriority priority, Pageable pageable);

    Page<Project> findByPortfolioIdAndStatus(Long portfolioId, ProjectStatus status, Pageable pageable);

    Page<Project> findByPortfolioIdAndHealth(Long portfolioId, ProjectHealth health, Pageable pageable);

    Page<Project> findByPortfolioIdAndPriority(Long portfolioId, ProjectPriority priority, Pageable pageable);

    long countByStatus(ProjectStatus status);

    long countByHealth(ProjectHealth health);

    long countByPriority(ProjectPriority priority);

    long countByPortfolioIdAndStatus(Long portfolioId, ProjectStatus status);

    long countByPortfolioIdAndHealth(Long portfolioId, ProjectHealth health);

    @Query("SELECT COALESCE(SUM(p.budget), 0) FROM Project p")
    BigDecimal sumAllBudgets();

    @Query("SELECT COALESCE(SUM(p.actualCost), 0) FROM Project p")
    BigDecimal sumAllActualCosts();

    @Query("SELECT COALESCE(SUM(p.budget), 0) FROM Project p WHERE p.portfolio.id = :portfolioId")
    BigDecimal sumBudgetsByPortfolioId(@Param("portfolioId") Long portfolioId);

    @Query("SELECT COALESCE(SUM(p.actualCost), 0) FROM Project p WHERE p.portfolio.id = :portfolioId")
    BigDecimal sumActualCostsByPortfolioId(@Param("portfolioId") Long portfolioId);

    List<Project> findByPortfolioId(Long portfolioId);
}
