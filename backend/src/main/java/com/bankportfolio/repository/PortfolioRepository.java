package com.bankportfolio.repository;

import com.bankportfolio.entity.Portfolio;
import com.bankportfolio.entity.enums.PortfolioHealth;
import com.bankportfolio.entity.enums.PortfolioStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    @Query("SELECT p FROM Portfolio p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.owner) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Portfolio> search(@Param("query") String query, Pageable pageable);

    @Query("SELECT p FROM Portfolio p WHERE p.status = :status")
    Page<Portfolio> findByStatus(@Param("status") PortfolioStatus status, Pageable pageable);

    @Query("SELECT p FROM Portfolio p WHERE p.health = :health")
    Page<Portfolio> findByHealth(@Param("health") PortfolioHealth health, Pageable pageable);

    long countByStatus(PortfolioStatus status);

    long countByHealth(PortfolioHealth health);

    @Query("SELECT COALESCE(SUM(p.budget), 0) FROM Portfolio p")
    BigDecimal sumAllBudgets();

    @Query("SELECT COALESCE(SUM(p.actualCost), 0) FROM Portfolio p")
    BigDecimal sumAllActualCosts();

    @Query("SELECT p FROM Portfolio p WHERE p.status = :status AND p.health = :health")
    List<Portfolio> findByStatusAndHealth(@Param("status") PortfolioStatus status, @Param("health") PortfolioHealth health);
}
