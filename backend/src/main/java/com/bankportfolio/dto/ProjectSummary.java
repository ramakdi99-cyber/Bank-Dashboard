package com.bankportfolio.dto;

import com.bankportfolio.entity.enums.ProjectHealth;
import com.bankportfolio.entity.enums.ProjectPriority;
import com.bankportfolio.entity.enums.ProjectStatus;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectSummary {

    private Long id;
    private String name;
    private String projectManager;
    private ProjectStatus status;
    private ProjectHealth health;
    private ProjectPriority priority;
    private BigDecimal budget;
    private BigDecimal completionPercentage;
    private Long portfolioId;
    private String portfolioName;
}
