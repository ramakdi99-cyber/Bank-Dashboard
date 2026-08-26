package com.bankportfolio.repository;

import com.bankportfolio.entity.ProjectRisk;
import com.bankportfolio.entity.enums.RiskSeverity;
import com.bankportfolio.entity.enums.RiskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRiskRepository extends JpaRepository<ProjectRisk, Long> {

    List<ProjectRisk> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    List<ProjectRisk> findByProjectId(Long projectId);

    long countByStatus(RiskStatus status);

    long countBySeverity(RiskSeverity severity);

    long countByProjectIdAndStatus(Long projectId, RiskStatus status);

    long countByProjectIdAndSeverity(Long projectId, RiskSeverity severity);
}
