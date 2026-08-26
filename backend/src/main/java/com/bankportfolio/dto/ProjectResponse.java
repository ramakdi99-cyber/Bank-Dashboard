package com.bankportfolio.dto;

import com.bankportfolio.entity.enums.ProjectHealth;
import com.bankportfolio.entity.enums.ProjectPriority;
import com.bankportfolio.entity.enums.ProjectStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectResponse {

    private Long id;
    private Long portfolioId;
    private String portfolioName;
    private String name;
    private String description;
    private String projectManager;
    private ProjectStatus status;
    private ProjectHealth health;
    private ProjectPriority priority;
    private BigDecimal budget;
    private BigDecimal actualCost;
    private BigDecimal completionPercentage;
    private LocalDate startDate;
    private LocalDate endDate;
    private int riskCount;
    private int updateCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
